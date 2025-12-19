const Tabs = ({ activeTab, setActiveTab }) => (
  <div style={{ borderBottom: '2px solid #ccc', marginBottom: '20px' }}>
    <button
      onClick={() => setActiveTab('catalog')}
      style={{ padding: '10px 20px', fontWeight: activeTab === 'catalog' ? 'bold' : 'normal' }}
    >
      Каталог
    </button>
    <button
      onClick={() => setActiveTab('favorites')}
      style={{ padding: '10px 20px', fontWeight: activeTab === 'favorites' ? 'bold' : 'normal' }}
    >
      Избранное
    </button>
    <button
      onClick={() => setActiveTab('profile')}
      style={{ padding: '10px 20px', fontWeight: activeTab === 'profile' ? 'bold' : 'normal' }}
    >
      Профиль
    </button>
  </div>
);

export default Tabs;