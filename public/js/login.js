const form = document.querySelector('.form')
const messages = document.querySelector('.form .span')
const loader = document.querySelector('.loader');

// popup
const popup = document.querySelector('#popup')
const popupIcon = document.querySelector('#popup-icon')
const popupTitle = document.querySelector('#popup-title')
const popupMessage = document.querySelector('#popup-message')
const popupBtn = document.querySelector('#popup-btn')
const popupClose = document.querySelector('#popup-close')

const connexion = async (event) => {
    event.preventDefault()

    loader.style.display = 'block';
    messages.textContent = 'Connexion en cours...';

    const formData = new FormData(form)

    

    const response = await fetch('/api/connexion', {
        method: 'POST',
        body: formData
    })

    const result = await response.json()


        loader.style.display = 'none';
    

    if (response.ok) {
        messages.style.color = 'green'
        messages.innerHTML = result.message

        afficherPopup(
            'success',
            'Connexion réussie !',
            result.message,
            'checkmark-circle-outline'
        )
        

        setTimeout(() => {
            
            window.location.replace('/personnels/dashboard')
        }, 1500)
    }else {
        messages.style.color = 'red'
        messages.innerHTML = result.error

        afficherPopup(
            'warning',
            'Erreur !',
            result.error,
            'alert-circle-outline'
        )
    }
    
}

if (form) {
    form.addEventListener('submit', connexion)
}

const afficherPopup = (
    type,
    titre,
    message,
    icon = 'checkmark-circle-outline'
) => {

    popup.className = 'popup'
    popup.classList.add(type)
    popup.classList.add('show')

    popupIcon.innerHTML = `
        <ion-icon name="${icon}"></ion-icon>
    `

    popupTitle.innerHTML = titre
    popupMessage.innerHTML = message
}


const fermerPopup = () => {
    popup.classList.remove('show')
}


popupBtn.addEventListener('click', fermerPopup)
popupClose.addEventListener('click', fermerPopup)

popup.addEventListener('click', (event) => {
    if (event.target === popup) {
        fermerPopup()
    }
})
