const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Predefined username and password for validation
const validUsername = 'admin';
const validPassword = 'password123';

// Serve static files (Bootstrap and HTML)
app.use(express.static('public'));


app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === validUsername && password === validPassword) {
        req.session.authenticated = true;
        res.redirect('/home');
    } else {
        res.status(401).send('Incorrect username or password');
    }
});

// Home route (protected)
app.get('/home', (req, res) => {
    if (req.session.authenticated) {
        res.sendFile(__dirname + '/public/index.html');
    } else {
        res.redirect('/login');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.authenticated = false;
    res.redirect('/login');
   
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/login.html`);
});
