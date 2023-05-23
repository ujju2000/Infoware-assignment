
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// database connection 
const mysql = require('mysql');


let conn = mysql.createConnection({
    host : "127.0.0.1",
    user : 'root',
    password : 'root123',
    database : 'my_db'
})

conn.connect(function(err) {
    if(err) console.log(err);
    else console.log('connected');
    let sql = "CREATE TABLE employees ( id INT PRIMARY KEY AUTO_INCREMENT, fname VARCHAR(50) NOT NULL, lname VARCHAR(50) NOT NULL, email VARCHAR(100) UNIQUE, age INT, department VARCHAR(50), salary DECIMAL(10, 2));"

   conn.query(sql, (err, res) => {
       if(err) console.log('database already exist!!');
       else console.log("query added");
   })
})

app.get('/' , (req,res) => {
    res.render('form');
})

app.route('/employees').post((req,res) => {
    let obj = req.body;
     //   add the information in db
    
     const query =  'INSERT INTO employees (fname, lname, email,age,department,salary) VALUES (?, ?, ?,?,?,?)';
     const values= Object.values(obj);  

     conn.query(query,values, (err,res) => {
         if(err) console.log(err);
         else console.log('1 record inserted');
     })

     res.redirect('/employees');
}).get((req,res) => {
    const query = 'Select * from employees';
    conn.query(query, (err,result) => {
        if(err) console.log(err);
        else res.render('showAll' , {employees :result});
    })  
})

app.route('/updateEmployee').get((req,res) => {
    const query = 'Select * from employees';
    conn.query(query, (err,result) => {
        if(err) console.log(err);
        else res.render('update' , {employees :result});
    })  
}).post((req,res) => {

})


app.post('/employees/:id', (req,res) => {
    const id = req.params.id;
    const obj = req.body;
    // console.log(obj);
    const query = `Update employees set fname = "${obj.fname}", lname = "${obj.lname}", 
    email = "${obj.email}", age = ${obj.age}, department = "${obj.department}", salary = ${obj.salary} where id = ${id}`;

    conn.query(query, (err,res) => {
        if(err) console.log(err);
        else console.log('value updated');
        
    })
    res.redirect('/employees');
})


app.route('/deleteEmployee').get((req,res) => {
    const query = 'Select * from employees';
    conn.query(query, (err,result) => {
        if(err) console.log(err);
        else res.render('delete' , {employees :result});
    })     
})
app.post('/employees/:id/delete', (req,res) => {
    const id = req.params.id;
    const query = `Delete from employees where id = ${id}`;

    conn.query(query, (err,res) => {
        if(err) console.log(err);
        else console.log('1 record deleted');
    })
    res.redirect('/employees');
}) 

app.listen(3000, () => console.log('server running at 3000'));