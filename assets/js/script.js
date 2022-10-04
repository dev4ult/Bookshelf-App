const addBookForm = document.querySelector('#add-book-form');

let bookshelf = [];

const isReadBooksContainer = document.querySelector('#is-read-books');
const notReadBooksContainer = document.querySelector('#not-read-books');

if (typeof Storage !== undefined) {
  console.log('local storage is available');
  if (localStorage.getItem('bookshelf') === null) {
    localStorage.setItem('bookshelf', JSON.stringify([{ msg: 'Your BookShelf is Empty', isEmpty: true }]));
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

addBookForm.addEventListener('submit', (e) => {
  const book = {
    title: bookTitleInput.value,
    author: bookAuthorInput.value,
    year: parseInt(bookYearInput.value),
    isRead: readBookInput.checked ? true : false,
  };

  if (bookshelf[0].hasOwnProperty('isEmpty')) {
    bookshelf[0] = book;
    isReadBooksContainer.innerHTML = '';
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
    const { title, author, year, isRead } = book;
    if (isRead) {
      isReadBooksContainer.innerHTML += `<div>
                                            <h2>${title}</h2>
                                            <h3>${author}</h3>
                                            <h3>${year}</h3>
                                         </div>`;
    } else {
      notReadBooksContainer.innerHTML += `<div>
                                            <h2>${title}</h2>
                                            <h3>${author}</h3>
                                            <h3>${year}</h3>
                                          </div>`;
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
