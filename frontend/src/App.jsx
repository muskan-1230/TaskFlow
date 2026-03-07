import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./components/Login";
import TaskList from "./components/TaskList";
import NotFound from "./pages/NotFound";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  return (

    <BrowserRouter>

      <Routes>

        {/* Home Route */}
        <Route
          path="/"
          element={
            loggedIn
              ? <TaskList/>
              : <Login onLogin={handleLoginSuccess}/>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={<NotFound/>}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;