import { useState } from 'react';
import Sidebar from './Sidebar';
import Catalog from './Catalog';
import Favorites from './Favorites';
import Profile from './Profile';

const Library = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Боковая панель слева */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} token={token} />

      {/* Основной контент справа */}
      <div style={{ marginLeft: '280px', flex: 1, padding: '30px', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Выйти
          </button>
        </div>

        <h1 style={{ marginBottom: '30px', color: '#212529' }}>
          {activeTab === 'catalog' && 'Каталог книг'}
          {activeTab === 'favorites' && 'Избранное'}
          {activeTab === 'profile' && 'Мой профиль'}
        </h1>

        {activeTab === 'catalog' && <Catalog token={token} />}
        {activeTab === 'favorites' && <Favorites token={token} />}
        {activeTab === 'profile' && <Profile token={token} />}
      </div>
    </div>
  );
};

export default Library;