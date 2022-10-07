const addBookForm = document.querySelector('#add-book-form');

let bookshelf = [];

const isReadBooksContainer = document.querySelector('#is-read-shelf');
const notReadBooksContainer = document.querySelector('#not-read-shelf');

const emptyObject = {
  msg: 'Your Bookshelf is Empty',
  isEmpty: true,
};

const { msg: emptyMsg } = emptyObject;

// first check when loading the browser
if (typeof Storage !== undefined) {
  console.log('local storage is available');
  if (localStorage.getItem('bookshelf') === null || localStorage.getItem('last-book-id') === null) {
    bookshelf = [];
    localStorage.setItem('bookshelf', JSON.stringify([emptyObject]));
    localStorage.setItem('last-book-id', 1);
  }
  bookshelf = JSON.parse(localStorage.getItem('bookshelf'));
  placeBook(bookshelf);
}

const bookTitleInput = document.querySelector('#title');
const bookAuthorInput = document.querySelector('#author');
const bookYearInput = document.querySelector('#year');
const readBookInput = document.querySelector('#is-read');

let bookId = parseInt(localStorage.getItem('last-book-id'));

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

  placeBook(bookshelf);

  e.preventDefault();
});

// placing book on shelf
function placeBook(bookshelf) {
  notReadBooksContainer.innerHTML = '';
  if (bookshelf.length == 0) {
    isReadBooksContainer.innerHTML = `<h2>No data with that keyword</h2>`;
    return false;
  } else if (bookshelf[0].hasOwnProperty('isEmpty')) {
    isReadBooksContainer.innerHTML = `<h2>${emptyMsg}</h2>`;
    return false;
  }

  isReadBooksContainer.innerHTML = `<h1>Is Read</h1>
                                    <div id='is-read-books'></div>`;
  notReadBooksContainer.innerHTML = `<h1>Not yet Read</h1>
                                     <div id='not-read-books'></div>`;

  const isReadBooks = document.querySelector('#is-read-books');
  const notReadBooks = document.querySelector('#not-read-books');

  bookshelf.forEach((book) => {
    const { id, title, author, year, isRead } = book;
    const divHTML = `<div class="book">
                        <h2>${title}</h2>
                        <h3>${author}</h3>
                        <h4>${year}</h4>
                        <div>
                          <a class="switch-btn" data-id="${id}">${!isRead ? 'Is' : 'Not yet'} read</a>
                          <a class="delete-btn" data-id="${id}" style="cursor: pointer">Delete</a>
                        </div>
                    </div>`;
    (isRead ? isReadBooks : notReadBooks).innerHTML += divHTML;
  });
}

// clear form button
const clearFormBtn = document.querySelector('#clear-btn');

clearFormBtn.addEventListener('click', (_) => {
  bookTitleInput.value = '';
  bookAuthorInput.value = '';
  bookYearInput.value = '';
});

// check for new element in document
document.addEventListener('click', (element) => {
  // delete book btn
  const deleteBookBtn = document.querySelectorAll('.delete-btn');
  deleteBookBtn.forEach((btn) => {
    if (element.target == btn) {
      const bookIndex = bookshelf.map((book) => book.id).indexOf(parseInt(btn.getAttribute('data-id')));
      bookshelf.splice(bookIndex, 1);

      if (bookshelf.length == 0) {
        localStorage.setItem('bookshelf', JSON.stringify([emptyObject]));
        bookshelf = [emptyObject];
        isReadBooksContainer.innerHTML = `<h2>${emptyMsg}</h2>`;
        notReadBooksContainer.innerHTML = '';
      } else {
        localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
        placeBook(bookshelf);
      }
    }
  });

  // switch shelf btn
  const switchShelfBtn = document.querySelectorAll('.switch-btn');
  switchShelfBtn.forEach((btn) => {
    if (element.target == btn) {
      const bookIndex = bookshelf.map((book) => book.id).indexOf(parseInt(btn.getAttribute('data-id')));
      const checkRead = bookshelf[bookIndex].isRead;
      bookshelf[bookIndex].isRead = !checkRead ? true : false;
      localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
      placeBook(bookshelf);
    }
  });
});

// search a book
const searchKeyword = document.querySelector('#keyword-search');
const searchBookForm = document.querySelector('#search-book-form');
const showKeyword = document.querySelector('#show-keyword');
let keyword;

// search by submit the form
searchBookForm.addEventListener('submit', (e) => {
  keyword = searchKeyword.value;

  const checkEmpty = bookshelf[0].hasOwnProperty('isEmpty');

  const filteredBookshelf = checkEmpty
    ? [emptyObject]
    : bookshelf.filter((book) => {
        const { title, author, year } = book;
        return title.includes(keyword) || author.includes(keyword) || year.toString().includes(keyword);
      });

  placeBook(filteredBookshelf);

  searchKeyword.value = '';
  showKeyword.textContent = `Keyword : ${keyword}`;

  e.preventDefault();
});

// live search and like a form submit on enter
searchKeyword.addEventListener('keypress', (e) => {
  keyword = searchKeyword.value;

  const checkEmpty = bookshelf[0].hasOwnProperty('isEmpty');

  const filteredBookshelf = checkEmpty
    ? [emptyObject]
    : bookshelf.filter((book) => {
        const { title, author, year } = book;
        return title.includes(keyword) || author.includes(keyword) || year.toString().includes(keyword);
      });

  placeBook(filteredBookshelf);

  if (e.key == 'Enter') {
    showKeyword.textContent = `Keyword : ${keyword}`;
    searchKeyword.value = '';
    e.preventDefault();
  }
});
