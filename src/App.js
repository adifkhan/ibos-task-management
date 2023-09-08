import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { createCollection } from "./utilities/database";
import { useEffect } from "react";
import Header from "./components/shared/Header";
import UserProfile from "./pages/UserProfile";
import TaskDetails from "./pages/TaskDetails";
import UsersList from "./pages/UsersList";

function App() {
  useEffect(() => {
    createCollection();
  }, []);
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks/:taskId" element={<TaskDetails />} />
        <Route path="/userslist" element={<UsersList />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
