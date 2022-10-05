const addBookForm = document.querySelector('#add-book-form');

let bookshelf = [];

const isReadBooksContainer = document.querySelector('#is-read-books');
const notReadBooksContainer = document.querySelector('#not-read-books');

if (typeof Storage !== undefined) {
  console.log('local storage is available');
  if (localStorage.getItem('bookshelf') === null) {
    localStorage.setItem('bookshelf', JSON.stringify([{ msg: 'Your BookShelf is Empty', isEmpty: true }]));
    localStorage.setItem('last-book-id', 1);
  }
  bookshelf = JSON.parse(localStorage.getItem('bookshelf'));
  if (bookshelf[0].hasOwnProperty('isEmpty')) {
    const { msg } = bookshelf[0];
    isReadBooksContainer.innerHTML = `<h2>${msg}</h2>`;
  } else {
    placeBook();
  }
}

const bookTitleInput = document.querySelector('#title');
const bookAuthorInput = document.querySelector('#author');
const bookYearInput = document.querySelector('#year');
const readBookInput = document.querySelector('#is-read');

let bookId = parseInt(localStorage.getItem('last-book-id'));

addBookForm.addEventListener('submit', (e) => {
  const book = {
    id: bookId,
    title: bookTitleInput.value,
    author: bookAuthorInput.value,
    year: parseInt(bookYearInput.value),
    isRead: readBookInput.checked ? true : false,
  };

  bookId++;
  localStorage.setItem('last-book-id', bookId);

  if (bookshelf[0].hasOwnProperty('isEmpty')) {
    bookshelf[0] = book;
  } else {
    bookshelf.push(book);
  }
  localStorage.setItem('bookshelf', JSON.stringify(bookshelf));

  placeBook();

  e.preventDefault();
});

// placing book on shelf
function placeBook() {
  isReadBooksContainer.innerHTML = '<h1>Is Read</h1>';
  notReadBooksContainer.innerHTML = '<h1>Not yet Read</h1>';

  bookshelf.forEach((book) => {
    const { id, title, author, year, isRead } = book;
    const divHTML = `<div>
                        <h2>${title}</h2>
                        <h3>${author}</h3>
                        <h3>${year}</h3>
                        <a class="delete-btn" data-id="${id}" style="cursor: pointer">delete</a>
                    </div>`;
    if (isRead) {
      isReadBooksContainer.innerHTML += divHTML;
    } else {
      notReadBooksContainer.innerHTML += divHTML;
    }
  });
}

// clear form button
const clearFormBtn = document.querySelector('#clear-btn');

clearFormBtn.addEventListener('click', (_) => {
  bookTitleInput.value = '';
  bookAuthorInput.value = '';
  bookYearInput.value = '';
});

// delete a book
const deleteBookBtn = document.querySelectorAll('.delete-btn');
deleteBookBtn.forEach((btn) => {
  btn.style.cursor = 'pointer';
  btn.addEventListener('click', (_) => {
    const bookIndex = bookshelf.map((book) => book.id).indexOf(parseInt(btn.getAttribute('data-id')));
    console.log(bookIndex);
    if (bookIndex >= 0) {
      bookshelf.splice(bookIndex, 1);
      if (bookshelf.length == 0) {
        localStorage.setItem('bookshelf', JSON.stringify([{ msg: 'Your BookShelf is Empty', isEmpty: true }]));
        isReadBooksContainer.innerHTML = '<h2>Your Bookshelf is Empty</h2>';
        notReadBooksContainer.innerHTML = '';
      } else {
        localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
        placeBook();
      }
    }
  });
});
