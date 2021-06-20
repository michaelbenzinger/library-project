let myLibrary = [];
const cardContainer = document.querySelector('.card-container');

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.colors = generatePalette();
  // this.info = function() {
  //   let readText = read ? "read" : "not read yet"
  //   return `${title} by ${author}, ${pages} pages, ${readText}`;
  // }
  this.isRead = function() {
    return read ? "read" : "not read yet";
  }
}


// auxiliary functions
function generatePalette() { // split comp 3 colors
  color1 = [
    Math.random()*360,
    Math.random(),
    Math.random()]; // hsl
  const c1Lum = getLuminance(hslToRgb(color1[0]/360,color1[1],color1[2]));

  if (c1Lum < 0.45) { // color 1 is dark
    console.log("color 1 is dark: " + Math.floor(c1Lum*100));
    color2 = [
      hueOverflow(color1[0]+150),
      Math.random()*0.6+0.4,
      Math.random()*0.3+0.5];
    color3 = [
      hueOverflow(color1[0]+210),
      Math.random()*0.2+0.4,
      Math.random()*0.2+0.8];

  } else if (c1Lum < 0.67) { // color 1 is medium
    console.log("color 1 is medium: " + Math.floor(c1Lum*100));
    color2 = [
      hueOverflow(color1[0]+150),
      Math.random()*0.4+0.4,
      Math.random()*0.2+0.8];
    color3 = [
      hueOverflow(color1[0]+210),
      Math.random()*0.2+0.4,
      Math.random()*0.15+0.85];

  } else { // color 1 is light
    console.log("color 1 is light: " + Math.floor(c1Lum*100));
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
  myLibrary.push(book);
}

function displayAll() {
  const cardContainer = document.querySelector('.card-container');

  removeAllChildren(cardContainer);

  myLibrary.forEach(book => {
    // console.log(book.info());
    const bookCard = document.createElement('div');
    bookCard.style.backgroundColor = cText(book.colors[0]);
    bookCard.classList.add("card");

    // const colorBlock = document.createElement('div');
    // colorBlock.classList.add("color-block");
    // colorBlock.style["background-color"] =
    //   `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;

    const title = document.createElement('h1');
    title.classList.add("title");
    title.style.color = cText(book.colors[1]);
    title.textContent = book.title;

    const author = document.createElement('h2');
    author.classList.add("author");
    author.style.color = cText(book.colors[2]);
    author.textContent = book.author;

    const pages = document.createElement('p');
    pages.classList.add("pages");
    pages.style.color = cText(book.colors[2]);
    pages.textContent = `${book.pages} pages, ${book.isRead()}`;

    // bookCard.appendChild(colorBlock);
    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    cardContainer.appendChild(bookCard);
  });
}

function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
const theBible = new Book("The Bible", "Multiple Authors", 2403, true);
const whereTheCrawdadsSing = new Book("Where the Crawdads Sing", "Delia Owens", 387, false);
const theBible2 = new Book("The Bible", "Multiple Authors", 2403, true);
const whereTheCrawdadsSing2 = new Book("Where the Crawdads Sing", "Delia Owens", 387, false);

addBookToLibrary(theHobbit);
addBookToLibrary(theBible);
addBookToLibrary(whereTheCrawdadsSing);
addBookToLibrary(theBible2);
addBookToLibrary(whereTheCrawdadsSing2);

displayAll();