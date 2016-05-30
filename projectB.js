// Loads the engines
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');
app.use(express.static('public'));

// Sets up the engines
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4004);

// Sets up the body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connects MySQL
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'student',
    password: 'default',
    database: 'student'
});

// Checks connection to database
pool.query("SELECT * FROM shelter", function(err){
  console.log("Errors in connecting to shelter: " + err);
});
app.get("/getdata", function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM shelter', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
	res.send(JSON.stringify( rows));
  });
});

// Create user website
app.get("/user-page", function(req, res){
  var context = {};
  pool.query('SELECT * FROM shelter AS s LEFT JOIN address AS a ON s.address_id = a.id', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
	  res.status(200);
	  //res.render('user-page');
	  res.render('user',context);
  });	
});

// Create provider website
app.get("/provider-page", function(req, res){
  var context = {};
  pool.query('SELECT id, name FROM shelter', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.status(200);
    res.render('provider',context);
  }); 
});

// Adds providers to the database
app.post("/add-provider", function(req, res){
  // Converts empty strings to null
  body = req.body;
  if (body.name == "")
    body.name = null;

  // Adds the address to the database
  pool.query("INSERT INTO address (unitNum, street_num, street_name, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?)",
    [body.unitNo, body.streetNo, body.streetAddress, body.city, body.state, body.zipCode ], function(err, result) {
      if (err != null)
        res.send(JSON.stringify({"no_error": "false"}));
      else {
	    // Adds the value to the database
  	    pool.query("INSERT INTO shelter (name, bed_total, available, address_id) VALUES (?, ?, ?, ?)",
		  [body.name, body.bedT, body.bedA, result.insertId], function(err) {
		    if (err != null)
			  res.send(JSON.stringify({"no_error": "false"}));
		    else
			  res.send(JSON.stringify({"no_error": "true"}));
		  });		  
	  }
	});
});

// Updates providers to the database
app.post("/update-provider", function(req, res){
  body = req.body;

  // Pulls the old data fromt the database
  pool.query('SELECT * FROM shelter AS s LEFT JOIN address AS a ON s.address_id = a.id WHERE s.id = ?', [body.ID], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    
    // Prevents Empty Information from overiding the database
    if (body.bedT == "")
      body.bedT = rows[0].bed_total;
    if (body.bedA == "")
      body.bedA = rows[0].available;
    if (body.unitNo == "")
      body.unitNo = rows[0].unitNum;
    if (body.streetNo == "")
      body.streetNo = rows[0].street_num;
    if (body.streetAddress == "")
      body.streetAddress = rows[0].street_name;
    if (body.city == "")
      body.city = rows[0].city;
    if (body.state == "")
      body.state = rows[0].state;
    if (body.zipCode == "")
      body.zipCode = rows[0].zip_code;

    // Saves the address id
    var address_id = rows[0].address_id;

    // Updates the data
    pool.query("UPDATE shelter SET bed_total=?, available=? WHERE id=?",
      [body.bedT, body.bedA, body.ID], function(err) {
        if (err != null)
          res.send(JSON.stringify({"no_error": "false"}));
        else {
          pool.query("UPDATE address SET unitNum=?, street_num=?, street_name=?, city=?, state=?, zip_code=? WHERE id=?",
            [body.unitNo, body.streetNo, body.streetAddress, body.city, body.state, body.zipCode, address_id], function(err){
              if (err != null)
                res.send(JSON.stringify({"no_error": "false"}));
              else
                res.send(JSON.stringify({"no_error": "true"}));
            });
        }
      });
  });
});

// Create provider website
app.get("/cover", function(req, res){
  res.status(200);
  res.render('cover');
});

// Error page not found
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

// Error server error
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});