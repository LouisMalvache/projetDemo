const monInput = document.getElementById('monInput');
const monInput2 = document.getElementById('monInput2');
const monBouton = document.getElementById('monBouton');
const monBouton2 = document.getElementById('monBouton2');
const compteur = document.getElementById('compteur');
const userSelectBouton = document.getElementById('userSelectBouton'); 
const voteBouton = document.getElementById('voteBouton');

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
        // Recharger la liste des utilisateurs après inscription
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
    // Charger la liste des utilisateurs
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
    // Vérifier si un utilisateur est sélectionné au vote
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
});

fetch('/all-vote')
    .then(response => response.json())
    .then(votes => {
        const usersList = document.getElementById('userLists');
        votes.forEach(vote => {
            const option = document.createElement('option');
            option.value = vote.id;
            option.text = `${vote.login} - Votes: ${vote.voteCount}`;
            usersList.appendChild(option);
        });
    });