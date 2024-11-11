import React, { useState, createContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Form from "./routes/Form.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/errorpage.jsx";
import axios from "axios";


// Create the context
export const UContext = createContext();

function Root() {
  
  // Move useState hooks inside the functional component
  const [ongoingstyle, setongoingstyle] = useState({});
  const [turnoff, setturnoff] = useState(true);
  const [expiredstyle, setonexpired] = useState({});
  const [completedstyle, setcompletedstyle] = useState({});
  const [guest,setguest] = useState()

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/Sign",
      element: <Form />,
    },
  ]);


  return (
    <UContext.Provider
      value={{
        ongoingstyle,
        setongoingstyle,
        expiredstyle,
        setonexpired,
        completedstyle,
        setcompletedstyle,
        setturnoff,
        turnoff,
        guest,
        setguest
      }}
    >
      <RouterProvider router={router} />
    </UContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
