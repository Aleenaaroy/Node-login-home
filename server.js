const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.set("view engine", "ejs");
app.set("views", "public");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "2Dasaleenasecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Predefined username and password for validation
const validUsername = "aleena123";
const validPassword = "password123";

//Append data on login page "Incorrect username or password" or "successfully logged out"
let data;

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  console.log(req.session);
  if (req.session.isAuthenticated) {
    next();
  } else {
    //Destroy session here after checking 'isAuthenticated' property
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      next("route");
    });
  }
};
// Login route
app.get("/", isAuthenticated, (req, res) => {
  res.render("index");
});

app.get("/", (req, res) => {
  data = "";
  res.render("login", { data: data });
});

//After login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === validUsername && password === validPassword) {
    req.session.isAuthenticated = true;

    res.redirect("/"); 
  } else {
    data = "Incorrect username or password";
    res.render("login", { data: data });
  }
});

// Home route (protected)
// app.get("/home", isAuthenticated, (req, res) => {
//   if (req.session.isAuthenticated) {
//     res.render("index");
//   } else {
//     data = "";
//     res.render("login", { data: data });
//   }
// });

// Logout route
app.get("/logout", (req, res) => {
  //data = "successfully logged out";
  req.session.isAuthenticated = false;
  res.redirect("/"); 
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
