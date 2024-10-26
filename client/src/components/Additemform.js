export default function Additemform({
    refobject,
    Name,
    desc,
    time,
    setname,
    setdesc,
    settime,
    handleadd,
  }) {
    function changecolor() {
      refobject.addingform.current.style.backgroundColor = "white";
    }
    return (
      <form
        ref={refobject.addingform}
        className="addingform"
        onSubmit={(e) => {
          e.preventDefault();
          handleadd();
        }}
      >
        <input
          id="namein"
          ref={refobject.inputref}
          value={Name}
          onChange={(e) => {
            setname(e.target.value);
            changecolor();
          }}
          placeholder="Item name"
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
    );
  }