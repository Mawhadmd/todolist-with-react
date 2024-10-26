import { useEffect, useRef, useState } from "react";
import "./App.css";
import Todotable from "./components/Todotable.js";
import Todoitem from "./components/Todoitem.js";
import Signupfrom from './components/Signupform.js';
import Completed from "./components/completed.js";
import Additemform from "./components/Additemform.js";


function App() {
  const addingform = useRef();
  const inputref = useRef();
  const refobject = { inputref, addingform };
  const storeditem = localStorage.getItem("items");
  const storedcompleted = localStorage.getItem("citems");
  const [Name, setname] = useState("");
  const [desc, setdesc] = useState("");
  const [time, settime] = useState("");
  const [items, setitems] = useState(storeditem ? JSON.parse(storeditem) : []);
  const [completedItems, setCompletedItems] = useState(
    storedcompleted ? JSON.parse(storedcompleted) : []
  );
  useEffect(
    () => localStorage.setItem("items", JSON.stringify(items)),
    [items]
  );
  useEffect(
    () => localStorage.setItem("citems", JSON.stringify(completedItems)),
    [completedItems]
  );
  function handledone(index) {
    // Move the completed item to the completedItems array
    let completedItem = items[index];
    completedItem.currentdate = new Date().toJSON().slice(0, 10);

    setCompletedItems([...completedItems, completedItem]);

    // Remove the completed item from the items array
    setitems(items.filter((_, i) => i !== index));
  }

  function handledelete(index) {
    const temp = completedItems.filter((item, i) => i !== index);

    setCompletedItems(temp);
  }

  function handleadd() {
    const currentdate = new Date().toJSON().slice(0, 10);

    // Trim and validate inputs
    let trimmedDesc = desc.trim();
    if (trimmedDesc === "") {
      trimmedDesc = "No Description";
    }

    if (Name.trim() === "" || time.trim() === "") {
      alert("Please fill in all fields.");
      return; // Exit if validation fails
    }

    const newItem = {
      Name: Name.trim(),
      desc: trimmedDesc,
      time: time.trim(),
      currentdate,
    };
    refobject.inputref.current.style.border = "1px solid #ccc"; // Corrected border syntax
    setitems((items) => [...items, newItem]);

    // Clear input fields
    setname("");
    setdesc("");
    settime("");
  }

  return (
    <div className="App-header">
      <Completed completedItems={completedItems} handledelete={handledelete} />
      <Todotable items={items} handledone={handledone} refobject={refobject} />
      <Additemform
        refobject={refobject}
        Name={Name}
        desc={desc}
        time={time}
        setdesc={setdesc}
        setname={setname}
        settime={settime}
        handleadd={handleadd}
      />
    </div>
  );
}

export default App;
