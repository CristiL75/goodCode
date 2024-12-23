// Importă pachetele necesare
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Pentru hashing parole
const cors = require('cors'); // Asigură-te că ai instalat cors
const User = require('./models/User'); // Importă modelul User
require('dotenv').config();
require('./passport'); // Asigură-te că ai configurat corect Passport

const app = express();

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:3001', // Frontend-ul tău
    credentials: true
}));

// Middleware pentru a procesa cererile JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurarea sesiunii
app.use(session({ 
    secret: process.env.JWT_SECRET, 
    resave: false, 
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// Conectare la MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Ruta principală
app.get('/', (req, res) => {
    res.send('Welcome! Please <a href="/auth/google">login with Google</a>.');
});

// Ruta pentru autentificarea cu Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback după autentificare
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/'); // Redirecționăm către '/' (Home)
    }
);

// Pagina de bun venit
app.get('/home', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Welcome to the home page, ${req.user.displayName}!`); // Afișarea numelui utilizatorului
    } else {
        res.redirect('/'); // Redirectare dacă utilizatorul nu este autentificat
    }
});

// Ruta pentru deconectare
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Ruta pentru signup (înregistrare)
app.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Verifică dacă parolele se potrivesc
    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");
    }

    // Verifică dacă utilizatorul există deja
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send("Username already exists.");
    }

    // Hashing-ul parolei
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crearea unui nou utilizator
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).send("User created successfully.");
});

// Ruta pentru login
app.post('/auth/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/' // Redirectare în cazul eșecului
}));

app.get('/api/users/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Pornirea serverului pe portul 4000
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
