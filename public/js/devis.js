const form = document.querySelector('.form')

// popup
const popup = document.querySelector('#popup')
const popupIcon = document.querySelector('#popup-icon')
const popupTitle = document.querySelector('#popup-title')
const popupMessage = document.querySelector('#popup-message')
const popupBtn = document.querySelector('#popup-btn')
const popupClose = document.querySelector('#popup-close')

const demandeDevis = async (event) => {
    event.preventDefault()
    
    const formData = new FormData(form)

    const response = await fetch('/api/devis', {
        method: 'POST',
        body: formData
    })

    const result = await response.json()

    if (response.ok) {
        messages.style.color = 'green'
        messages.innerHTML = result.message

         afficherPopup(
            'success',
            'Demande de devis envoyée !',
            result.message,
            'checkmark-circle-outline'
        )
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
    form.addEventListener('submit', demandeDevis)
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

