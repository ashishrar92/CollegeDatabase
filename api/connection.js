var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Ash1!rar',
  database : 'college_database'
});
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err);
        return;
    }
});
module.exports = connection;