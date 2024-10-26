export default function Todoitem({ items, handledone }) {
    return (
      <div className="todoitem">
        <div className="leftofitem">
          <div className="top">
            {items.Name.length > 20
              ? items.Name.slice(0, 20) + "..."
              : items.Name}{" "}
            {items.currentdate}
          </div>
          <hr></hr>
          <div className="description" style={{ textWrap: "pretty" }}>
            {items.desc.length > 50
              ? items.desc.slice(0, 50) + "..."
              : items.desc}
          </div>{" "}
          <hr></hr>
          <div className="end">
            Due{" "}
            {items.time.length > 10
              ? items.time.slice(0, 10) + "..."
              : items.time}
          </div>
        </div>
        <div className="rightofitem">
          <button onClick={handledone}>Done</button>
        </div>
      </div>
    );
  }