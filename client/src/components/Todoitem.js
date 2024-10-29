import { useEffect, useState } from "react";
import { json } from "react-router-dom";

export default function Todoitem({ itemstyle, mode, items, handledone }) {
  const [pad, setpad] = useState();
  const [actionbut, setactionbut] = useState();
  const [divclass, setdivclass] = useState();
  var duetime = items.time;
  useEffect(() => {
    if (mode == "completed-task") {
      setdivclass("todoitem completed");
      setactionbut("Delete");
    } else if (mode == "expired-task") {
      setdivclass("expired todoitem");
      setactionbut("Delete");
    } else {
      setdivclass("todoitem");
      setactionbut("Done");
    }
  }, []);

  return (
    <div
      style={{ ...itemstyle }}
     
      className={divclass}
    >
      <div className="leftofitem">
        <div className="top">
          {items.Name} at {items.currentdate}
        </div>
        <hr></hr>
        <div 
        className="description"
        onClick={() => {
          pad == 0 ? setpad("20px") : setpad(0);
        }}
        style={{ textWrap: "pretty", paddingBottom: pad, paddingTop: pad, }}>
          {items.desc.length > 50 && pad != 0
            ? items.desc.slice(0, 50) + ("... Click here for more")
            : items.desc}
        </div>{" "}
        <hr></hr>
        <div className="end">{duetime}</div>
      </div>
      <div className="rightofitem">
        <button onClick={handledone}>{actionbut}</button>
      </div>
    </div>
  );
}
