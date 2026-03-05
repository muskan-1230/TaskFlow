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
  // return(
  //   <div>
  //     <div className="bg-red-500 text-white p-10 text-3xl">
  //       TEST TAILWIND
  //     </div>

  //     <TaskList />
  //   </div>
  // );
}

export default App;