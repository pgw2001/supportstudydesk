import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../services/firebase";

const TODO_STORAGE_VERSION = 1;

const createId = (prefix) => {
  if (
    typeof crypto !==
      "undefined" &&
    crypto.randomUUID
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

export const createTodo =
  () => ({
    id: createId("todo"),
    text: "",
    completed: false,
  });

export const createEmptyTodos =
  () =>
    Array.from(
      { length: 5 },
      () => createTodo()
    );

export const createTodoList =
  (number = 1) => ({
    id: createId(
      "todo-list"
    ),

    title:
      number === 1
        ? "Todo"
        : `Todo ${number}`,

    todos:
      createEmptyTodos(),
  });

const normalizeTodo = (
  todo
) => ({
  id:
    typeof todo?.id ===
    "string"
      ? todo.id
      : createId("todo"),

  text:
    typeof todo?.text ===
    "string"
      ? todo.text
      : "",

  completed: Boolean(
    todo?.completed
  ),
});

const normalizeList = (
  list,
  index
) => ({
  id:
    typeof list?.id ===
    "string"
      ? list.id
      : createId(
          "todo-list"
        ),

  title:
    typeof list?.title ===
      "string" &&
    list.title.trim()
      ? list.title
      : index === 0
      ? "Todo"
      : `Todo ${
          index + 1
        }`,

  todos:
    Array.isArray(
      list?.todos
    ) &&
    list.todos.length > 0
      ? list.todos.map(
          normalizeTodo
        )
      : createEmptyTodos(),
});

const normalizeTodoData =
  (data) => {
    const lists =
      Array.isArray(
        data?.lists
      ) &&
      data.lists.length > 0
        ? data.lists.map(
            normalizeList
          )
        : [createTodoList()];

    const currentListIndex =
      Number.isInteger(
        data?.currentListIndex
      )
        ? Math.min(
            Math.max(
              data.currentListIndex,
              0
            ),
            lists.length - 1
          )
        : 0;

    return {
      version:
        TODO_STORAGE_VERSION,

      currentListIndex,

      listCount:
        lists.length,

      lists,
    };
  };

export const loadTodoData =
  async () => {
    const user =
      auth.currentUser;

    // guest mode
    if (
      !user?.uid ||
      user?.isGuest
    ) {
      return normalizeTodoData();
    }

    try {
      const snap =
        await getDoc(
          doc(
            db,
            "todoData",
            user.uid
          )
        );

      if (snap.exists()) {
        return normalizeTodoData(
          snap.data()
        );
      }

      return normalizeTodoData();
    } catch {
      return normalizeTodoData();
    }
  };

export const saveTodoData =
  async ({
    lists,
    currentListIndex,
  }) => {
    const user =
      auth.currentUser;

    // guest mode
    if (
      !user?.uid ||
      user?.isGuest
    )
      return;

    const data =
      normalizeTodoData({
        lists,
        currentListIndex,
      });

    try {
      await setDoc(
        doc(
          db,
          "todoData",
          user.uid
        ),
        data
      );
    } catch (error) {
      console.log(error);
    }
  };