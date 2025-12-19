import { useState, useEffect } from 'react';

const Profile = ({ token }) => {
  const [profile, setProfile] = useState({ username: '', avatar: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProfile);
  }, [token]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch('http://localhost:5000/profile/avatar', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    setProfile((prev) => ({ ...prev, avatar: data.avatar }));
    setFile(null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Профиль: {profile.username}</h2>
      {profile.avatar ? (
        <img
          src={`http://localhost:5000${profile.avatar}`}
          alt="Аватар"
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ width: '150px', height: '150px', background: '#ccc', borderRadius: '50%', margin: '20px auto' }} />
      )}
      <div style={{ marginTop: '20px' }}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={!file} style={{ marginLeft: '10px' }}>
          Загрузить аватар
        </button>
      </div>
    </div>
  );
};

export default Profile;