import { useEffect, useState } from "react";
import { idb } from "../utilities/database";

const useUserData = () => {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const dbPromise = idb.open("task-manager", 2);
      dbPromise.onerror = (event) => {
        console.log("Couldn't open IndexedDB", event);
      };

      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        if (db.objectStoreNames.contains("userCollection")) {
          const transaction = db.transaction("userCollection", "readonly");
          const userData = transaction.objectStore("userCollection");
          const users = userData.getAll();
          users.onsuccess = (query) => {
            setUsersData(query.srcElement.result);
          };
          users.onerror = (event) => {
            console.log("Error occurred while geting users");
          };
          transaction.oncomplete = () => {
            db.close();
          };
        }
      };
    }, 1000);
  }, []);
  return [usersData];
};

export default useUserData;
