import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskList from "./components/TaskList";
import Error404 from "./pages/Error404";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<TaskList />} />

        <Route path="*" element={<Error404 />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;