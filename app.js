class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  //display books in the list
  static displayBooksToList() {
    const books = Store.getBooks();

    books.forEach((book) => {
      UI.addBookToList(book)
    });
  }

 //display 1 book in the list
  static addBookToList(book) {
    const list = document.querySelector('.book-list');
    const row  = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete danger">X</a></td>
    `;

    list.appendChild(row);
  }

  static clearFields() {
    document.querySelector('#title').value = "";
    document.querySelector('#author').value = "";
    document.querySelector('#isbn').value = "";
  }

  static removeBookFromList(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }
}

class Store {

  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
    return books;
  }

  static setBooks(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();
    books.forEach((book, i) => {
      if (book.isbn === isbn) {
        books.splice(i, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

document.addEventListener('DOMContentLoaded', UI.displayBooksToList());

document.querySelector('.book-form').addEventListener('submit', (e) => {
  //prevent actual submit
  e.preventDefault();
  //get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  if (title === '' || author === '' || isbn === '') {
    //alert("Please fill in all fields");
    let msg = document.querySelector('.msg');
    msg.classList.add('error');
    msg.innerHTML = 'Please fill in all fields';
    setTimeout(() => msg.remove(), 3000)
  } else {
    //instatiate Book
    const book = new Book(title, author, isbn);
    UI.addBookToList(book);
    Store.setBooks(book);
    UI.clearFields();
  }
})

//event Remove a book, event propagation(!)
document.querySelector('.book-list').addEventListener('click', (e) =>{
    UI.removeBookFromList(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})
