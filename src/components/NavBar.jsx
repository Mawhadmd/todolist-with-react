import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UContext } from "../index.jsx";
import { onAuthStateChanged, signOut} from "firebase/auth";
import { Authf } from "../firebase.js";

export default function NavBar({ setpopup, username: currentuser }) {
  const navigate = useNavigate();
  const [sentw, setsentw] = useState();
  const [login_out, setlogin_out] = useState("logout");
  const {
    setguest,
    guest,
    turnoff,
    setturnoff,
    ongoingstyle,
    setongoingstyle,
    epiredstyle,
    setonexpired,
    setcompletedstyle,
    completedstyle,
  } = useContext(UContext);

  // Check if user is logged and display text accordingly
  useEffect(() => {
    
    if (guest) {
      setlogin_out("Login");
    } else {
      setlogin_out("Log out");
    }
  }, [guest, currentuser]); 

  // Boxes animation on / off
  useEffect(() => {
    if (!turnoff) {
      setsentw("Turn Box reactivity off");
      setongoingstyle({});
      setonexpired({});
      setcompletedstyle({});
    } else if (turnoff) {
      setsentw("Turn Box reactivity on");
      setongoingstyle({});
      setonexpired({});
      setcompletedstyle({});
    }
  }, [turnoff]);

  // transition styles
  {
    var defaults = {
      flex: "0",
      overflow: "hidden",
    };
  var expanded = {
    flex: "3",
    flexWrap: "wrap",
    overflowX: "auto",
    overflowY: "hidden",
  };
  }

// Logout
  async function handlelogout() {
    if (login_out == "Login") {
      navigate("/Sign");
      navigate(0);
    } else {
      if (window.confirm("You sure?")) {
        setlogin_out("Loading...");
        await signOut(Authf)
        setlogin_out("Login");
        setguest(true);
      }
    }
  }


  return (
    <header>
      <h1
        onClick={() => {
          setongoingstyle({});
          setonexpired({});
          setcompletedstyle({});
        }}
      >
        TodoTheList
      </h1>
      <ul>
        <li
          onClick={() => {
            setongoingstyle({ ...expanded });
            setonexpired({ ...defaults });
            setcompletedstyle({ ...defaults });
          }}
        >
          Ongoing tasks
        </li>
        <li
          onClick={() => {
            setongoingstyle({ ...defaults });
            setonexpired({ ...expanded });
            setcompletedstyle({ ...defaults });
          }}
        >
          Expired
        </li>
        <li
          onClick={() => {
            setongoingstyle({ ...defaults });
            setonexpired({ ...defaults });
            setcompletedstyle({ ...expanded });
          }}
        >
          Done
        </li>
        <li
          style={{ width: "150px", textWrap: "wrap" }}
          onClick={() => setturnoff(!turnoff)}
        >
          {sentw}
        </li>
        <li style={{ backgroundColor: "green" }} onClick={() => setpopup(true)}>
          Add item
        </li>
      </ul>
      <span className="Sign-Welcome">
        {currentuser ? (
          <p>
            What's on your mind today,{" "}
            <span>
              {String(currentuser.email.match('^([^@]*)@')[1]).charAt(0).toUpperCase() +
                String(currentuser.email.match('^([^@]*)@')[1]).slice(1)}
            </span>
          </p>
        ) : (
          <>
            <Link to="/Sign">Sign in</Link> <> to save your progress </>
          </>
        )}
      </span>
      <button className="logout" onClick={handlelogout}>
        {login_out}
      </button>
    </header>
  );
}
