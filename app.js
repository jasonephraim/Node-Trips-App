const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var session = require("cookie-session");
const mustacheExpress = require("mustache-express");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// setting up Express to use Mustache Express as template pages
app.engine("mustache", mustacheExpress());
// the pages are located in views directory
app.set("views", "./views");
// extension will be .mustache
app.set("view engine", "mustache");

app
  .use(session({ secret: "ThisIsMySecret" }))

  /* If there is no to do active array in the session, 
we create an empty one in the form of an array before continuing */
  .use(function (req, res, next) {
    if (typeof req.session.trip == "undefined") {
      req.session.trip = [];
    }
    next();
  })

  /* Current session to do list and form */
  .get("/trips", function (req, res) {
    res.render("index.mustache", { trip: req.session.trip });
  })

  /* Adding a to do item */
  .post("/trips/add/", urlencodedParser, function (req, res) {
    if (req.body.destinationInput != "") {
      req.session.trip.push({
        destination: req.body.destinationInput,
        departure: req.body.departureDateInput,
        return: req.body.returnInput,
        image: req.body.imageInput,
      });
    }
    res.redirect("/trips");
  })

  /* Deleting a to do item */
  .get("/trips/delete/:id", function (req, res) {
    if (req.params.id != "") {
      req.session.trip.splice(req.params.id, 1);
    }
    res.redirect("/trips");
  });

app.use(express.urlencoded()); // for parsing form submitted data

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Server is running...");
});

console.log(session.trip);
