import { useEffect, useState } from "react";
import { idb } from "../utilities/database";

const useTasks = () => {
  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const dbPromise = idb.open("task-manager", 2);
      dbPromise.onerror = (event) => {
        console.log("Couldn't open IndexedDB", event);
      };

      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        if (db.objectStoreNames.contains("taskCollection")) {
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
        }
      };
    }, 1000);
  }, []);

  return [tasksData];
};

export default useTasks;
