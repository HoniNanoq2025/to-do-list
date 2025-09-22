import styles from "./App.module.css";
import ToDoList from "./components/ToDoList/ToDoList";

export default function App() {
  return (
    <div className={styles.app}>
      <ToDoList />
    </div>
  );
}
