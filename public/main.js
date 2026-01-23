const monInput = document.getElementById('monInput');
const monInput2 = document.getElementById('monInput2');
const monBouton = document.getElementById('monBouton');
const monBouton2 = document.getElementById('monBouton2');
const compteur = document.getElementById('compteur');
const userSelectBouton = document.getElementById('userSelectBouton'); 
const voteBouton = document.getElementById('voteBouton');

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

monBouton.addEventListener('click', () => {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            inputValue: monInput.value, 
            inputValue2: monInput2.value 
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.reload();
    });
});

monBouton2.addEventListener('click', () => {
    if (compteur.textContent === '0') {
        compteur.textContent = '1';
    } else {
        compteur.textContent = '0';
    }
    
    fetch('/info', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.cle1);
    });
});

window.onload = () => {
    
    fetch('/users')
    .then(response => response.json())
    .then(users => {
        const usersList = document.getElementById('userLists');
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.text = user.login;
            usersList.appendChild(option);
        });
    });
    
    afficherStatistiques();
}

userSelectBouton.addEventListener('click', () => {
    const usersList = document.getElementById('userLists'); 
    const selectedUserId = usersList.value;
    
    if (!selectedUserId) {
        alert('Veuillez sélectionner un utilisateur');
    } else {
        const selectedOption = usersList.options[usersList.selectedIndex];
        alert('Utilisateur sélectionné : ' + selectedOption.text + ' (ID: ' + selectedUserId + ')');
    }
});

voteBouton.addEventListener('click', () => {
    const usersList = document.getElementById('userLists');
    const selectedUserId = usersList.value;
    
    if (!selectedUserId) {
        alert('Veuillez sélectionner un utilisateur');
        return;
    }

    const selectedOption = usersList.options[usersList.selectedIndex];
    const userName = selectedOption.text;

    fetch('/vote', {    
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            idUser: selectedUserId 
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(`Vote enregistré pour ${userName} !`);
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'enregistrement du vote');
    });
});