const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", () => {
  const submitData = document.getElementById("inputBook");
  submitData.addEventListener("submit", (ev) => {
    ev.preventDefault();
    addBook();
    document.getElementById("inputBook").reset();
  });

  // live search
  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("keyup", (ev) => {
    ev.preventDefault();

    const formSubmit = document.getElementById("searchBookTitle").value;
    bookSearch(formSubmit);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const inCompleteBookList = document.getElementById("incompleteBookshelfList");
  inCompleteBookList.innerHTML = "";

  const completeBookList = document.getElementById("completeBookshelfList");
  completeBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      inCompleteBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
});
