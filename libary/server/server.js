const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 5000;
const SECRET = 'supersecretkey';
const USERS_FILE = path.join(__dirname, 'users.csv');
const BOOKS_FILE = path.join(__dirname, 'books.csv');

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public'))); // Важно: раздаём public из корня!
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Чтение книг из CSV
const readBooks = () => {
  return new Promise((resolve) => {
    const books = [];
    if (!fs.existsSync(BOOKS_FILE)) return resolve([]);
    fs.createReadStream(BOOKS_FILE)
      .pipe(csv())
      .on('data', (data) => books.push(data))
      .on('end', () => resolve(books));
  });
};

// Чтение пользователей
const readUsers = () => {
  return new Promise((resolve) => {
    const users = [];
    if (!fs.existsSync(USERS_FILE)) return resolve([]);
    fs.createReadStream(USERS_FILE)
      .pipe(csv())
      .on('data', (data) => users.push(data))
      .on('end', () => resolve(users));
  });
};

const writeUsers = async (users) => {
  const writer = createObjectCsvWriter({
    path: USERS_FILE,
    header: [
      { id: 'username', title: 'username' },
      { id: 'password', title: 'password' },
      { id: 'avatar', title: 'avatar' },
      { id: 'favorites', title: 'favorites' },
    ],
  });
  await writer.writeRecords(users);
};

// Создаём нужные файлы и папки
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync(USERS_FILE)) writeUsers([]);

// Маршруты
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const users = await readUsers();
  if (users.find((u) => u.username === username)) return res.status(400).json({ error: 'Пользователь существует' });
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed, avatar: '', favorites: '[]' });
  await writeUsers(users);
  res.json({ message: 'Успешно зарегистрирован' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await readUsers();
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Неверные данные' });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '7d' });
  res.json({ token });
});

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Нет доступа' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Неверный токен' });
  }
};

// Все книги
app.get('/books', auth, async (req, res) => {
  const books = await readBooks();
  res.json(books);
});

// Одна книга по коду
app.get('/books/:code', auth, async (req, res) => {
  const books = await readBooks();
  const book = books.find((b) => b.code === req.params.code);
  book ? res.json(book) : res.status(404).json({ error: 'Книга не найдена' });
});

// Избранное
app.get('/favorites', auth, async (req, res) => {
  const users = await readUsers();
  const books = await readBooks();
  const user = users.find((u) => u.username === req.user.username);
  const favorites = JSON.parse(user?.favorites || '[]');
  const favBooks = books.filter((b) => favorites.includes(b.code));
  res.json(favBooks);
});

app.post('/favorites', auth, async (req, res) => {
  const { code } = req.body;
  const users = await readUsers();
  const userIndex = users.findIndex((u) => u.username === req.user.username);
  if (userIndex === -1) return res.status(404).json({ error: 'Пользователь не найден' });

  let favorites = JSON.parse(users[userIndex].favorites || '[]');
  if (!favorites.includes(code)) {
    favorites.push(code);
    users[userIndex].favorites = JSON.stringify(favorites);
    await writeUsers(users);
  }
  res.json({ message: 'Добавлено в избранное' });
});

app.get('/profile', auth, async (req, res) => {
  const users = await readUsers();
  const user = users.find((u) => u.username === req.user.username);
  res.json({ username: user.username, avatar: user.avatar });
});

app.post('/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
  const users = await readUsers();
  const userIndex = users.findIndex((u) => u.username === req.user.username);
  users[userIndex].avatar = `/uploads/${req.file.filename}`;
  await writeUsers(users);
  res.json({ avatar: users[userIndex].avatar });
});

app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));