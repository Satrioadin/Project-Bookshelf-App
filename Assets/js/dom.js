const books = [];

function addBook() {
  const judul = document.getElementById("inputBookTitle").value;
  const penulis = document.getElementById("inputBookAuthor").value;
  const tahun = document.getElementById("inputBookYear").value;
  const boolCheck = document.getElementById("inputBookIsComplete").checked;

  const createId = createRandomId();
  const bookObject = createTodoObject(
    createId,
    judul,
    penulis,
    tahun,
    boolCheck
  );
  books.unshift(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataBook();
}

// membuat todo object
function createTodoObject(id, judul, penulis, tahun, isComplete) {
  return {
    id,
    judul,
    penulis,
    tahun,
    isComplete,
  };
}

// acak id book
function createRandomId() {
  return +new Date();
}

// membuat susuan tag book
function makeBook(bookObject) {
  const textJudul = document.createElement("h3");
  textJudul.classList.add("text-judul");
  textJudul.innerHTML = bookObject.judul;

  const textPenulis = document.createElement("p");
  textPenulis.innerHTML = `Penulis: ${bookObject.penulis}`;

  const textTahun = document.createElement("p");
  textTahun.innerHTML = `Tahun: ${bookObject.tahun}`;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textJudul, textPenulis, textTahun);
  container.setAttribute("id", `book-${bookObject.id}`);

  // button hapus
  const trashButton = document.createElement("button");
  trashButton.classList.add("red");
  trashButton.innerHTML = "Hapus Buku";

  trashButton.addEventListener("click", () => {
    const confirmTrash = window.confirm(
      `yakin menghapus buku ${bookObject.judul}?`
    );
    if (confirmTrash) {
      removeBookComplete(bookObject.id);
      alert(`Buku ${bookObject.judul} Berhasil dihapus`);
    } else {
      alert(`buku ${bookObject.judul} gagal di hapus!`);
    }
  });

  // button edit
  const editButton = document.createElement("button");
  editButton.classList.add("blue");
  editButton.innerHTML = "Edit";

  editButton.addEventListener("click", () => {
    editBookData(bookObject.id);
  });

  const action = document.createElement("div");
  action.classList.add("action");

  if (!bookObject.isComplete) {
    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    completeButton.innerHTML = "Selesai dibaca";

    completeButton.addEventListener("click", () => {
      bookReadComplete(bookObject.id);
    });

    action.append(completeButton, trashButton, editButton);
  } else {
    const refundButton = document.createElement("button");
    refundButton.classList.add("green");
    refundButton.innerHTML = "Belum selesai di baca";

    refundButton.addEventListener("click", () => {
      undoBookComplete(bookObject.id);
    });

    action.append(refundButton, trashButton, editButton);
  }
  container.append(action);
  return container;
}

// MENCARI BOOK ID
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// complete book readed
function bookReadComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataBook();
}

// refund book unread
function undoBookComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataBook();
}

// mecari books melalui index arr
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// trash book list
function removeBookComplete(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataBook();
}

// Event klik pada edit book
function editBookData(bookId) {
  document.getElementById("bookSubmit").style.display = "none";
  document.getElementById("editBookSubmit").style.display = "block";
  const book = findBook(bookId);

  // const bookItems = document.querySelector(`#book-${bookId}`);

  const judul = document.getElementById(`inputBookTitle`);
  judul.value = book.judul;
  const penulis = document.getElementById("inputBookAuthor");
  penulis.value = book.penulis;
  const tahun = document.getElementById("inputBookYear");
  tahun.value = book.tahun;
  const isComplete = document.getElementById("inputBookIsComplete");
  isComplete.checked = book.isComplete;

  const editSubmit = document.getElementById("editBookSubmit");
  editSubmit.addEventListener("click", (ev) => {
    ev.preventDefault();
    updateBookEdit(
      book.id,
      judul.value,
      penulis.value,
      tahun.value,
      isComplete.checked
    );
  });
}

// update edit book
function updateBookEdit(id, judul, penulis, tahun, isComplete) {
  const bookStorage = JSON.parse(localStorage[STORAGE_KEY]);
  const indexBook = findBookIndex(id);

  bookStorage[indexBook] = {
    id: id,
    judul: judul,
    penulis: penulis,
    tahun: tahun,
    isComplete: isComplete,
  };

  const parsed = JSON.stringify(bookStorage);
  localStorage.setItem(STORAGE_KEY, parsed);

  location.reload(true);
}

// live search
function bookSearch(keyword) {
  const fill = keyword.toUpperCase();
  const titles = document.getElementsByTagName("h3");

  for (let i = 0; i < titles.length; i++) {
    const titleText = titles[i].textContent || titles.innerText;

    if (titleText.toUpperCase().indexOf(fill) > -1) {
      titles[i].closest(".book_item").style.display = "";
    } else {
      titles[i].closest(".book_item").style.display = "none";
    }
  }
}

// manupulasi title button submit ? 'Selesai dibaca' : 'Belum selesai dibaca'
const boolCheck = document.getElementById("inputBookIsComplete");
boolCheck.addEventListener("click", () => {
  const titleButton = document.getElementById("title-button");
  if (boolCheck.checked === true) {
    titleButton.innerText = "Selesai dibaca";
  } else {
    titleButton.innerText = "Belum selesai dibaca";
  }
});
