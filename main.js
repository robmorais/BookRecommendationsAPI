async function fetchBooks() {
  const response = await fetch('/books');
  const books = await response.json();
  return books;
}

function displayBooks(books) {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = '';

  books.forEach(book => {
      const listItem = document.createElement('li');
      listItem.textContent = `${book.title} by ${book.author} (ISBN: ${book.isbn})`;
      bookList.appendChild(listItem);
  });
}

async function searchBooks() {
  const searchTerm = document.getElementById('search').value;
  const books = await fetchBooks();
  const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayBooks(filteredBooks);
}

window.onload = async function() {
  const books = await fetchBooks();
  displayBooks(books);
};
