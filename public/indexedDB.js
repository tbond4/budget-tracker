let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    const pendingStore = db.createObjectStore("pending", {autoIncrement: "true"});
  };

  request.onsuccess = function (event) {
    db = event.target.result;
  
    if (navigator.onLine) {
      checkDatabase();
    }
  };
  function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    // create a transaction on the pending db with readwrite access
    const pendingStore = transaction.objectStore("pending");
    // access your pending object store
    pendingStore.add(record);
    // add record to your store with add method.
  }
  
  function checkDatabase() {
    // open a transaction on your pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // access your pending object store
    const pendingStore = transaction.objectStore("pending");
    // get all records from store and set to a variable
    const getAll = pendingStore.getAll();
  
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then(() => {
            // if successful, open a transaction on your pending db
            const transaction = db.transaction(["pending"], "readwrite");
            // access your pending object store
            const pendingStore = transaction.objectStore("pending");
            // clear all items in your store
            pendingStore.clear();
          });
      }
    };
  }
  
  window.addEventListener('online', checkDatabase);