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
        body: JSON.stringify({ inputValue: monInput.value, inputValue2: monInput2.value })
    }).then(response => response.json())
    .then(data => {
        alert(data.message); 
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
    }).then(response => response.json())
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
            //création d'un input select option avec id en value et login en texte  
            const option = document.createElement('option');
            option.value = user.id;
            option.text = user.login;
            usersList.appendChild(option);  
            
        });
    });
}


userSelectedBouton.addEventListener('click', () => {
    const usersList = document.getElementById('userList');
    const selectedUserId = usersList.value;     
    alert('Utilisateur sélectionné ID : ' + selectedUserId);
});

voteBouton.addEventListener('click', () => {
    alert('Vote enregistré !');
});