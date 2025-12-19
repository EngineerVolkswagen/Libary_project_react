import { useState, useEffect } from 'react';
import Modal from './Modal';

const Catalog = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/books', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки книг:', err);
        setLoading(false);
      });
  }, [token]);

  const openModal = (code) => {
    fetch(`http://localhost:5000/books/${code}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((book) => setSelectedBook(book))
      .catch((err) => console.error('Ошибка загрузки книги:', err));
  };

  const addToFavorites = async (code) => {
    try {
      const res = await fetch('http://localhost:5000/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        alert('Книга добавлена в избранное!');
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка при добавлении');
      }
    } catch (err) {
      alert('Ошибка соединения с сервером');
    }
  };

  if (loading) {
    return <p>Загрузка каталога...</p>;
  }

  return (
    <>
      <h2>Каталог книг</h2>

      {books.length === 0 ? (
        <p>В каталоге пока нет книг.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                Код книги
              </th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                Название
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.code}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {book.code}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    color: '#007bff',
                    textDecoration: 'underline',
                  }}
                  onClick={() => openModal(book.code)}
                >
                  {book.title}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Модальное окно с деталями книги */}
      {selectedBook && (
        <Modal onClose={() => setSelectedBook(null)}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
            <img
              src={selectedBook.coverPath}
              alt={`Обложка: ${selectedBook.title}`}
              style={{
                width: '220px',
                height: '320px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 10px 0' }}>{selectedBook.title}</h2>
              <p style={{ margin: '8px 0', fontSize: '1.1em' }}>
                <strong>Автор:</strong> {selectedBook.author}
              </p>
              <p style={{ margin: '15px 0', lineHeight: '1.6' }}>
                <strong>Описание:</strong><br />
                {selectedBook.description}
              </p>

              <div style={{ marginTop: '30px' }}>
                <a
                  href={selectedBook.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    marginRight: '15px',
                  }}
                >
                  Читать книгу (PDF)
                </a>

                <button
                  onClick={() => {
                    addToFavorites(selectedBook.code);
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  В избранное
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Catalog; 