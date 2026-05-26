import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

// 저장
export const saveUserData =
  async (uid, data) => {

    if (!uid) return;

    try {

      await setDoc(
        doc(db, "users", uid),
        data,
        { merge: true }
      );

    } catch (error) {

      console.log(error);

    }
  };

// 불러오기
export const loadUserData =
  async (uid) => {

    if (!uid) return null;

    try {

      const snapshot =
        await getDoc(
          doc(db, "users", uid)
        );

      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.data();

    } catch (error) {

      console.log(error);

      return null;
    }
  };