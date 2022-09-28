const express = require('express')
const app = express()
const router = express.Router();
var mysql = require('mysql'); 
//const port = process.env.port || 3000;

app.use(express.json());
//app.use(express.urlencoded());


let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'car_db'
});

app.get('/', (req, res) => {
  res.send('Hello World!')
  })

app.get('/test', (req, res) => {
    res.send('Testing this shit. Hello!')
  })

app.get('/employees', (req, res) => {
    con.query('SELECT * FROM employees;', (err,result) => {
        if(err) throw err;
        result=JSON.parse(JSON.stringify(result));
        console.log(result)
        res.send(result)
      });
  })

app.get('/carmodels', (req, res) => {
    con.query('SELECT * FROM carmodels;', (err,result) => {
        if(err) throw err;
        result=JSON.parse(JSON.stringify(result));
        res.send(result);
      });
  })  

app.get('/total_sales', (req, res) => {
    let sql = "SELECT E.name, T.employee_id, T.total_sales FROM \(SELECT SUBQUERY.employee_id, SUM(SUBQUERY.price) AS total_sales \
    FROM (SELECT a.employee_id, a.carmodel_id, b.price AS price FROM sales a, carmodels b WHERE a.carmodel_id=b.id) AS SUBQUERY \
    GROUP BY SUBQUERY.employee_id) AS T, employees AS E WHERE E.id=T.employee_id;"

    con.query(sql, (err,result) => {
        if(err) throw err;
        result=JSON.parse(JSON.stringify(result));
        console.log(result)
        res.send(result)
      });
  })

app.post('/carmodels', (req, res) => {
    let data = [req.body.id, req.body.brand, req.body.model, req.body.price];
    con.query('INSERT INTO carmodels (id, brand, model, price) VALUES (?, ?, ?, ?);', data, (err, results) => {     
      !err ? res.send(req.body) : res.send(err);
    });
})

app.delete('/carmodels', (req, res) => {
  const id = req.body.id;
  con.query(`SELECT * FROM carmodels WHERE id=${id};`, (err, result) => {
    if (err) throw err;
    result=JSON.parse(JSON.stringify(result));
    res.send(result);
  });

  con.query(`DELETE FROM carmodels WHERE id=${id};`);
})

// async function create(table){
//     const result = await db.query(
//         `INSERT INTO ${table} 
//         (id, name) 
//         VALUES 
//         (${table.name}, ${programmingLanguage.released_year})`
//     );

//     let message = 'Error in creating programming language';

//     if (result.affectedRows) {
//         message = 'Programming language created successfully';
//     }

//     return {message};
// }

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  })

var port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));