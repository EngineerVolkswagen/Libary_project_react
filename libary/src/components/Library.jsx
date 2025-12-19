import { useState } from 'react';
import Tabs from './Tabs';
import Catalog from './Catalog';
import Favorites from './Favorites';
import Profile from './Profile';

const Library = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <button onClick={onLogout}>Выйти</button>
      </div>
      <h1>Библиотека</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'catalog' && <Catalog token={token} />}
        {activeTab === 'favorites' && <Favorites token={token} />}
        {activeTab === 'profile' && <Profile token={token} />}
      </div>
    </div>
  );
};

export default Library;