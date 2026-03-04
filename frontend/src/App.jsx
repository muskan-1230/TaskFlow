import { useEffect, useState } from "react";
import Login from "./components/Login";
import TaskList from "./components/TaskList";

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

  if (!loggedIn) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return <TaskList />;
}

export default App;