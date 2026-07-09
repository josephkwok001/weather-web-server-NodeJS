const path = require("path")
const express = require("express")
const hbs = require("hbs")

const app = express() 

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// Setup handle bars
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)



//setup static directory to sereve
app.use(express.static(publicDirectoryPath))

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather App",
        name: "Joseph"
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Joseph"
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help Page",
        helptext: "This is some helpful text",
        name: "Joseph"
    })
})

app.get("/weather", (req, res) => {
    res.send({
        forecast: "It is sunny",
        location: "Hong Kong"
    })
})

app.get("/products", (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term!"
        })
    }
    
    res.send({
        product: []
    })
})

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Joseph",
        errorText: "Help article not found"
    })
})

app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        errorText: "Page not found",
        name: "Joseph"
    })
})


app.listen(3000, () => {
    console.log("Server is up in 3000")
})
