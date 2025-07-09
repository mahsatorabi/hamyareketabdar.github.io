import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import simpleGit from 'simple-git';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const git = simpleGit();
const STATE_DIR = path.join(__dirname, 'state');

// Ensure state directory exists
if (!fs.existsSync(STATE_DIR)) {
  fs.mkdirSync(STATE_DIR);
}

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const booksFile = path.join(__dirname, 'data', 'books.json');
const needsFile = path.join(__dirname, 'data', 'needs.json');

function readData(file) {
  if (!fs.existsSync(file)) return [];
  const data = fs.readFileSync(file, 'utf-8');
  try { return JSON.parse(data); } catch { return []; }
}
function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// Books CRUD
app.get('/api/books', (req, res) => {
  res.json(readData(booksFile));
});
app.post('/api/books', (req, res) => {
  const books = readData(booksFile);
  const newBook = { ...req.body, id: Date.now().toString(), createdAt: new Date() };
  books.push(newBook);
  writeData(booksFile, books);
  res.status(201).json(newBook);
});
app.put('/api/books/:id', (req, res) => {
  let books = readData(booksFile);
  const idx = books.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  books[idx] = { ...books[idx], ...req.body };
  writeData(booksFile, books);
  res.json(books[idx]);
});
app.delete('/api/books/:id', (req, res) => {
  let books = readData(booksFile);
  books = books.filter(b => b.id !== req.params.id);
  writeData(booksFile, books);
  res.status(204).end();
});

// Needs CRUD
app.get('/api/needs', (req, res) => {
  res.json(readData(needsFile));
});
app.post('/api/needs', (req, res) => {
  const needs = readData(needsFile);
  const newNeed = { ...req.body, id: Date.now().toString(), createdAt: new Date() };
  needs.push(newNeed);
  writeData(needsFile, needs);
  res.status(201).json(newNeed);
});
app.put('/api/needs/:id', (req, res) => {
  let needs = readData(needsFile);
  const idx = needs.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  needs[idx] = { ...needs[idx], ...req.body };
  writeData(needsFile, needs);
  res.json(needs[idx]);
});
app.delete('/api/needs/:id', (req, res) => {
  let needs = readData(needsFile);
  needs = needs.filter(n => n.id !== req.params.id);
  writeData(needsFile, needs);
  res.status(204).end();
});

// API to get state for a page
app.get('/api/state/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(STATE_DIR, `${page}.json`);
  if (fs.existsSync(filePath)) {
    res.json(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  } else {
    res.json({});
  }
});

// API to save state for a page and commit to git
app.post('/api/state/:page', async (req, res) => {
  const page = req.params.page;
  const { state, user } = req.body; // user: { name, email }
  const filePath = path.join(STATE_DIR, `${page}.json`);
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');

  try {
    await git.add(filePath);
    await git.commit(
      `Update state for ${page} by ${user && user.name ? user.name : 'unknown user'}`,
      filePath,
      user && user.name && user.email ? { '--author': `${user.name} <${user.email}>` } : undefined
    );
    // Optionally: await git.push();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});