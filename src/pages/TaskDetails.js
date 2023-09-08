import React from "react";
import { useParams } from "react-router-dom";
import useTasks from "../hooks/useTasks";
import style from "../styles/taskdetails.module.css";
import TeamList from "../components/TeamList";

const TaskDetails = () => {
  const { taskId } = useParams();
  const [tasksData] = useTasks();

  const selectedTask = tasksData.find((task) => task.taskId === taskId);

  return (
    <div>
      {selectedTask?.status === "completed" && (
        <div className="heading">
          <h2>Congratulations On Task Completion! You guys did a good work.</h2>
        </div>
      )}
      <div className={style.taskdetails}>
        <div className={style.task__wrapper}>
          <h1>{selectedTask?.taskname}</h1>
          <h2>Status : {selectedTask?.status}</h2>
          <p>
            <span>ID:</span> {selectedTask?.taskId}
          </p>
          <p>
            <span>Admin:</span> {selectedTask?.admin}
          </p>
          <p>
            <span>Due Date:</span> {selectedTask?.duedate}
          </p>
          <p>
            <span>Description:</span> <br /> {selectedTask?.description}
          </p>
        </div>
        <TeamList selectedTask={selectedTask} />
      </div>
    </div>
  );
};

export default TaskDetails;
