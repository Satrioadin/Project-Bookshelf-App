// Web storage
const SAVED_EVENT = "save-book";
const STORAGE_KEY = "BOOKSELFH_APPS";

// cek browser mendukung atau tidak
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung web storage");
    return false;
  }
  return true;
}

function saveDataBook() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// load ketika web dibuka
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
