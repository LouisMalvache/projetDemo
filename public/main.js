const loginInput = document.getElementById('loginInput');
const passwordInput = document.getElementById('passwordInput');

const registerBouton = document.getElementById('registerButton');
const loginBouton = document.getElementById('loginButton');
const monBouton2 = document.getElementById('monBouton2');
const compteur = document.getElementById('compteur');
const userSelectBouton = document.getElementById('userSelectBouton'); 
const voteBouton = document.getElementById('voteBouton');


//afficher les statistiques de votes 

function afficherStatistiques() {
    fetch('/all-votes')
    .then(response => response.json())
    .then(stats => {
        console.log('Stats reçues:', stats); 
        const statsContent = document.getElementById('statsContent');
        
        if (stats.length === 0) {
            statsContent.innerHTML = '<p>Aucun vote pour le moment</p>';
            return;
        }
        
        let html = '';
        stats.forEach((user, index) => {
            html += `<p>${index + 1}. ${user.login} - ${user.voteCount} vote(s)</p>`;
        });
        
        statsContent.innerHTML = html;
    })
    .catch(error => {
        console.error('Erreur:', error);
        document.getElementById('statsContent').innerHTML = '<p style="color: red;">Erreur de chargement</p>';
    });
}



// Inscription

registerBouton.addEventListener('click', () => {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            login: loginInput.value, 
            password: passwordInput.value 
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.reload();
    });
});

// Connexion
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', () => {
    const loginInput = document.getElementById('loginInput').value;
    const passwordInput = document.getElementById('passwordInput').value;
    
    fetch('/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            login: loginInput,  
            password: passwordInput
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);    
        console.log(data.user.id)
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userLogin', data.user.login); // Sauvegarder le login aussi
        
        // Afficher les infos de l'utilisateur connecté
        afficherUtilisateurConnecte();
    });
});

// Afficher les informations de l'utilisateur connecté
function afficherUtilisateurConnecte() {
    const userId = localStorage.getItem('userId');
    const connectedUserSpan = document.getElementById('connectedUser');
    
    if (!userId) {
        connectedUserSpan.textContent = 'Aucun';
        return;
    }
    
    fetch('/connecte/' + userId)
    .then(response => response.json())
    .then(user => {

    // AFFICHER dans le HTML
    connectedUserSpan.textContent = user.login;
    })

}




// Charger la liste des utilisateurs pour le vote
window.onload = () => {
    // Afficher l'utilisateur connecté si présent
    afficherUtilisateurConnecte();
    
    fetch('/user')
    .then(response => response.json())
    .then(user => {
        const userList = document.getElementById('userList');
        user.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.text = user.login;
            userList.appendChild(option);
        });
    });
    
    afficherStatistiques();
}

// Sélectionner un utilisateur

userSelectBouton.addEventListener('click', () => {
    const userList = document.getElementById('userList'); 
    const selectedUserId = userList.value;
    
    if (!selectedUserId) {
        alert('Veuillez sélectionner un utilisateur');
    } else {
        const selectedOption = userList.options[userList.selectedIndex];
        alert('Utilisateur sélectionné : ' + selectedOption.text + ' (ID: ' + selectedUserId + ')');
    }
});


// Voter pour l'utilisateur sélectionné

voteBouton.addEventListener('click', () => {
    const userList = document.getElementById('userList');
    const selectedUserId = userList.value;

    if (!selectedUserId) {
        alert('Veuillez sélectionner un utilisateur');
        return;
    }
// Récupérer le nom de l'utilisateur sélectionné
    const selectedOption = userList.options[userList.selectedIndex];
    const userName = selectedOption.text;

    const idElecteur = localStorage.getItem('userId');
// Vérifier si l'électeur est connecté
    if (!idElecteur) {
        alert('Vous devez vous connecter avant de voter');
        return;
    }
// Envoyer le vote au serveur
    fetch('/vote', {    
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            idUser: selectedUserId,
            idElecteur: idElecteur
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        afficherStatistiques();
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'enregistrement du vote');
    });
});


function deconnecter() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userLogin');
    document.getElementById('connectedUser').textContent = 'Aucun';
    alert('Vous êtes déconnecté');
    window.location.reload(); 
}
