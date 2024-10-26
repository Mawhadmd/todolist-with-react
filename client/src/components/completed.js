export default function Completed({ completedItems, handledelete }) {
    return (
      <div
        className="completedbox todobox"
        style={{
          justifyContent: completedItems.length !== 0 ? "start" : "center",
        }}
      >
        {completedItems.map((item, index) => (
          <div key={index} className="todoitem completed">
            <div className="leftofitem">
              <div className="top">
                {item.Name.length > 20
                  ? item.Name.slice(0, 20) + "..."
                  : item.Name}{" "}
                {item.currentdate}
              </div>
              <hr></hr>
              <div className="description" style={{ textWrap: "pretty" }}>
                {item.desc.length > 50
                  ? item.desc.slice(0, 50) + "..."
                  : item.desc}
              </div>
              <hr></hr>
              <div className="end">
                Completed at {true && new Date().toJSON().slice(0, 10)}
              </div>
            </div>
            <div className="rightofitem">
              <button onClick={() => handledelete(index)}>Delete</button>
            </div>
          </div>
        ))}
  
        {completedItems.length !== 0 ? "" : <p className="Hidden">No Tasks</p>} 
      </div>
    );
  }