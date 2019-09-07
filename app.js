// Installed body-pareser, mongoose,express, ejs, method-override
//IMPORTING ELEMENTS
var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    methodOverride = require("method-override"); // Used to make PUT and DELETE
    // requests by faking the Post or Get request because html can't handle

//APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs"); //Now we don't necessarily have to put .ejs in file names below.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MONGOOSE & MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
//INDEX ROUTE
app.get("/", function (req, res) {
    res.redirect("/blogs");
})

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { blogs: blogs })
        }
    })
})

// NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
})

// CREATE ROUTE
app.post("/blogs", function (req, res) {
    //create blog
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            //then redirect to the index
            res.redirect("/blogs");
        }
    })
})

// SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs")
        }
        else {
            res.render("show", { blog: foundBlog })
        }
    })
})

// EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("edit", { blog: foundBlog });
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    const id = req.params.id,
        data = req.body.blog; //Which is accessed due to body-parser
    Blog.findByIdAndUpdate(id, data, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs")
        }
        else {
            res.redirect("/blogs/" + id)
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id" , function( req , res ){
    id = req.params.id;
    //destroy blog
    Blog.findByIdAndDelete(id , function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            //redirect somewhere
            res.redirect("/blogs");
        }
    })
})

//LISTENING TO SERVER
app.listen(3000, function () {
    console.log("Server is running");
})
