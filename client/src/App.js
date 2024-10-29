import { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Todotable from "./components/Todotable.js";

import Additemform from "./components/Additemform.js";
import NavBar from "./components/NavBar.js";

import { UContext } from "./index.js";

function App() {
  const navigate = useNavigate();
  const [currentuser, setcurrentuser] = useState("");
  useEffect(() => {
    axios
      .post("/currentUser")
      .then((res) => {
        setcurrentuser(res.data);
      })
      .catch((e) => navigate("/Sign"));
  }, []);
  const { completedstyle, ongoingstyle, expiredstyle } = useContext(UContext);
  const storeditem = localStorage.getItem("items");
  const storedcompleted = localStorage.getItem("citems");
  const storedeitems = localStorage.getItem("eitems");
  const [popup, setpopup] = useState(false);
  const [Name, setname] = useState("");
  const [desc, setdesc] = useState("");
  const [time, settime] = useState("");
  const [items, setitems] = useState(storeditem ? JSON.parse(storeditem) : []);
  const [completedItems, setCompletedItems] = useState(
    storedcompleted ? JSON.parse(storedcompleted) : []
  );
  const [expiredItems, setExpiredItems] = useState(
    storedeitems ? JSON.parse(storedeitems) : []);
  const Datenow = () => new Date().toJSON()

  useEffect(
    () => localStorage.setItem("items", JSON.stringify(items)),
    [items]
  );
  useEffect(
    () => localStorage.setItem("citems", JSON.stringify(completedItems)),
    [completedItems]
  );
  useEffect(
    () => localStorage.setItem("eitems", JSON.stringify(expiredItems)),
    [expiredItems]
  );

  useEffect(()=>{
    items.forEach((item , i) => {
      let k = new Date(item.time).getTime()
      let h = new Date().getTime()
      if(k <= h){
      let temp = [...expiredItems, items[i]]
      setExpiredItems(temp)
        handledelete(i, 'current-item')
      }
    });
  }, [items])


  function handledone(index) {
    // Move the completed item to the completedItems array
    let completedItem = items[index];
    completedItem.currentdate = Datenow();

    setCompletedItems([...completedItems, completedItem]);

    // Remove the completed item from the items array
    setitems(items.filter((_, i) => i !== index));
  }
 

  function handledelete(index, mode) {
    if(mode == "current-task"){const temp = items.filter((item, i) => i !== index);  setitems(temp);}
    if(mode == "expired-task"){const temp = expiredItems.filter((item, i) => i !== index);  setExpiredItems(temp);}
    if(mode == "completed-task")
   { const temp = completedItems.filter((item, i) => i !== index);  setCompletedItems(temp);}

   
  }
  function handleadd() {
    setpopup(false);
    let currentdate = Datenow();
    let hour = currentdate.split('T')[1].slice(0,5)
    currentdate = currentdate.slice(0,10)
    currentdate = currentdate + ' ' + hour
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
    setitems((items) => [...items, newItem]);

    // Clear input fields
    setname("");
    setdesc("");
    settime("");
  }

  return (
    <>
      <div className="header">
        <NavBar setpopup={setpopup} username={currentuser}></NavBar>
      </div>
      <div className="App-header">
        <Todotable mode="current-task" items={items} handleit={handledone} />
        <Todotable
          mode="completed-task"
          items={completedItems}
          handleit={handledelete}
        />
        <Todotable
          mode="expired-task"
          items={expiredItems}
          handleit={handledelete}
        />
 
      </div>
      <Additemform
        popup={popup}
        setpopup={setpopup}
        Name={Name}
        desc={desc}
        time={time}
        setdesc={setdesc}
        setname={setname}
        settime={settime}
        handleadd={handleadd}
      />
    </>
  );
}

export default App;
