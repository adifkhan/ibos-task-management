import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useTasks from "../hooks/useTasks";
import style from "../styles/taskdetails.module.css";
import useUserData from "../hooks/useUserData";
import { idb } from "../utilities/database";

const TaskDetails = () => {
  const { taskId } = useParams();
  const [tasksData] = useTasks();
  const [userData] = useUserData();
  const [taskTeam, setTaskTeam] = useState([]);
  const [proccessing, setProccessing] = useState(false);

  const selectedTask = tasksData.find((task) => task.taskId === taskId);

  const getChecked = (e) => {
    // console.log(e.target.checked, e.target.value);
    const { checked, value } = e.target;
    if (checked) {
      setTaskTeam([...taskTeam, value]);
    } else {
      setTaskTeam(taskTeam.filter((e) => e !== value));
    }
  };
  const handleAssign = () => {
    setProccessing(true);
    const dbPromise = idb.open("task-manager", 1);

    dbPromise.onerror = (event) => {
      console.log("Couldn't open IndexedDB", event);
      setProccessing(false);
    };

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const transaction = db.transaction("taskCollection", "readwrite");
      const taskData = transaction.objectStore("taskCollection");
      const taskInfo = taskData.put({
        ...selectedTask,
        status: "in progress",
        teammembers: taskTeam,
      });
      taskInfo.onsuccess = () => {
        transaction.oncomplete = () => {
          db.close();
        };
        setProccessing(false);
        window.location.reload();
      };
      taskInfo.onerror = (event) => {
        console.log(event);
        alert("Error occurred!");
        setProccessing(false);
      };
    };
  };

  return (
    <div className={style.taskdetails}>
      <div className={style.task__wrapper}>
        <h1>{selectedTask?.taskname}</h1>
        <h2>Status : {selectedTask?.status}</h2>
        <p>
          <span>ID:</span> {selectedTask?.id}
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
      <div className={style.team__wrapper}>
        {selectedTask?.status === "not assigned" && (
          <div>
            <h2>Team Members</h2>
            <div className={style.create__team}>
              {userData?.map((user) => (
                <div key={user?.id}>
                  <label>
                    <input
                      type="checkbox"
                      value={user.email}
                      onChange={(e) => getChecked(e)}
                    />
                    {user.name}
                  </label>
                </div>
              ))}
            </div>
            <button className="button" onClick={handleAssign}>
              {proccessing ? "assigning..." : "assign"}
            </button>
          </div>
        )}
        <div>
          {selectedTask?.teammembers.map((member) => (
            <div>
              <p>{member?.name}</p>
              <p>{member?.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
