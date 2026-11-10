//Обрано React, оскільки він дозволяє зручно керувати станом списку та описувати компоненти через JSX

const API_URL = "https://openlibrary.org/search.json?q=";

const initialBooksData = [
  {
    id: 1,
    title: "Алхімік",
    pages: 160,
    finished: true,
    author: "Пауло Коельо",
  },
  {
    id: 2,
    title: "1984",
    pages: 328,
    finished: false,
    author: "Джордж Оруелл",
  },
  {
    id: 3,
    title: "Гордість та упередження",
    pages: 424,
    finished: false,
    author: "Джейн Остін",
  },
  {
    id: 4,
    title: "Маленький принц",
    pages: 96,
    finished: true,
    author: "Антуан де Сент-Екзюпері",
  },
  {
    id: 5,
    title: "Великий Гетсбі",
    pages: 180,
    finished: false,
    author: "Френсіс Скотт Фіцджеральд",
  },
  {
    id: 6,
    title: "451 градус за Фаренгейтом",
    pages: 249,
    finished: true,
    author: "Рей Бредбері",
  },
];

function BookRow({ id, title, author, pages, status, onToggle }) {
  return (
    <article className={`card ${!status ? "unread" : ""}`}>
      <h3>{title}</h3>
      <p>
        <strong>Автор:</strong> {author}
      </p>
      <p>
        <strong>Сторінки:</strong> {pages}
      </p>

      <div
        className="status-wrapper"
        onClick={() => onToggle(id)}
        style={{ cursor: "pointer", userSelect: "none" }}
        title="Натисніть, щоб змінити статус"
      >
        <span className={`status-pill ${status ? "read" : "reading"}`}>
          <span className="status-dot"></span>
          {status ? "Прочитано" : "Читаю зараз"}
        </span>
      </div>
    </article>
  );
}

// Головний компонент програми
function App() {
  const [myBooks, setMyBooks] = React.useState(initialBooksData);

  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [status, setStatus] = React.useState("false");
  const [pages, setPages] = React.useState("");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Зміна статусу книги
  function toggleStatus(id) {
    setMyBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, finished: !book.finished } : book,
      ),
    );
  }

  // Обробник додавання нової книги
  function handleAddBook(e) {
    e.preventDefault();
    if (!title || !author || !pages) return;

    const newBook = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim(),
      finished: status === "true",
      pages: Number(pages),
    };

    setMyBooks((prev) => [...prev, newBook]);

    setTitle("");
    setAuthor("");
    setStatus("false");
    setPages("");
  }

  // Функція пошуку книг
  async function handleSearch() {
    const query = searchQuery.trim();
    if (!query) {
      setErrorMessage("Будь ласка, введіть назву книги для пошуку.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`Помилка сервера: ${response.status}`);

      const data = await response.json();

      if (!data.docs || data.docs.length === 0) {
        throw new Error("За вашим запитом нічого не знайдено.");
      }

      const foundBooks = data.docs.slice(0, 5).map((doc, index) => ({
        id: Date.now() + index,
        title: doc.title,
        author: doc.author_name ? doc.author_name[0] : "Невідомий автор",
        pages: doc.first_publish_year || 100,
        finished: false,
      }));

      setMyBooks(foundBooks);
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося завантажити дані.");
    } finally {
      setIsLoading(false);
    }
  }

  const totalBooks = myBooks.length;
  const readingCount = myBooks.filter((b) => !b.finished).length;
  const readCount = myBooks.filter((b) => b.finished).length;
  const totalReadPages = myBooks
    .filter((b) => b.finished)
    .reduce((sum, b) => sum + b.pages, 0);

  return (
    <div className="layout">
      <main>
        <section id="add-book">
          <h2>Додати книгу</h2>
          <form id="add-book-form" onSubmit={handleAddBook}>
            <label htmlFor="title">Назва книги:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label htmlFor="author">Автор:</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />

            <label htmlFor="status">Статус:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="true">Прочитано</option>
              <option value="false">Читаю</option>
            </select>

            <label htmlFor="pages">Кількість сторінок:</label>
            <input
              type="number"
              id="pages"
              min="1"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              required
            />

            <button type="submit">Додати книгу</button>
          </form>
        </section>

        <section id="search-section">
          <h2>Пошук книг</h2>
          <div className="search-controls">
            <input
              type="text"
              id="search-input"
              placeholder="Введіть назву книги"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button id="search-button" type="button" onClick={handleSearch}>
              Знайти
            </button>
          </div>

          {isLoading && (
            <p id="loading-indicator" className="loading-indicator">
              Пошук книги...
            </p>
          )}

          {errorMessage && (
            <div id="error-container" className="error-container">
              <p id="error-text" className="error-text">
                {errorMessage}
              </p>
              <button
                id="retry-button"
                className="retry-button"
                onClick={handleSearch}
              >
                Оновити
              </button>
            </div>
          )}
        </section>

        <section id="my-books">
          <h2>Мої книги</h2>
          <div className="cards">
            {myBooks.map((book) => (
              <BookRow
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                pages={book.pages}
                status={book.finished}
                onToggle={toggleStatus}
              />
            ))}
          </div>
        </section>
      </main>

      <aside id="statistics">
        <h2>Статистика читання</h2>
        <p>Загальна кількість книг: {totalBooks}</p>
        <p>Читаю зараз: {readingCount}</p>
        <p>Прочитано книг: {readCount}</p>
        <p>Прочитано сторінок: {totalReadPages}</p>
      </aside>
    </div>
  );
}

const rootContainer = document.getElementById("root");
const root = ReactDOM.createRoot(rootContainer);
root.render(<App />);

/* 
  Функцію renderBooks() і ручні обробники innerHTML/document.createElement 
  видалено, оскільки відображення списку книг та їх реактивне оновлення 
  тепер повністю виконує React-компонент BooksApp
*/
