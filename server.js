const express = require('express');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '172.29.18.118',
    user: 'assesNodeServerDemo',
    password: 'assesNodeServerDemo',
    database: 'bddTest',
});

connection.connect((err => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ', err);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
}));
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/login', (req, res) => {
    res.send('bienvenu sur la page de connexion');
});

app.get('/info', (req, res) => {
    res.json({ cle1: 'valeur1', cle2: 'valeur2' });
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});

app.post('/register', (req, res) => {
    console.log('données reçues pour l\'inscription :');
    console.log(req.body);
   
    connection.query(
        'INSERT INTO user (login, password) VALUES (?, ?)',
        [req.body.inputValue, req.body.inputValue2],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion dans la base de données :', err);
                res.status(500).json({ message: 'Erreur serveur' });
                return;
            }
            console.log('Insertion réussie, ID utilisateur :', results.insertId);
            res.json({ message: 'Inscription réussie !', userId: results.insertId });
        }
    );
});


