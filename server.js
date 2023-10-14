const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.set('view engine','ejs');
app.set('views','public');



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: '2Dasaleenasecretkey', resave: false, saveUninitialized: true }));

// Predefined username and password for validation
const validUsername = 'admin';
const validPassword = 'password123';
let data;



app.get('/', (req, res) => {
    data="";
    res.render('login',{data:data});
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    req.session.user=username;
    if (username === validUsername && password === validPassword) {
        req.session.authenticated = true;
        res.render('index');
    } else {
        data="Incorrect username or password";
        res.render('login',{data:data});
    }
});

// Home route (protected)
app.get('/home', (req, res) => {
    if (req.session.authenticated) {
        res.render('index');
    } else {
        data="";
        res.render('login',{data:data});
    }
});

// Logout route
app.get('/logout', (req, res) =>{
    data="successfully logged out";
    req.session.user=null;
    req.session.save(err=>{
        if(err)
     console.log(err); 
    });  
    res.render('login',{data:data});
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


