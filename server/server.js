const express = require("express");
const session = require("express-session");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const mysql = require("mysql2/promise");
var checkpassword = require("check-password-strength");
const dotenv = require("dotenv");
app.use(express.json());
dotenv.config();

app.use(
  session({
    name: "qid",
    rolling: true,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      httpOnly: true,
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
  })
);

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "Todolist",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  return res.status(200).json({ message: "Logged out successfully" });
});

app.post("/red", (req, res) => {
  res.redirect("/");
});

app.post("/getsetitems", async (req, res) => {
  const username = req.session.name;
  const item = req.body.item; // Use the item directly, avoid unnecessary stringify
  const itemtype = req.body.itemtype;

  try {
    if (!username) return res.status(404).send("You are not logged in.");

    const sqlgetid = "SELECT id FROM Users WHERE name = ?";
    var connection = await pool.getConnection();

    const [rows] = await connection.query(sqlgetid, [username]);
    const id = rows[0]?.id; // Use optional chaining for safety
    if (!id) return res.status(404).send("User ID not found.");

    if (req.body.mode === "set") {
      if (itemtype === "current") {
        // Insert new item
        const currentitem = await connection.query(
          "INSERT INTO items (todo_item, user_id, item_type) VALUES (?, ?, ?)",
          [JSON.stringify(item), id, itemtype]
        );
        const objectitem = { ...item, id: currentitem[0].insertId }; // Return inserted item
        return res.status(200).json(objectitem);
      } else if (["expired", "completed"].includes(itemtype)) {
        // Update existing item
        const objectitem = item;
        await connection.query(
          "UPDATE items SET item_type = ? WHERE id = ?",
          [itemtype, objectitem.id]
        );
        return res.status(200).send("success");
      }
    } else if (req.body.mode === "get") {
      try {
        const items = await connection.query(
          "SELECT todo_item, id FROM items WHERE user_id = ? AND item_type = ?",
          [id, itemtype]
        );
        const arr = items[0].map(i => ({ ...i.todo_item, id: i.id })); // Use map to construct the array
        return res.status(200).json(arr);
      } catch (e) {
        console.log(e);
        return res.status(404).json(e);
      }
    }
    else if (req.body.mode === "del")
    {  console.log(item)
        connection.query('DELETE FROM items WHERE id = ?', [item.id])
        return res.status(200).send('Successfully deleted.')
}
    return res.status(400).send("Invalid request.");
  } catch (e) {
    console.error(e);
    return res.status(500).send("An error occurred.");
  } finally {
    if (connection) connection.release(); // Ensure the connection is released
  }
});


app.post("/currentUser", (req, res) => {
  if (!req.session.name) return res.status(403).json("");
  return res.status(200).json(req.session.name);
});

app.post("/logged", async (req, res) => {
  if (req.session.name) {
    res.status(200).json({ islogged: "yes" });
  } else {
    res.status(200).json({ islogged: "no" });
  }
});

app.post("/suplin", async (req, res) => {
  let connection;
  try {
    console.log("Post request received");

    connection = await pool.getConnection();

    const { operation: op, name: nm, password: ps } = req.body;
    console.log(op, nm, ps);
    psstr = checkpassword.passwordStrength(ps);

    if (psstr.id < 1 && op == "signup") {
      return res.status(200).json({
        message: `(weak password) try adding one of each of those: 'lowercase', 'uppercase', 'symbol', 'number' and be at least 6 characters. you currently have: ${psstr.contains}`,
      });
    }
    async function signinf() {
      let [rows] = await connection.query(
        "SELECT * FROM Users WHERE name = ?",
        [nm]
      );
      if (rows.length === 0) {
        return res.status(200).json({ message: "User was not found" });
      }
      let dbpass = rows[0].password;
      let issamepass = await bcrypt.compare(ps, dbpass);
      if (!issamepass)
        return res.status(200).json({ message: "Incorrect password" });

      req.session.name = nm;

      return res.status(200).json({ message: "Welcome" });
    }
    async function signupf() {
      if (ps.length < 8) {
        return res
          .status(200)
          .json({ message: "Password must be 8 characters or more" });
      }
      try {
        console.log("Adding user");
        let pshsh = await bcrypt.hash(ps, 12);
        console.log(pshsh);
        await connection.query(
          "INSERT INTO Users (name, password) VALUES (?, ?)",
          [nm, pshsh]
        );
        console.log("Done adding user");
        return res.status(201).json({ message: "Registered successfully" });
      } catch (e) {
        if (String(e).includes("Duplicate entry")) {
          return res.status(200).json({ message: "Name is already used" });
        }
        console.error(e);
        return res
          .status(500)
          .json({ message: `An error occurred during signup ${e}` });
      }
    }

    if (op === "signin") {
      await signinf();
    } else if (op === "signup") {
      await signupf();
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: `Something fucked up ${e}` });
  } finally {
    if (connection) connection.release(); // Always release the connection back to the pool
  }
});

app.listen(8080, () => console.log("App is running at http://localhost:8080"));
