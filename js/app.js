console.log("app.js підключено");

const books = [
  { title: "Алхімік", pages: 160, finished: true },
  { title: "1984", pages: 328, finished: false },
  { title: "Гордість та упередження", pages: 424, finished: false },
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

const readPages = finishedBooksPages(books);
console.log(`Загальна кількість сторінок прочитаних книг: ${readPages}`);

const targetBook = books[1];
const pagesPerDayForTargetBook = pagesPerDay(targetBook.pages, 7);
console.log(
  `Щоб прочитати книгу "${targetBook.title}" за 7 днів, потрібно читати приблизно ${pagesPerDayForTargetBook} сторінок на день`,
);
