import { useState, useEffect } from 'react';

const Sidebar = ({ activeTab, setActiveTab, token }) => {
  const [profile, setProfile] = useState({ username: '', avatar: '' });

  useEffect(() => {
    fetch('http://localhost:5000/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setProfile({ username: 'Гость', avatar: '' }));
  }, [token]);

  const menuItems = [
    { id: 'catalog', label: 'Каталог', icon: '📚' },
    { id: 'favorites', label: 'Избранное', icon: '❤️' },
    { id: 'profile', label: 'Профиль', icon: '👤' },
  ];

  return (
    <div
      style={{
        width: '280px',
        background: '#f8f9fa',
        borderRight: '1px solid #dee2e6',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      {/* Аватарка и имя внизу */}
      <div style={{ flex: 1 }} />

      <div
        style={{
          padding: '20px',
          borderTop: '1px solid #dee2e6',
          background: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {profile.avatar ? (
            <img
              src={`http://localhost:5000${profile.avatar}`}
              alt="Аватар"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #007bff',
              }}
            />
          ) : (
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            >
              {profile.username[0]?.toUpperCase() || 'Г'}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
              {profile.username}
            </div>
            <div style={{ fontSize: '0.9em', color: '#6c757d' }}>Читатель</div>
          </div>
        </div>
      </div>

      {/* Меню */}
      <nav style={{ padding: '20px 0' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              width: '100%',
              padding: '16px 24px',
              textAlign: 'left',
              background: activeTab === item.id ? '#007bff' : 'transparent',
              color: activeTab === item.id ? 'white' : '#212529',
              border: 'none',
              fontSize: '1.1em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = activeTab !== item.id ? '#e9ecef' : '#007bff')}
            onMouseOut={(e) => (e.currentTarget.style.background = activeTab === item.id ? '#007bff' : 'transparent')}
          >
            <span style={{ fontSize: '1.4em' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;