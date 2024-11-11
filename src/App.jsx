import { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Todotable from "./components/Todotable.jsx";
import Additemform from "./components/Additemform.jsx";
import NavBar from "./components/NavBar.jsx";
import { UContext } from "./index.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { Authf } from "./firebase.js";
function App() {
  const { setguest, guest } = useContext(UContext);
  const [currentuser, setcurrentuser] = useState("");
  const [popup, setpopup] = useState(false);
  const [Name, setname] = useState("");
  const [desc, setdesc] = useState("");
  const [time, settime] = useState("");
  const [items, setitems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [dataFitched, setDataFitched] = useState(false);
  const Datenow = () => new Date().toJSON();

  // Request data from storage/db
  useEffect(() => {
    async function fetchdata() {
      let isguest;
      //checks if user is a guest or not
      onAuthStateChanged(Authf, (user) => {
        console.log(user?.emailVerified)
        if (user?.emailVerified) {
          isguest = false;
          setguest(false);
          console.log(user)
          setcurrentuser(user);
        } else {
          isguest = true;
          setguest(true);
          setcurrentuser(null);
        }
      });

      // await axios
        // .post("/currentUser")
        // .then((res) => {
        //   isguest = false;
        //   setguest(false);
        //   setcurrentuser(res.data);
        // })
        // .catch(() => {
        //   isguest = true;
        //   setguest(true);
        //   setcurrentuser(null);
        // });

      if (isguest) {
        var storeditem = JSON.parse(localStorage.getItem("items"));
        var storedcompleted = JSON.parse(localStorage.getItem("citems"));
        var storedeitems = JSON.parse(localStorage.getItem("eitems"));
        console.log(" guest");
        setDataFitched(true);
      } else {
        try {
          console.log("not guest");
          var res1 = await axios.post("/getsetitems", {
            itemtype: "expired",
            mode: "get",
          });
          var res2 = await axios.post("/getsetitems", {
            itemtype: "current",
            mode: "get",
          });
          var res3 = await axios.post("/getsetitems", {
            itemtype: "completed",
            mode: "get",
          });

          var storedeitems = res1.data;
          var storeditem = res2.data;
          var storedcompleted = res3.data;
        } catch (e) {
          console.error(e);
        }
      }

      if (storeditem) {
        setitems(storeditem);
      }
      if (storedcompleted) {
        setCompletedItems(storedcompleted);
      }
      if (storedeitems) {
        setExpiredItems(storedeitems);
      }
    }

    fetchdata();
  }, [guest]);

  // Set User added data to storage/db
  useEffect(() => {
    if (dataFitched) {
      localStorage.setItem("citems", JSON.stringify(completedItems));
      localStorage.setItem("eitems", JSON.stringify(expiredItems));
      localStorage.setItem("items", JSON.stringify(items));
    }
    setDataFitched(false);
  }, [items, expiredItems, completedItems, dataFitched]);

  // Set normal items to expired if time expired
  useEffect(() => {
    items.forEach(async (item, i) => {
      let k = new Date(item.time).getTime();
      let h = new Date().getTime();
      if (k <= h) {
        if (!guest) {
          await axios.post("/getsetitems", {
            itemtype: "expired",
            item: items[i],
            mode: "set",
          });
        }
        let temp = [...expiredItems, items[i]];
        setExpiredItems(temp);
        handledelete(i, "current-item");
      }
    });
  }, [items]);

  // Removes The completed items from the app
  async function handledone(index) {
    // Move the completed item to the completedItems array
    let completedItem = items[index];
    completedItem.currentdate = Datenow();

    if (!guest) {
      await axios.post("/getsetitems", {
        itemtype: "completed",
        item: completedItem,
        mode: "set",
      });
    }
    setCompletedItems([...completedItems, completedItem]);

    // Remove the completed item from the items array
    setitems(items.filter((_, i) => i !== index));
  }

  // Deletes Task
  async function handledelete(index, mode) {
    if (mode == "current-task") {
      const temp = items.filter((item, i) => i !== index);
      if (!guest)
        await axios.post("/getsetitems", { item: items[index], mode: "del" });
      setitems(temp);
    }
    if (mode == "expired-task") {
      const temp = expiredItems.filter((item, i) => i !== index);
      if (!guest)
        await axios.post("/getsetitems", {
          item: expiredItems[index],
          mode: "del",
        });
      setExpiredItems(temp);
    }
    if (mode == "completed-task") {
      const temp = completedItems.filter((item, i) => i !== index);
      if (!guest)
        await axios.post("/getsetitems", {
          item: completedItems[index],
          mode: "del",
        });
      setCompletedItems(temp);
    }
  }
  // Adds current task
  async function handleadd() {
    setpopup(false);
    let currentdate = Datenow();
    let hour = currentdate.split("T")[1].slice(0, 5);
    currentdate = currentdate.slice(0, 10);
    currentdate = currentdate + " " + hour;
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

    let item; //This mere purpose is to add the id for the item's object then return the same thing back but with an id.
    //for guests, doesn't use id
    if (!guest)
      item = await axios.post("/getsetitems", {
        itemtype: "current",
        item: newItem,
        mode: "set",
      }).data;

    setitems((items) => [...items, item ? item : newItem]);

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
