const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;

const createCollection = () => {
  if (!idb) {
    alert("This brower does not support IndexedDB");
    return;
  }

  const request = idb.open("task-manager", 2);

  request.onerror = (event) => {
    console.log("Couldn't open IndexedDB", event);
  };

  request.onupgradeneeded = (event) => {
    const db = request.result;
    if (!db.objectStoreNames.contains("userCollection")) {
      db.createObjectStore("userCollection", { keyPath: "email" });
    }
    if (!db.objectStoreNames.contains("taskCollection")) {
      db.createObjectStore("taskCollection", { keyPath: "taskId" });
    }
  };
  request.onsuccess = (event) => {
    console.log("database created successfully");
  };
};

export { idb, createCollection };
