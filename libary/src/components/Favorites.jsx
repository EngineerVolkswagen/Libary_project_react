import { useState, useEffect } from 'react';

const Favorites = ({ token }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFavorites);
  }, [token]);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f0f0f0' }}>
          <th style={{ padding: '10px', border: '1px solid #ccc' }}>Код книги</th>
          <th style={{ padding: '10px', border: '1px solid #ccc' }}>Название</th>
        </tr>
      </thead>
      <tbody>
        {favorites.length === 0 ? (
          <tr>
            <td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>
              Избранное пусто
            </td>
          </tr>
        ) : (
          favorites.map((book) => (
            <tr key={book.code}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{book.code}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{book.title}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Favorites;