const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;

const createCollection = () => {
  if (!idb) {
    alert("This brower does not support IndexedDB");
    return;
  }
  //   console.log(idb);

  const request = idb.open("task-manager", 1);

  request.onerror = (event) => {
    console.log("Couldn't open IndexedDB", event);
  };

  request.onupgradeneeded = (event) => {
    const db = request.result;
    if (!db.objectStoreNames.contains("userCollection")) {
      db.createObjectStore("userCollection", { keyPath: "email" });
    }
  };
  request.onsuccess = (event) => {
    // const db = event.target.result;
    // const objectStore = db.createObjectStore("tasks", { keyPath: "id" });
    console.log("database created successfully");
  };
};

export { idb, createCollection };
