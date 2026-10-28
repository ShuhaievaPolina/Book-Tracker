console.log("app.js підключено");

const API_URL = "https://openlibrary.org/search.json?q=";

const books = [
  { title: "Алхімік", pages: 160, finished: true, author: "Пауло Коельо" },
  { title: "1984", pages: 328, finished: false, author: "Джордж Оруелл" },
  {
    title: "Гордість та упередження",
    pages: 424,
    finished: false,
    author: "Джейн Остін",
  },
  {
    title: "Маленький принц",
    pages: 96,
    finished: true,
    author: "Антуан де Сент-Екзюпері",
  },
  {
    title: "Великий Гетсбі",
    pages: 180,
    finished: false,
    author: "Френсіс Скотт Фіцджеральд",
  },
  {
    title: "451 градус за Фаренгейтом",
    pages: 249,
    finished: true,
    author: "Рей Бредбері",
  },
];

const listContainer = document.querySelector("#books-list");
const booksCount = document.querySelector("#books-count");
const form = document.querySelector("#add-book-form");
const authorInput = document.querySelector("#author");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const loadingIndicator = document.querySelector("#loading-indicator");
const errorContainer = document.querySelector("#error-container");
const errorText = document.querySelector("#error-text");
const retryButton = document.querySelector("#retry-button");

//Функція для підрахунку загальної кількості прочитаних сторінок (тобто сторінок у прочитаних книгах)//
function finishedBooksPages(books) {
  let totalPages = 0;

  for (const book of books) {
    if (book.finished === true) {
      totalPages += book.pages;
    } else {
      console.log(`Книга "${book.title}" ще не прочитана`);
    }
  }

  return totalPages;
}

//Функція для підрахунку кількості сторінок, які потрібно читати щодня, щоб прочитати книгу за певну кількість днів//
const pagesPerDay = (pages, days) => Math.round(pages / days);

//Функція для створення карток книг з актуальною інформацією//
function renderBooks(booksArray) {
  listContainer.innerHTML = "";

  booksArray.forEach((book, index) => {
    const bookCard = document.createElement("article");
    bookCard.classList.add("card");

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = `Автор: ${book.author}`;

    const statusWrapper = document.createElement("p");
    statusWrapper.textContent = "Статус: ";

    const statusBadge = document.createElement("span");
    statusBadge.classList.add("status");

    const statusSelect = document.createElement("select");
    statusSelect.classList.add("status-select");
    statusSelect.dataset.index = index;

    statusSelect.innerHTML = `
      <option value="true" ${book.finished ? "selected" : ""}>Прочитано</option>
      <option value="false" ${!book.finished ? "selected" : ""}>Читаю</option>
    `;

    if (book.finished) {
      statusBadge.classList.add("status-read");
    } else {
      statusBadge.classList.add("status-reading");
      bookCard.classList.add("unread");
    }

    statusWrapper.append(statusBadge, statusSelect);
    bookCard.append(title, author, statusWrapper);
    listContainer.append(bookCard);
  });

  booksCount.textContent = `Загальна кількість книг: ${booksArray.length}`;
}

// Функції відображення ознаки пошуку//
function showLoading(isLoading) {
  loadingIndicator.style.display = isLoading ? "block" : "none";
}

// Функція відображення повідомлення про помилку пошуку//
function showError(message) {
  if (errorText) errorText.textContent = message;
  errorContainer.style.display = message ? "flex" : "none";
}

// Функція для завантаження даних API_URL = "https://openlibrary.org/search.json?q="//
async function loadData(query) {
  showLoading(true);
  showError("");
  listContainer.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}${encodeURIComponent(query)}`);

    if (!response.ok) throw new Error(`Помилка сервера: ${response.status}`);

    const data = await response.json();
    console.log(data);

    if (!data.docs || data.docs.length === 0)
      throw new Error("За вашим запитом нічого не знайдено.");

    const formattedBooks = data.docs.map((doc) => {
      return {
        title: doc.title,
        author: doc.author_name ? doc.author_name[0] : "Невідомий автор",
        pages: doc.first_publish_year || 0,
        finished: false,
      };
    });

    renderBooks(formattedBooks);
  } catch (error) {
    if (error.message === "За вашим запитом нічого не знайдено.") {
      showError(error.message);
    } else {
      showError("Не вдалося завантажити дані. спробуйте пізніше.");
    }
    console.error("Деталі помилки:", error);
  } finally {
    showLoading(false);
  }
}

const staticCards = document.querySelectorAll("#books-list .card");
staticCards.forEach((card) => card.remove());

renderBooks(books);

const readPages = finishedBooksPages(books);
console.log(`Загальна кількість сторінок прочитаних книг: ${readPages}`);

const targetBook = books[1];
const pagesPerDayForTargetBook = pagesPerDay(targetBook.pages, 7);
console.log(
  `Щоб прочитати книгу "${targetBook.title}" за 7 днів, потрібно читати приблизно ${pagesPerDayForTargetBook} сторінок на день`,
);

// Обробник події для кнопки пошуку//
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    loadData(query);
  } else {
    showError("Будь ласка, введіть назву книги для пошуку.");
  }
});

// Обробник події для кнопки оновлення пошуку//
retryButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    loadData(query);
  }
});

// Обробник події для зміни статусу книги //
listContainer.addEventListener("change", (event) => {
  if (event.target.classList.contains("status-select")) {
    const bookIndex = event.target.dataset.index;
    const newStatus = event.target.value === "true";

    books[bookIndex].finished = newStatus;
    renderBooks(books);
    const finishedPages = finishedBooksPages(books);
    console.log(
      `Загальна кількість сторінок прочитаних книг: ${finishedPages}`,
    );
  }
});

// Обробник події для перевірки формату вводу автору книги//
authorInput.addEventListener("input", () => {
  if (authorInput.validity.patternMismatch) {
    authorInput.setCustomValidity("Введіть коректне ім'я автора (без цифр)");
  } else {
    authorInput.setCustomValidity("");
  }
});

// Обробник події для форми додавання книг //
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const titleInput = document.querySelector("#title");
  const statusInput = document.querySelector("#status");
  const pagesInput = document.querySelector("#pages");

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const status = statusInput.value === "true";
  const pages = Number(pagesInput.value);

  const newBook = {
    title: title,
    author: author,
    finished: status,
    pages: pages,
  };

  books.push(newBook);
  renderBooks(books);
  form.reset();
});
