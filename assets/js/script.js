const addBookForm = document.querySelector('#add-book-form');

let bookshelf = [];

const isReadBooksContainer = document.querySelector('#is-read-books');
const notReadBooksContainer = document.querySelector('#not-read-books');

const emptyObject = {
  msg: 'Your Bookshelf is Empty',
  isEmpty: true,
};

const { msg: emptyMsg } = emptyObject;

if (typeof Storage !== undefined) {
  console.log('local storage is available');
  if (localStorage.getItem('bookshelf') === null || localStorage.getItem('last-book-id') === null) {
    bookshelf = [];
    localStorage.setItem('bookshelf', JSON.stringify([emptyObject]));
    localStorage.setItem('last-book-id', 1);
  }
  bookshelf = JSON.parse(localStorage.getItem('bookshelf'));
  if (bookshelf[0].hasOwnProperty('isEmpty')) {
    isReadBooksContainer.innerHTML = `<h2>${emptyMsg}</h2>`;
  } else {
    placeBook();
  }
}

const bookTitleInput = document.querySelector('#title');
const bookAuthorInput = document.querySelector('#author');
const bookYearInput = document.querySelector('#year');
const readBookInput = document.querySelector('#is-read');

let bookId = localStorage.getItem('last-book-id');

addBookForm.addEventListener('submit', (e) => {
  bookshelf = JSON.parse(localStorage.getItem('bookshelf'));

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

  console.log(bookshelf);

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
    const divHTML = `<div class="book">
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

document.addEventListener('click', (element) => {
  // delete book btn
  const deleteBookBtn = document.querySelectorAll('.delete-btn');
  deleteBookBtn.forEach((btn) => {
    if (element.target == btn) {
      const bookIndex = bookshelf.map((book) => book.id).indexOf(btn.getAttribute('data-id'));
      bookshelf.splice(bookIndex, 1);

      if (bookshelf.length == 0) {
        localStorage.setItem('bookshelf', JSON.stringify([emptyObject]));
        isReadBooksContainer.innerHTML = `<h2>${emptyMsg}</h2>`;
        notReadBooksContainer.innerHTML = '';
      } else {
        localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
        placeBook();
      }
    }
  });
});
