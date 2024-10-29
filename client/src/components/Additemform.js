import { useState } from "react";

export default function Additemform({
    Name,
    popup,
    setpopup,
    desc,
    time,
    setname,
    setdesc,
    settime,
    handleadd,
    username: currentuser,
  }) {
   

    return (
      
      <div style={popup? {display: "block"}: {display: "none"}} className="popup" >
        <div style={popup? {display: "block"}: {display: "none"}} className="popupbg" onClick={() => setpopup(false)}>
      </div>
      <form
      className="addingform"
      onSubmit={(e) => {
        e.preventDefault();
        handleadd();
      }}
      >
        <input
          id="namein"
          value={Name}
          onChange={(e) => {
            setname(e.target.value);
          }}
          placeholder="Item name*"
          required
          />
        <textarea
          value={desc}
          onChange={(e) => setdesc(e.target.value)}
          placeholder="description"
          />
        <input
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          value={time}
          onChange={(e) => settime(e.target.value)}
          required
          />
        <button>Add</button>
      </form>
  
          </div>
    );
  }