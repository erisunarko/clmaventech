// ~ define variables used :
var express   = require('express');
var app       = express();
var mysql     = require('mysql');
var bodyParser = require('body-parser');

// ~ set view folder and default view engine :
app.set('views', './views');
app.set('view-engine', 'ejs');

// ~ activating body parser :
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

// ~ define mySql connection parameter :
var conn    = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password : '',
    database : 'db_clmaven'
});

// ~ connect to mysql connection :
conn.connect((err) => {
    if(err) throw err;
    console.log('Connected to database...');
});

// ~ get data :
app.get('/', (req, res) => {
    let sql     = 'SELECT * FROM tb_employees';
    let query   = conn.query(sql, (err, results) => {
        if(err) throw err;        
        res.render('index.ejs', { data : results });
    });
});

// ~ get all data for csv :
app.get('/getcsv', (req, res) => {
    let sql     = 'SELECT * FROM tb_employees';
    let query   = conn.query(sql, (err, results) => {
        if(err) throw err;
        json_results = JSON.stringify(results);
        res.json(json_results);
    });
});

// ~ insert data :
app.post('/save', (req, res) => {
    let data    = {
        name    : req.body.name,
        gender  : req.body.gender,
        place_of_birth  : req.body.place_of_birth,
        date_of_birth   : req.body.date_of_birth,
        religion        : req.body.religion,
        address         : req.body.address,
        phone           : req.body.phone,
        email           : req.body.email,
        notes           : req.body.notes
    }
    let sql     = 'INSERT INTO tb_employees SET ?';
    let query   = conn.query(sql, data, (err, results) => {
        if(err) throw err;        
        res.redirect('/');
    });
});

// ~ CSV import :
app.post('/import', (req, res) => {
    let csv_data    = JSON.parse(req.body.csv_data);
    let data_length = csv_data.length;
    for(let i=0; i < data_length; i++) {
        let name            = csv_data[i].name;
        let gender          = csv_data[i].gender;
        let place_of_birth  = csv_data[i].place_of_birth;        
        let obj_dob         = new Date(csv_data[i].date_of_birth);
        let d_o_b           = obj_dob.getDate();
        let m_o_b           = obj_dob.getMonth()+1;
        let y_o_b           = obj_dob.getFullYear();
        let date_of_birth   = y_o_b + '-' + m_o_b + '-' + d_o_b;
        let religion        = csv_data[i].religion;
        let address         = csv_data[i].address;
        let phone           = csv_data[i].phone;
        let email           = csv_data[i].email;
        let notes           = csv_data[i].notes;
        let data = {
            name            : name,
            gender          : gender,
            place_of_birth  : place_of_birth,                                
            date_of_birth   : y_o_b + '-' + m_o_b + '-' + d_o_b,
            religion        : religion,
            address         : address,
            phone           : phone,
            email           : email,
            notes           : notes,        
        }
        
        let query = "INSERT INTO tb_employees SET ?";
        conn.query(query, data, (err, results) => {
            if(err) throw err;            
        });
        
    }
    
    res.redirect('/');
});

// ~ update data :
app.post('/update', (req, res) => {
    let id      = req.body.id;
    let name    = req.body.name;
    let gender  = req.body.gender;
    let place_of_birth  = req.body.place_of_birth;
    let date_of_birth   = req.body.date_of_birth;
    let religion        = req.body.religion;
    let address         = req.body.address;
    let phone           = req.body.phone;
    let email           = req.body.email;
    let notes           = req.body.notes;

    let sql     = "UPDATE tb_employees SET name = '" + name + "', gender = '" + gender + "', place_of_birth = '" + 
                    place_of_birth + "', date_of_birth = '" + date_of_birth + "', religion = '" + religion + "', address = '" + 
                        address + "', phone = '" + phone + "', email = '" + email + "', notes = '" + notes + "' WHERE id = '" + id + "'";
    let query   = conn.query(sql, (err, results) => {
        if(err) throw err;        
        res.redirect('/');
    });
});

// ~ delete single record :
app.get('/delete/:id', (req, res) => {
    let sql = "DELETE FROM tb_employees WHERE id = " + req.params.id + "";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// ~ delete all record :
app.get('/clear', (req, res) => {
    let sql = "DELETE FROM tb_employees";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// ~ start server :
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
