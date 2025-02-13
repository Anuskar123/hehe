const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const reviewsFilePath = path.join(__dirname, 'reviews.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/reviews', (req, res) => {
    fs.readFile(reviewsFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading reviews file');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/submit-review', (req, res) => {
    const { name, rating, review, email } = req.body;
    const date = new Date().toLocaleString();
    fs.readFile(reviewsFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading reviews file');
        }
        const reviews = JSON.parse(data);
        reviews.push({ name, rating, review, date, email });
        fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing reviews file');
            }
            res.redirect('/');
        });
    });
});

app.delete('/delete-review', (req, res) => {
    const { index, email } = req.body;
    fs.readFile(reviewsFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading reviews file');
        }
        const reviews = JSON.parse(data);
        if (reviews[index].email === email) {
            reviews.splice(index, 1);
            fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error writing reviews file');
                }
                res.sendStatus(200);
            });
        } else {
            res.status(403).send('You can only delete your own reviews.');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
