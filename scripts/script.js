let myLibrary;
let libraryName;
let sortOption;
let bookId;
const cardContainer = document.querySelector('.card-container');
const titleBar = document.querySelector('.title-bar');
const addBookBtn = document.querySelector('.add-book');
addBookBtn.addEventListener('click', function(e) {
  const newBook = new Book('Title','Author', 100, false);
  addBookToLibrary(newBook);
  displayAll();
});

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.bookId = bookId;
    bookId ++;
    this.colors = generatePalette();
  }
  isRead() {
    return this.read ? "read" : "not read";
  }
}

// localStorage.clear();

if(!localStorage.getItem('myLibrary')) {
  console.log("Populating with Template");
  populateLibrary();
} else {
  console.log("Setting from Storage");
  setLibraryFromStorage();
}

sortLibrary(sortOption);
displayAll();

// old function syntax

// function Book(title, author, pages, read) {
//   this.title = title;
//   this.author = author;
//   this.pages = pages;
//   this.read = read;
//   this.colors = generatePalette();
//   // this.info = function() {
//   //   let readText = read ? "read" : "not read yet"
//   //   return `${title} by ${author}, ${pages} pages, ${readText}`;
//   // }
//   this.isRead = function() {
//     return this.read ? "read" : "not read";
//   }
//   this.bookId = bookId;
//   bookId ++;
// }

function takeInput (element) {
  // create a new input field
  const inputField = document.createElement('textarea');
  inputField.classList.add('elementInput');

  // style the input field
  inputField.setAttribute('placeholder', element.innerText);
  if (element.id == 'app-title'){
    inputField.style.width = '100%';
  } else {
    inputField.style.width = element.offsetWidth + "px";
  }
  inputField.style.height = element.offsetHeight + "px";
  eFS = getComputedStyle(element).fontSize;
  eFS = eFS.substring(0, eFS.length - 2);
  inputField.style.fontSize = eFS + 'px';
  inputField.style.fontWeight = getComputedStyle(element).fontWeight;
  inputField.style.letterSpacing = getComputedStyle(element).letterSpacing;
  inputField.style.margin = getComputedStyle(element).margin;
  inputField.style.padding = getComputedStyle(element).padding;

  // on pressing Enter, focusout
  inputField.addEventListener('keydown', function(e) {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      this.blur();
    }
  });

  // on focusout, apply the input to the element
  inputField.addEventListener('focusout', function(e) {
    applyInput(element);
  });

  // hide the original element
  element.style.display = "none";

  // insert the input field before the original element
  element.parentElement.insertBefore(inputField,element);

  // apply focus to the input field
  inputField.focus();
}

function applyInput (element) {
  const completedInput = document.querySelector('.elementInput');
  const userInput = completedInput.value;

  if (userInput != "") {
    // console.log(`Setting ${element.innerText} to ${completedInput.value}`);
    if (element.id=="app-title") {
      libraryName = userInput;
    } else {
      let thisBook = myLibrary.find(book => {
        return book.bookId == element.getAttribute('data-bookId');
      });
      if (element.classList[0]=='read') {
        if (userInput == "read" || userInput == "true") {
          thisBook.read = true;
        } else if (userInput == "not read yet" || userInput == "false") {
          thisBook.read = false;
        }
      } else if (element.classList[0]=='pages') {
        if (Number.isInteger(parseInt(userInput))) {
          thisBook.pages = parseInt(userInput);
        }
      } else {
        thisBook[element.classList[0]] = userInput;
      }
    }
  }

  completedInput.remove();
  element.style.display = "inline"
  displayAll();
}

function enterToTab (myEvent) {
  // console.log("entering it");
  if (myEvent.keyCode == 13) {
    myEvent.keyCode = 9;
  }
}

