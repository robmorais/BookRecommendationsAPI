async function submitForm(event) {
  event.preventDefault();

  const bookType = document.getElementById("book-type").value;
  const genre = document.getElementById("genre").value;
  const examples = document.getElementById("examples").value;

  // Disable the submit button and show the loading spinner
  const submitButton = document.querySelector("button[type='submit']");
  const loadingSpinner = document.getElementById("loading-spinner");
  submitButton.disabled = true;
  loadingSpinner.style.display = "inline-block";

  const recommendations = await getRecommendations(bookType, genre, examples);

  // Enable the submit button and hide the loading spinner
  submitButton.disabled = false;
  loadingSpinner.style.display = "none";

  displayRecommendations(recommendations);
}


async function getRecommendations(bookType, genre, examples) {
  const response = await fetch('/get-recommendations', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          bookType,
          genre,
          examples,
      }),
  });

  const recommendations = await response.json();
  return recommendations;
}


function displayRecommendations(recommendations) {
  const recommendationsDiv = document.getElementById('recommendations');
  recommendationsDiv.innerHTML = '';
  
  // const paragraph = document.createElement('p');
  // let text = document.createTextNode(recommendations);
  // paragraph.appendChild(text);
  // recommendationsDiv.append(paragraph);
  
  recommendations.forEach(rec => {
      const bookLink = document.createElement('a');
      bookLink.href = `https://www.goodreads.com/book/show/${rec.goodreadsID}`;
      bookLink.target = '_blank';
      bookLink.textContent = rec.title;
      recommendationsDiv.appendChild(bookLink);
      recommendationsDiv.appendChild(document.createElement('br'));
  });
}


// old
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

// window.onload = async function() {
//   const books = await fetchBooks();
//   displayBooks(books);
// };
