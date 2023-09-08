import React, { useState } from "react";
import style from "../styles/teamlist.module.css";
import { idb } from "../utilities/database";
import useUserData from "../hooks/useUserData";

const TeamList = ({ selectedTask }) => {
  const [taskTeam, setTaskTeam] = useState([]);
  const [proccessing, setProccessing] = useState(false);

  const [userData] = useUserData();

  const team = userData?.filter((user) =>
    selectedTask?.teammembers.includes(user.email)
  );

  // get selected  members to assign the task //
  const getChecked = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setTaskTeam([...taskTeam, value]);
    } else {
      setTaskTeam(taskTeam.filter((e) => e !== value));
    }
  };

  // eventListener for assign team and store in db //
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

  // eventListener for marking task completion and store in db //
  const handleComplete = () => {
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
        status: "completed",
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
    <div className={style.team__wrapper}>
      <h2>Team Members</h2>
      <div>
        {team?.map((member, index) => (
          <div key={index} className={style.assigned__team}>
            <p>{member?.name}</p>
            <span>{member?.email}</span>
          </div>
        ))}
      </div>
      {selectedTask?.status === "not assigned" && (
        <div>
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
      {selectedTask?.status === "in progress" && (
        <button className="button" onClick={handleComplete}>
          {proccessing ? "Marking..." : "Mark as Complete"}
        </button>
      )}
    </div>
  );
};

export default TeamList;
