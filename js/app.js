console.log("app.js підключено");

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

  booksArray.forEach((book) => {
    const bookCard = document.createElement("article");
    bookCard.classList.add("card");

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = `Автор: ${book.author}`;

    const statusWrapper = document.createElement("p");
    const statusBadge = document.createElement("span");
    statusBadge.classList.add("status");

    statusWrapper.textContent = "Статус: ";

    if (!book.finished) {
      statusBadge.textContent = "Не прочитано";
      statusBadge.classList.add("status-reading");
      bookCard.classList.add("unread");
    } else {
      statusBadge.classList.add("status-read");
      statusBadge.textContent = "Прочитано";
    }

    statusWrapper.append(statusBadge);
    bookCard.dataset.pages = book.pages;

    bookCard.append(title, author, statusWrapper);
    listContainer.append(bookCard);
  });
}

const listContainer = document.querySelector("#books-list");
const staticCards = document.querySelectorAll("#books-list .card");
staticCards.forEach((card) => card.remove());

renderBooks(books);

const booksCount = document.querySelector("#books-count");
booksCount.textContent = `Загальна кількість книг: ${books.length}`;

const readPages = finishedBooksPages(books);
console.log(`Загальна кількість сторінок прочитаних книг: ${readPages}`);

const targetBook = books[1];
const pagesPerDayForTargetBook = pagesPerDay(targetBook.pages, 7);
console.log(
  `Щоб прочитати книгу "${targetBook.title}" за 7 днів, потрібно читати приблизно ${pagesPerDayForTargetBook} сторінок на день`,
);
