const express = require("express");
var bodyParser = require('body-parser')
let date = require('date-and-time');
const app = express();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.get('/', (req, res) => res.render('pages/index'));
app.get('/product_list', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM product_table ORDER BY id ASC');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/product_list', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  


  app.get('/product_list/:id',  async (req, res) => {
    var pid = req.params.id;
     try {
      const client = await pool.connect()
      const result = await client.query(`SELECT * FROM product_table where id = ${pid}`);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/edit_pd', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  app.get('/users_list', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM users ORDER BY id ASC');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/users_list', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  app.get('/users_list/:id',  async (req, res) => {
    var pid = req.params.id;
     try {
      const client = await pool.connect()
      const result = await client.query(`SELECT * FROM users where id = ${pid}`);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/edit_user', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  
  

  app.get('/search_pd',  async (req, res) => {
    var text = req.query.search;
     try {
      const client = await pool.connect()
      const result = await client.query(`SELECT * FROM product_table where cast(id as text) LIKE '%${text}%' or title LIKE '%${text}%' or create_at LIKE '%${text}%'`);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/search_pd', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })


  app.post('/product_list/save',  async (req, res) => {
    var pid = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var tag = req.body.tag_product;
    var date = req.body.create_at;


try {
      const client = await pool.connect()
      const result = await client.query(`UPDATE product_table SET id = ${pid},title = '${title}',price = ${price},tag='${tag}',create_at = '${date}' where id = ${pid}`);
      res.render('pages/complete_add_pd');
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);

    }
  })

  app.post('/users_list/save',  async (req, res) => {
    var pid = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var date = req.body.create_at;


try {
      const client = await pool.connect()
      const result = await client.query(`UPDATE users SET email = '${email}',password = ${password},create_at = '${date}' where id = ${pid}`);
      res.render('pages/complete_add_user');
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);

    }
  })


app.post('/complete_add_pd', async (req, res) =>{

  var title = req.body.title;
  var price = req.body.price;
  var tag = req.body.tag_product;
  let now = new Date();
  let datenow = date.format(now, 'MM/DD/YYYY');

  try {
    const client = await pool.connect()
    const result = await client.query(`insert into product_table(title,price,create_at,tag) values ('${title}','${price}','${datenow}','${tag}')`);
    res.render('pages/complete_add_pd');
    console.log("OK");
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/complete_add_user', async (req, res) =>{

  var email = req.body.email;
  var password = req.body.password;
  let now = new Date();
  let datenow = date.format(now, 'MM/DD/YYYY');

  try {
    const client = await pool.connect()
    const result = await client.query(`insert into users(email,password,create_at) values ('${email}','${password}','${datenow}')`);
    res.render('pages/complete_add_user');
    console.log("OK");
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})


app.get('/product_list/complete_del_pd/:id', async (req, res) =>{
  var pid = req.params.id;

  try {
    const client = await pool.connect()
    const result = await client.query(`delete from product_table values where id = ${pid}`);
    res.render('pages/complete_del_pd');
    console.log("OK");
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/users_list/complete_del_user/:id', async (req, res) =>{
  var pid = req.params.id;

  try {
    const client = await pool.connect()
    const result = await client.query(`delete from users values where id = ${pid}`);
    res.render('pages/complete_del_user');
    console.log("OK");
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/product_report',  async (req, res) => {
  
   try {
    const client = await pool.connect()
    const result = await client.query(`select tag,count(*) from product_table group by tag`);
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/product_report', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})


app.get('/purchase_report',  async (req, res) => {
  
  try {
    const client = await pool.connect()
     const result = await client.query(`select * from purchase;`);
     const result2 = await client.query(`select to_char(buy_at,'MM') as buy_at,sum(sale) as sale from purchase group by buy_at order by buy_at ASC;`);
     const results = { 'results': (result) ? result.rows : null};
     const results2 = { 'results2': (result2) ? result2.rows : null};
    res.render("pages/purchase_report",{results2,results});
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }

})

  
app.get('/insert_pd',(req,res) => res.render('pages/insert_pd'));
app.get('/insert_user',(req,res) => res.render('pages/insert_user'));


app.listen(process.env.PORT || 8000);

