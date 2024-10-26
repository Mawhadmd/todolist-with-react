import Todoitem from "./Todoitem.js";

export default function Todotable({ items, handledone, refobject }) {
    let inputref = refobject.inputref;
    function focus() {
      inputref.current.focus();
      refobject.addingform.current.style.backgroundColor = "blue";
      inputref.current.style.color = "black";
      refobject.inputref.current.style.border = "2px solid red";
    }
  
    return (
      <div
        className="todobox"
        style={{ justifyContent: items.length !== 0 ? "start" : "center" }}
      >
        {items.map((item, index) => {
          return (
            <Todoitem
              items={item}
              handledone={() => handledone(index)}
              key={index}
            />
          );
        })}
        <button
          className="addbuttontodobox"
          onClick={focus}
          style={{
            position: items.length !== 0 ? "static" : "absolute",
            top: 15,
          }}
        >
          Add new Item
        </button>
        {items.length !== 0 ? "" : <p className="Hidden">No Tasks</p>}
      </div>
    );
  }