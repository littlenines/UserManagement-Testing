const mysql = require('mysql');


// Connection pool mysql
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// View users
exports.view = (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        console.log('Connected as ID: ' + connection.threadId);

        // Use the connection
        connection.query('call getAll()', (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                let removedUser = req.query.removed;
                res.render('home', { rows: rows[0], removedUser });
            } else {
                console.log('Error: ' + err);
            }

            console.log('The data from user table: \n', rows);
        });
    });
}
// Search
exports.find = (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        console.log('Connected as ID: ' + connection.threadId);

        let searchTerm = req.body.search;

        // Use the connection
        connection.query('call getSearch(?)', ['%' + searchTerm + '%'], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                res.render('home', { rows: rows[0] });
            } else {
                console.log('Error: ' + err);
            }

            console.log('The data from user table: \n', rows);
        });
    });
};

exports.form = (req, res) => {
    res.render('add-user');
};


//  Add user
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        console.log('Connected as ID: ' + connection.threadId);

        let searchTerm = req.body.search;

        // Use the connection
        connection.query('call addUser(?,?,?,?,?)', [first_name, last_name, email, phone, comments], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                res.render('add-user', { alert: 'User added successfully' });
            } else {
                console.log('Error: ' + err);
            }

            console.log('The data from user table: \n', rows);
        });

    });
}
// EDIT
exports.edit = (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        console.log('Connected as ID: ' + connection.threadId);

        // Use the connection
        connection.query('call editUser(?)', [req.params.id], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                res.render('edit-user', { rows: rows[0] });
            } else {
                console.log('Error: ' + err);
            }

            console.log('The data from user table: \n', rows[0]);

        });
    });
};

// Update
exports.update = (req, res) => {

    const { first_name, last_name, email, phone, comments } = req.body;

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        console.log('Connected as ID: ' + connection.threadId);

        // Use the connection
        connection.query('call updateUSer(?,?,?,?,?,?)', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                // Connect to DB
                pool.getConnection((err, connection) => {
                    if (err) { throw err; } //Not connected
                    console.log('Connected as ID: ' + connection.threadId);

                    // Use the connection
                    connection.query('call editUser(?)', [req.params.id], (err, rows) => {
                        // When done with the connection , release it
                        connection.release();

                        if (!err) {
                            res.render('edit-user', { rows: rows[0], alert: `${first_name} has been updated` });
                        } else {
                            console.log('Error: ' + err);
                        }

                        console.log('The data from user table: \n', rows[0]);
                    });
                });
            } else {
                console.log('Error: ' + err);
            }

            console.log('The data from user table: \n', rows[0]);

        });
    });
};

// DELETE
exports.delete = (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        console.log('Connected as ID: ' + connection.threadId);

        // Use the connection
        connection.query('call deleteUser(?)', [req.params.id], (err, rows) => {

              if(!err) {
                  let removedUser = encodeURIComponent('User successfully removed');
                res.redirect('/?removed='+removedUser);
            } else {
                console.log('Error: ' + err);
            }

            console.log('The data from user table: \n', rows[0]);

        });
    });
};

// View USER
exports.viewall = (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) { throw err; } //Not connected
        console.log('Connected as ID: ' + connection.threadId);

        // Use the connection
        connection.query('call viewUser(?)', [req.params.id], (err, rows) => {
            // When done with the connection , release it
            connection.release();

            if (!err) {
                res.render('view-user', { rows: rows[0] });
            } else {
                console.log('Error: ' + err);
            }

            console.log('The data from user table: \n', rows);
        });
    });
}