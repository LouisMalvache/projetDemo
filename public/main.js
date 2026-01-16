const monInput = document.getElementById('monInput');
const monInput2 = document.getElementById('monInput2');
const monBouton = document.getElementById('monBouton');
const monBouton2 = document.getElementById('monBouton2');
const compteur = document.getElementById('compteur');

monBouton.addEventListener('click', () => {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputValue: monInput.value, inputValue2: monInput2.value })
    }).then(response => response.json())
    .then(data => {
        alert(data); 
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