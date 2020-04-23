require('./models/db');

var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const mongodb = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
    
var app = express();

const mongoClient = mongodb.MongoClient;
const databaseURL = "mongodb://localhost:27017/";
const dbname = "userDB";

const options = { useUnifiedTopology: true };

const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

const userModel = require('./models/user.model');
const postModel = require('./models/post.model');

mongoClient.connect(databaseURL, options, function(err, client) {
  if (err) throw err;
  const dbo = client.db(dbname);

  //Will create a collection if it has not yet been made
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created for users!");
//    client.close();
  });
    
  dbo.createCollection("posts", function(err, res) {
    if (err) throw err;
    console.log("Collection created for posts!");
    client.close();
  });
});

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/uploads')));

app.set('views', path.join(__dirname, '/views/'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', (process.env.PORT || 3000));

app.use('/user', userController);  
app.use('/post', postController);

app.engine( 'hbs', exphbs({
  extname: 'hbs', 
  defaultView: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts'), 
  partialsDir: path.join(__dirname, '/views/partials'), 
}));

app.set('view engine', 'hbs');

app.use(session({
  secret: 'secretsecret',
  store: new MongoStore({ url: "mongodb://localhost:27017/userDB" }),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

//HOME ROUTE
app.get('/', function(req,res){
    res.render('login', {
        layout:''
    });
});

app.get('/login',(req,res)=>{
    res.render('login',{
        layout:''
    });
});

app.post('/log', function(req, res){
    var username = req.body.un
    var password = req.body.pw
    
    console.log(username);
    
    userModel.find({username:username, password:password}).then((doc)=>{
        console.log("user match");
        console.log(req.body.un);
        
        res.redirect('/feed');
        
    }, (err)=>{
        res.send(err)
    });      
});


//USER ROUTE
app.get('/user', function(req, res){
});

// POSTS ROUTE
//show all posts on the feed
app.get('/posts', function(req, res){
    postModel.find({}).sort({date: 1}).exec(function(err, result) {
        var postObjects = [];
        
        result.forEach(function(doc) {
            postObjects.push(doc.toObject());
        });
        
        res.render('posts', {postModel: postObjects});
    });
});

app.get('/new_post', function(req, res){
   res.render('new_post',{
   }) 
});

app.get('/profile', function(req, res){
   res.render('profile',{
   }) 
});

app.get('/feed', function(req, res){
   res.render('feed',{
       username: userModel.username,
       date: postModel.date,
   }) 
});

app.get('/register', function(req, res){
   res.render('register',{
       layout:''
   }) 
});

app.listen(app.get('port'), function(){
    console.log('server started on port', + app.get('port'));
});