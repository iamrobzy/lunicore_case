let mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'car_db'
});

con.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');

    con.query('USE car_db;', function (err, result) {
        if (err) throw err;
      });

    con.query('SELECT * FROM employees;', function (err, result, fields) {
      if (err) throw err;
      result=JSON.parse(JSON.stringify(result));
      console.log(result);
    });
});
  