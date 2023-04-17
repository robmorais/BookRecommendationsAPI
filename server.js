const express = require('express');
const app = express();
const db = require('./db');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//    res.send('Hello, World!');
// });

// Endpoint to serve the list of books from the database
app.get('/books', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM books;');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static files from the current directory
app.use(express.static('.'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});