// auxiliary functions
function generatePalette() { // split comp 3 colors
  color1 = [
    Math.random()*360,
    Math.random(),
    Math.random()]; // hsl
  const c1Lum = getLuminance(hslToRgb(color1[0]/360,color1[1],color1[2]));

  if (c1Lum < 0.4) { // color 1 is dark
    // console.log("color 1 is dark: " + Math.floor(c1Lum*100));
    color2 = [
      hueOverflow(color1[0]+150),
      Math.random()*0.6+0.4,
      Math.random()*0.3+0.5];
    color3 = [
      hueOverflow(color1[0]+210),
      Math.random()*0.2+0.4,
      Math.random()*0.2+0.8];

  } else if (c1Lum < 0.67) { // color 1 is medium
    // console.log("color 1 is medium: " + Math.floor(c1Lum*100));
    color2 = [
      hueOverflow(color1[0]+150),
      Math.random()*0.4+0.4,
      Math.random()*0.2+0.8];
    color3 = [
      hueOverflow(color1[0]+210),
      Math.random()*0.2+0.4,
      Math.random()*0.15+0.85];

  } else { // color 1 is light
    // console.log("color 1 is light: " + Math.floor(c1Lum*100));
    color2 = [
      hueOverflow(color1[0]+150),
      Math.random(),
      Math.random()*0.4];
    color3 = [
      hueOverflow(color1[0]+210),
      Math.random()*0.8,
      Math.random()*0.5];
  }
  function hueOverflow(hue) {
    if (hue > 360) {
      return hue - 360;
    } else {
      return hue;
    }
  }
  return [color1, color2, color3];
}

function getLuminance(rgbArray) {
  colors = [rgbArray[0]/255,rgbArray[1]/255,rgbArray[2]/255];
  colors.forEach(color => {
    color <= 0.03928 ? color = color/12.92 : color = Math.pow((color+0.055)/1.055,2.4);
  });
  return colors[0]*0.2126 + colors[1]*0.7152 + colors[2]*0.0722;
}

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}

function cText(color) {
  const h = Math.round(color[0]);
  const s = Math.round(color[1]*100);
  const l = Math.round(color[2]*100);
  return `hsl(${h},${s}%,${l}%)`;
}

function addBookToLibrary(book) {
  myLibrary.unshift(book);
}

function displayAll() {
  // console.log("Displaying All");

  // Set new App Title
  removeAllChildren(titleBar);
  const appTitle = document.createElement('h1');
  appTitle.id = 'app-title';
  appTitle.classList.add('editable');
  appTitle.innerText = libraryName;
  titleBar.appendChild(appTitle);

  // Get rid of all existing cards
  const cardContainer = document.querySelector('.card-container');
  removeAllChildren(cardContainer);

  // Display all books in myLibrary as cards
  myLibrary.forEach(book => {
    // console.log(book);
    const bookCard = document.createElement('div');
    bookCard.style.backgroundColor = cText(book.colors[0]);
    bookCard.classList.add("card");
    
    // Create container for delete and color buttons
    const btnCon = document.createElement('div');
    btnCon.style.color = cText(book.colors[1]);
    btnCon.classList.add("button-container");

    // Create book-delete button
    const bDel = document.createElement('i');
    bDel.classList.add("fas", "fa-trash", "book-delete", "book-btn");
    bDel.setAttribute('data-bookId', book.bookId)
    bDel.addEventListener('click', function(e) {
      if (confirm('Delete ' + book.title + '?')){
        deleteThis(e);
        displayAll();
      }
    });
    // bDel.textContent = "del";

    // Create book-color button
    const bCol = document.createElement('i');
    bCol.classList.add("fas", "fa-palette", "book-color", "book-btn");
    bCol.setAttribute('data-bookId', book.bookId)
    bCol.addEventListener('click', function(e) {
      book.colors = generatePalette();
      displayAll();
    });
    // bCol.textContent = "col";

    // Create title and link to bookId
    const title = document.createElement('h1');
    title.classList.add("title", "editable");
    title.style.color = cText(book.colors[1]);
    // console.log(book.title + ": " + book.title.length);
    if (book.title.length < 14) {
      title.style.fontSize = '1.7em';
    } else if (book.title.length < 16) {
      title.style.fontSize = '1.6em';
    } else if (book.title.length < 20) {
      title.style.fontSize = '1.5em';
    } else {
      title.style.fontSize = '1.5em';
    }
    title.setAttribute('data-bookId', book.bookId)
    title.textContent = book.title;

    // Create author and link to bookId
    const author = document.createElement('h2');
    author.classList.add("author", "editable");
    author.style.color = cText(book.colors[2]);
    author.setAttribute('data-bookId', book.bookId)
    author.textContent = book.author;

    // Create pagesLine (container)
    const pagesLine = document.createElement('div');
    pagesLine.classList.add("pagesLine");

    // Create pages and link to bookId
    const pages = document.createElement('p');
    pages.classList.add("pages", "editable");
    pages.style.color = cText(book.colors[2]);
    pages.setAttribute('data-bookId', book.bookId)
    pages.textContent = book.pages;

    // Create read and link to bookId
    const read = document.createElement('p');
    read.classList.add("read", "editable");
    read.style.color = cText(book.colors[2]);
    read.setAttribute('data-bookId', book.bookId)
    read.textContent = book.read ? "read" : "not read";

    // Add all elements to the bookCard
    bookCard.appendChild(btnCon);
    btnCon.appendChild(bDel);
    btnCon.appendChild(bCol);
    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pagesLine)
    pagesLine.appendChild(pages);
    pagesLine.appendChild(read);

    // Add the card to the container
    cardContainer.appendChild(bookCard);
  });

  // Create a listener on everything with the editable class
  makeListeners();

  // Update localStorage with current Library, name, and sort option
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  localStorage.setItem('libraryName', libraryName);
  localStorage.setItem('sortOption', sortOption);
  localStorage.setItem('bookId', bookId);
}

