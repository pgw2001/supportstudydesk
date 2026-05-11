export const TODO_STYLES = `
  .todo-list-container::-webkit-scrollbar {
    width: 4px;
  }
  .todo-list-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .todo-list-container::-webkit-scrollbar-thumb {
    background: #dbdbdb;
    border-radius: 10px;
  }
  .todo-list-container {
    scrollbar-width: thin;
    scrollbar-color: #dbdbdb transparent;
  }
  .todo-list-switch {
    position: absolute;
    top: 50%;
    z-index: 4;
    border: 0;
    background: transparent;
    padding: 0;
    opacity: 0; /* Hide by default */
    transition: opacity 0.2s;
    transform: translateY(-50%);
    width: 40px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .todo-list-widget-root:hover .todo-list-switch {
    opacity: 1; /* Show on hover */
  }
  .todo-list-switch:disabled {
    opacity: 0.25;
    cursor: default;
  }
  .todo-list-triangle-left,
  .todo-list-triangle-right {
    display: block;
    width: 0;
    height: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .todo-list-create {
    position: absolute;
    right: -32px;
    top: 49%;
    z-index: 4;
    width: 25px;
    height: 25px;
    border-radius: 999px;
    border: none;
    background: rgba(216, 216, 216, 0.4);
    color: transparent;
    transform: translateY(-50%);
    cursor: pointer;
    box-shadow: 1px 2px 0 rgba(0, 0, 0, 0.18);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .todo-list-widget-root:hover .todo-list-create {
    opacity: 1;
  }
  .todo-list-create::before,
  .todo-list-create::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    background: #555;
    border: none;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
  }
  .todo-list-create::before {
    width: 12px;
    height: 2px;
  }
  .todo-list-create::after {
    width: 2px;
    height: 12px;
  }
`;