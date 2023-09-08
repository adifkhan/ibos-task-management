import React from "react";
import useTasks from "../hooks/useTasks";
import style from "../styles/tasks.module.css";
import { Link } from "react-router-dom";

const Tasks = () => {
  const [tasksData] = useTasks();

  return (
    <div className={style.task__wrapper}>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Task ID</th>
            <th>Admin</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {tasksData.map((task) => (
            <tr key={task?.taskId}>
              <td>{task?.taskname}</td>
              <td>{task?.taskId}</td>
              <td>{task?.admin}</td>
              <td>{task?.duedate}</td>
              <td>{task?.priority}</td>
              <td>{task?.status}</td>
              <td>
                <Link className={style.view__btn} to={`/tasks/${task?.id}`}>
                  view
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;
