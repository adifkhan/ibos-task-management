import { useEffect, useState } from "react";
import { idb } from "../utilities/database";

const useUserData = () => {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const dbPromise = idb.open("task-manager", 1);

    dbPromise.onerror = (event) => {
      console.log("Couldn't open IndexedDB", event);
    };

    dbPromise.onupgradeneeded = (event) => {
      const db = dbPromise.result;
      if (!db.objectStoreNames.contains("userCollection")) {
        db.createObjectStore("userCollection", { keyPath: "email" });
      }
    };

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
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
    };
  }, []);
  return [usersData];
};

export default useUserData;
