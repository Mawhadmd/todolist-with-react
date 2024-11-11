import { useContext, useEffect, useState } from "react";
import Todoitem from "./Todoitem.jsx";
import { UContext } from "../index.jsx";
import trash from "../assets/trash.png";
export default function Todotable({ mode, items, handleit, setpopup }) {
  const [loadnow, setloadnow] = useState(true);
  const {
    turnoff,
    ongoingstyle,
    setcompletedstyle,
    setongoingstyle,
    expiredstyle,
    completedstyle,
    setonexpired,
  } = useContext(UContext);
  var itemstyle;
  var taskName;
  var styleorigin;
  var expanded = {
    flex: "3",
    flexWrap: "wrap",
    overflowX: "auto",
    overflowY: "hidden",
  };
  var defaults = {
    flex: "0",
    overflow: "hidden",
  };
  var mappingexpression = !expression && loadnow;

  if (mode === "current-task") {
    styleorigin = ongoingstyle;
    taskName = "Current Task";
    var expression = completedstyle.flex == 3 || expiredstyle.flex == 3;

    var textboxonclick = () => {
      setongoingstyle({ ...expanded });
      setonexpired({ ...defaults });
      setcompletedstyle({ ...defaults });
    };
    var boxstyles = {
      justifyContent: items.length !== 0 ? "start" : "center",
      ...ongoingstyle,
    };
    var classnamefirstdiv = "todobox";

    var h1style = expression
      ? {
          textWrap: "nowrap",
          transform: "rotate(-90deg)",
          top: "calc(50% - 25px)",
        }
      : { top: "-10px" };
  } else if (mode === "expired-task") {
    styleorigin = expiredstyle;
    taskName = "Expired Task";

    var expression = completedstyle.flex == 3 || ongoingstyle.flex == 3;

    var textboxonclick = () => {
      setongoingstyle({ ...defaults });
      setonexpired({ ...expanded });
      setcompletedstyle({ ...defaults });
    };

    var classnamefirstdiv = "expiredbox todobox";

    var boxstyles = {
      justifyContent: items.length !== 0 ? "start" : "center",
      ...expiredstyle,
    };

    if (ongoingstyle.flex == 3)
      h1style = {
        textWrap: "nowrap",
        transform: "rotate(90deg)",
        top: "calc(50% - 25px)",
      };
    else if (completedstyle.flex == 3)
      h1style = {
        textWrap: "nowrap",
        transform: "rotate(-90deg)",
        top: "calc(50% - 25px)",
      };
  } else if (mode === "completed-task") {
    taskName = "Completed Task";
    styleorigin = completedstyle;
    var expression = ongoingstyle.flex == 3 || expiredstyle.flex == 3;

    var textboxonclick = () => {
      setongoingstyle({ ...defaults });
      setonexpired({ ...defaults });
      setcompletedstyle({ ...expanded });
    };
    var boxstyles = {
      justifyContent: items.length !== 0 ? "start" : "center",
      ...completedstyle,
    };
    var classnamefirstdiv = "completedbox todobox";

    var h1style = expression
      ? {
          textWrap: "nowrap",
          transform: "rotate(90deg)",
          top: "calc(50% - 25px)",
        }
      : { top: "-10px" };
  }
  useEffect(() => {
    if (expression == false) {
      setTimeout(() => {
        setloadnow(true);
      }, 500);
    } else {
      setloadnow(false);
    }
  });
  return (
    <div
      onClick={() => {
        !turnoff && textboxonclick();
      }}
      className={classnamefirstdiv}
      style={boxstyles}
    >
      {mappingexpression &&
        items.map((item, index) => {
          return (
            <Todoitem
              itemstyle={
                items.length > 4 && styleorigin.flex == 3
                  ? { width: "45%" }
                  : {}
              }
              mode={mode}
              items={item}
              handledone={() => handleit(index, mode)}
              key={index}
            />
          );
        })}
      <h1 style={{ ...h1style, textAlign: "center" }} className="boxHeader">
        {taskName}
      </h1>
      {items.length === 0 && !expression ? (
        <img
          alt="empty"
          className="Hidden"
          src={trash}
          style={{ width: "100px" }}
        />
      ) : (
        ""
      )}
    </div>
  );
}
