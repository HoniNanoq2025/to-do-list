import React, { useState, useEffect } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { FaPencilRuler } from "react-icons/fa";
import styles from "./ToDoList.module.css";

export default function ToDoList() {
  // State til at holde den aktuelle tekst i input feltet
  const [toDo, setToDo] = useState("");

  // State til at holde hele listen af opgaver
  // Initialiseres med data fra localStorage hvis det findes
  const [toDoList, setToDoList] = useState(() => {
    //Indlæs fra localStorage ved første render
    const saved = localStorage.getItem("todoList");
    return saved ? JSON.parse(saved) : []; //Hvis saved eksisterer, så returner JSON.parse(saved), ellers returner []
  });

  // State til at holde styr på hvilket element der redigeres (null = intet redigeres)
  const [editingIndex, setEditingIndex] = useState(null);

  // useEffect hook til at gemme listen i localStorage hver gang den ændres
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(toDoList));
  }, [toDoList]); // Kører kun når toDoList ændres

  // Håndterer ændringer i input feltet
  const handleChange = (e) => {
    setToDo(e.target.value);
  };

  // Håndterer form submission (når man trykker "Tilføj" eller Enter)
  const handleSubmit = (e) => {
    e.preventDefault(); // Forhindrer siden i at genindlæse
    if (toDo.trim()) {
      // Tjekker at der faktisk er indhold (ikke kun mellemrum)
      setToDoList([...toDoList, toDo]); // Tilføjer ny opgave til listen
      setToDo(""); // Rydder input feltet
    }
  };

  // Fjerner en opgave fra listen baseret på dens index
  const removeItem = (indexToRemove) => {
    setToDoList(toDoList.filter((_, index) => index !== indexToRemove));
  };

  // Håndterer redigering af en eksisterende opgave
  const handleEdit = (index, newValue) => {
    if (newValue.trim()) {
      // Tjekker at der er indhold i den nye værdi
      const updatedList = [...toDoList]; // Laver en kopi af listen
      updatedList[index] = newValue.trim(); // Opdaterer den specifikke opgave
      setToDoList(updatedList); // Gemmer den opdaterede liste
    }
    setEditingIndex(null); // Afslutter redigeringstilstanden
  };

  return (
    <div className={styles.todolist}>
      <h2>To-Do-liste</h2>

      {/* Formular til at tilføje nye opgaver */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" value={toDo} onChange={handleChange} />
        <button type="submit" className={styles.submitBtn}>
          Tilføj
        </button>
      </form>

      {/* Liste over alle opgaver */}
      <ul>
        {toDoList.map((item, index) => (
          <li key={index}>
            {/* Betinget rendering: Viser enten redigeringsfeltet eller teksten */}
            {editingIndex === index ? (
              // Redigeringstilstand: Viser input felt
              <input
                type="text"
                defaultValue={item}
                // Gemmer ændringer når feltet mister fokus
                onBlur={(e) => handleEdit(index, e.target.value)}
                onKeyDown={(e) => {
                  // Gemmer ved Enter, afbryder ved Escape
                  if (e.key === "Enter") handleEdit(index, e.target.value);
                  if (e.key === "Escape") setEditingIndex(null);
                }}
                autoFocus // Sætter automatisk fokus på feltet
              />
            ) : (
              // Normal tilstand: Viser kun teksten
              <span>{item}</span>
            )}
            {/* Rediger-knap med blyant ikon */}
            <button
              onClick={() => setEditingIndex(index)}
              className={styles.editBtn}
            >
              <FaPencilRuler color="green" size={18} />
            </button>

            {/* Slet-knap med krydset ikon */}
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
