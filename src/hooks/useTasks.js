import { useEffect, useState } from "react";
import { idb } from "../utilities/database";

const useTasks = () => {
  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    const dbPromise = idb.open("task-manager", 1);

    dbPromise.onerror = (event) => {
      console.log("Couldn't open IndexedDB", event);
    };

    dbPromise.onupgradeneeded = (event) => {
      const db = dbPromise.result;
      if (!db.objectStoreNames.contains("taskCollection")) {
        db.createObjectStore("taskCollection", { keyPath: "taskId" });
      }
    };

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
  }, []);

  return [tasksData];
};

export default useTasks;
