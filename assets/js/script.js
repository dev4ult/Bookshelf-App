let library = [];

function pushNewBook(id, title, author, year, isComplete) {
  let newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };
  library.push(newBook);
}

const addBooksForm = document.querySelector('#add-books-form');
addBooksForm.addEventListener('submit', function (event) {
  const d = new Date();
  let title = document.querySelector('#judul-buku').value;
  let author = document.querySelector('#penulis-buku').value;
  let year = document.querySelector('#tahun-rilis').value;
  let isComplete = document.querySelector('#isComplete');

  pushNewBook(Math.floor(d.getTime() / 60000), title, author, year, isComplete.checked);
  if (typeof Storage !== undefined) {
    localStorage.setItem('libraryOnStorage', JSON.stringify(library));
  } else {
    alert("Your browser doesn't support storage");
  }
});

const readSection = document.querySelector('#read-book');
const notYetReadSection = document.querySelector('#not-yet-read');

if (localStorage.getItem('libraryOnStorage') === null) {
  notYetReadSection.innerHTML = '<h2>Tidak ada buku yang dapat ditampilkan</h2>';
  readSection.innerHTML = '<h2>Tidak ada buku yang dapat ditampilkan</h2>';
} else {
  library = JSON.parse(localStorage.getItem('libraryOnStorage'));
  const readBooks = [];
  const notYetReadBooks = [];
  for (const book of library) {
    if (book['isComplete']) {
      readBooks.push(book);
    } else {
      notYetReadBooks.push(book);
    }
  }

  if (notYetReadBooks.length < 0) {
    notYetReadSection.innerHTML = '<h2>Tidak ada buku yang dapat ditampilkan</h2>';
  } else {
    notYetReadSection.innerHTML = '';
    for (const book of notYetReadBooks) {
      let bookDiv = document.createElement('div');
      let bookTitle = document.createElement('h4');
      bookTitle.textContent = 'title : ' + book['title'];
      bookDiv.appendChild(bookTitle);

      let bookAuthor = document.createElement('h5');
      bookAuthor.textContent = 'author : ' + book['author'];
      bookDiv.appendChild(bookAuthor);

      let yearRelease = document.createElement('h6');
      yearRelease.textContent = 'year : ' + book['year'];
      bookDiv.appendChild(yearRelease);

      let deleteBtn = document.createElement('a');
      deleteBtn.textContent = 'delete book';
      bookDiv.appendChild(deleteBtn);

      notYetReadSection.appendChild(bookDiv);
    }
  }
  if (readBooks.length < 0) {
    readSection.innerHTML = '<h2>Tidak ada buku yang dapat ditampilkan</h2>';
  } else {
    readSection.innerHTML = '';
    for (const book of readBooks) {
      let bookDiv = document.createElement('div');
      let bookTitle = document.createElement('h4');
      bookTitle.textContent = 'title : ' + book['title'];
      bookDiv.appendChild(bookTitle);

      let bookAuthor = document.createElement('h5');
      bookAuthor.textContent = 'author : ' + book['author'];
      bookDiv.appendChild(bookAuthor);

      let yearRelease = document.createElement('h6');
      yearRelease.textContent = 'year : ' + book['year'];
      bookDiv.appendChild(yearRelease);

      let deleteBtn = document.createElement('a');
      deleteBtn.textContent = 'delete book';
      bookDiv.appendChild(deleteBtn);

      readSection.appendChild(bookDiv);
    }
  }
}
