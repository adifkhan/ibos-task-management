import { useState } from "react";
import { idb } from "../utilities/database";

const useTasks = () => {
  const [tasksData, setTasksData] = useState([]);

  const dbPromise = idb.open("task-manager", 1);
  dbPromise.onsuccess = () => {
    const db = dbPromise.result;
    const transaction = db.transaction("taskCollection", "readonly");
    const taskData = transaction.objectStore("taskCollection");
    const tasks = taskData.getAll();

    tasks.onsuccess = (query) => {
      setTasksData(query.srcElement.result);
    };
    tasks.onerror = (event) => {
      console.log("Error occurred while geting Tasks");
    };
    transaction.oncomplete = () => {
      db.close();
    };
  };
  return [tasksData];
};

export default useTasks;
