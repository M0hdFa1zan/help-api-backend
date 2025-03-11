const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');  // To generate unique IDs
const Card = require('./models/Card');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Create a new card
app.post('/cards', async (req, res) => {
    try {
        const { title, description } = req.body;
        const card = new Card({
            id: uuidv4(),
            title,
            description,
        });
        await card.save();
        res.status(201).json(card);
    } catch (error) {
        res.status(500).json({ message: 'Error creating card', error });
    }
});

// Get all cards
app.get('/cards', async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cards', error });
    }
});

// Get a specific card by title
app.get('/cards/search/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const card = await Card.find({ title: new RegExp(title, 'i') });
        if (card.length === 0) {
            return res.status(404).json({ message: 'No cards found matching the title' });
        }
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for cards', error });
    }
});

// Error handling for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 8080;
mongoose.connect('mongodb+srv://Billybucha:Omlanda5@cluster0.qauqfyi.mongodb.net/?appName=mongosh+2.0.0')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.log('Failed to connect to MongoDB', err));
