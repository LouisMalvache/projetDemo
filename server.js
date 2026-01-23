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


app.get('/users', (req, res) => {
    connection.query('SELECT * FROM user', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            res.status(500).json({ message: 'Erreur serveur' });
            return;
        }
        res.json(results);
    });
});

app.post('/register', (req, res) => {
    console.log('Données reçues pour l\'inscription :');
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

app.post('/vote', (req, res) => {
    console.log('Vote reçu :');
    console.log(req.body);
    
    const idUser = req.body.idUser;
    
    if (!idUser) {
        res.status(400).json({ message: 'Utilisateur non sélectionné' });
        return;
    }
    
    connection.query(
        'INSERT INTO vote (idUser) VALUES (?)',
        [idUser],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion du vote :', err);
                res.status(500).json({ message: 'Erreur serveur' });
                return;
            }
            console.log('Vote enregistré avec succès, ID du vote :', results.insertId);
            res.json({ message: 'Vote enregistré avec succès !' });
        }
    );
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});

// Route pour compter les votes d'un utilisateur
app.get('/vote-count/:userId', (req, res) => {
    const userId = req.params.userId;
    
    connection.query(
        'SELECT COUNT(*) as voteCount FROM vote WHERE idUser = ?',
        [userId],
        (err, results) => {
            if (err) {
                console.error('Erreur lors du comptage des votes :', err);
                res.status(500).json({ message: 'Erreur serveur' });
                return;
            }
            res.json({ userId: userId, voteCount: results[0].voteCount });
        }
    );
});

// obtenir tous les votes de tous les utilisateurs
app.get('/all-votes', (req, res) => {
    connection.query(
        'SELECT user.id, user.login, COUNT(vote.id) as voteCount FROM user LEFT JOIN vote ON user.id = vote.idUser GROUP BY user.id, user.login ORDER BY voteCount DESC',
        (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération des votes :', err);
                res.status(500).json({ message: 'Erreur serveur' });
                return;
            }
            console.log('Résultats all-votes:', results);
            res.json(results);
        }
    );
});