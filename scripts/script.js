let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function() {
    let readText = read ? "read" : "not read yet"
    return `${title} by ${author}, ${pages} pages, ${readText}`;
  }
  this.isRead = function() {
    return read ? "read" : "not read yet";
  }
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function libraryInfo() {
  const cardContainer = document.querySelector('.card-container');
  myLibrary.forEach(book => {
    // console.log(book.info());
    const bookCard = document.createElement('div');
    bookCard.classList.add("card");

    const colorBlock = document.createElement('div');
    colorBlock.classList.add("color-block");
    colorBlock.style["background-color"] =
      `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;

    const title = document.createElement('h1');
    title.classList.add("title");
    title.textContent = book.title;

    const author = document.createElement('h2');
    author.classList.add("author");
    author.textContent = book.author;

    const pages = document.createElement('p');
    pages.classList.add("pages");
    pages.textContent = `${book.pages} pages, ${book.isRead()}`;

    bookCard.appendChild(colorBlock);
    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    cardContainer.appendChild(bookCard);
  });
}

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
const theBible = new Book("The Bible", "Multiple Authors", 2403, true);

addBookToLibrary(theHobbit);
addBookToLibrary(theBible);