function deleteAll() {
  if (confirm('Are you sure you want to delete your library?')) {
    myLibrary = [];
    libraryName = 'Untitled Library';
    displayAll();
  }
}

function deleteThis(e) {
  const newLibrary = myLibrary.filter(book => {
    return book.bookId.toString() != e.target.getAttribute('data-bookid')
  });
  myLibrary = newLibrary;
}

function makeListeners() {

  // on every editable element, takeInput() on click
  const editables = document.querySelectorAll('.editable');
  editables.forEach(editable => {
    editable.addEventListener('click', e => {
      let thisBook = myLibrary.find(book => book.bookId.toString() == e.target.getAttribute('data-bookid'));
      if (e.target.classList[0] == "read") {
        if (e.target.innerText == "read") {
          thisBook.read = false;
        } else {
          thisBook.read = true;
        }
        displayAll();
      } else {
        takeInput(e.target);
      }
    });
  });
}

function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function sortLibrary() {
  // console.log('Sorting by ' + sortOption);
  if (sortOption == 'bookId') {
    myLibrary.sort((x, y) => {
      if (x[sortOption] < y[sortOption]) {
        return 1;
      } else {
        return -1;
      }
    });
  } else {
    myLibrary.sort((x, y) => {
      if (x[sortOption] > y[sortOption]) {
        return 1;
      } else {
        return -1;
      }
    });
  }
}

function newSort(sortOp) {
  sortOption = sortOp;
  sortLibrary();
  displayAll();
}

function populateLibrary() {
  myLibrary = [];
  libraryName = 'Untitled Library';
  localStorage.setItem('libraryName', libraryName);
  sortOption = 'title';
  localStorage.setItem('sortOption', sortOption);
  bookId = 1000;
  localStorage.setItem('bookId', bookId);
  
  const pop1 = new Book("The Hobbit", "J.R.R. Tolkien", 295, true);
  const pop2 = new Book("The Push", "Ashley Audrain", 320, false);
  const pop3 = new Book("Where the Crawdads Sing", "Delia Owens", 387, true);
  const pop4 = new Book("My Year Abroad", "Chang Rae-Lee", 496, false);
  const pop5 = new Book("The Martian", "Andy Weir", 384, true);

  // console.log("Adding some books...");

  addBookToLibrary(pop1);
  addBookToLibrary(pop2);
  addBookToLibrary(pop3);
  addBookToLibrary(pop4);
  addBookToLibrary(pop5);
}

function setLibraryFromStorage() {
  myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
  libraryName = localStorage.getItem('libraryName');
  sortOption = localStorage.getItem('sortOption');
  bookId = parseInt(localStorage.getItem('bookId'));
  const sorts = document.querySelectorAll('option');
  sorts.forEach(sorter => {
    if (sorter.value == sortOption) {
      sorter.setAttribute('selected', true);
    }
  })
}

function storageAvailable(type) {
  var storage;
  try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}

function startFresh() {
  myLibrary = [];
  populateLibrary();
  sortLibrary(sortOption);
  displayAll();
}