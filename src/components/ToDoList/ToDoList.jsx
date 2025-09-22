import React, { useState, useEffect } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { FaPencilRuler } from "react-icons/fa";
import styles from "./ToDoList.module.css";

export default function ToDoList() {
  const [toDo, setToDo] = useState("");
  const [toDoList, setToDoList] = useState(() => {
    //Load fra localStorage ved render
    const saved = localStorage.getItem("todoList");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);

  //Gem til localStorage når listen ændres
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(toDoList));
  }, [toDoList]);

  const handleChange = (e) => {
    setToDo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (toDo.trim()) {
      setToDoList([...toDoList, toDo]);
      setToDo("");
    }
  };

  const removeItem = (indexToRemove) => {
    setToDoList(toDoList.filter((_, index) => index !== indexToRemove));
  };

  const handleEdit = (index, newValue) => {
    if (newValue.trim()) {
      const updatedList = [...toDoList];
      updatedList[index] = newValue.trim();
      setToDoList(updatedList);
    }
    setEditingIndex(null);
  };

  return (
    <div className={styles.todolist}>
      <h2>To-Do-liste</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" value={toDo} onChange={handleChange} />
        <button type="submit" className={styles.submitBtn}>
          Tilføj
        </button>
      </form>
      <ul>
        {toDoList.map((item, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <input
                type="text"
                defaultValue={item}
                onBlur={(e) => handleEdit(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEdit(index, e.target.value);
                  if (e.key === "Escape") setEditingIndex(null);
                }}
                autoFocus
              />
            ) : (
              <span>{item}</span>
            )}
            <button
              onClick={() => setEditingIndex(index)}
              className={styles.editBtn}
            >
              <FaPencilRuler color="green" size={18} />
            </button>
            <button
              onClick={() => removeItem(index)}
              className={styles.removeBtn}
            >
              <IoCloseCircle color="#E61240" size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
