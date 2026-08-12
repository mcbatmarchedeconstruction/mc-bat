// Menu 
const btnOpenMenu = document.querySelector('.open_menu ion-icon')
const btnClosenMenu = document.querySelector('.close-menu ion-icon')
let menuContainer = document.querySelector('.menu-conatiner')

// Filtres des listes visiteurs (actualités et réalisations).
document.addEventListener('click', (event) => {
    const bouton = event.target.closest('.filtre .btn')
    if (!bouton) return

    const filtre = bouton.closest('.filtre')
    const valeur = bouton.textContent.trim().toLocaleLowerCase()

    filtre.querySelectorAll('.btn').forEach(btn => btn.classList.toggle('active', btn === bouton))
    document.querySelectorAll('.image .realisation').forEach(element => {
        const secteur = (element.dataset.secteur || '').toLocaleLowerCase()
        element.style.display = valeur === 'tout' || secteur === valeur ? '' : 'none'
    })
})

// Bannières
const image1 = document.querySelector('.image1')
const image2 = document.querySelector('.image2')
const image3 = document.querySelector('.image3')

if (image1 && image2 && image3) {

    image1.style.backgroundImage = "linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)), url('/assets/img5.jpeg')"
    image2.style.backgroundImage = "linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)), url('/assets/img2.jpeg')"
    image3.style.backgroundImage = "linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)), url('/assets/img1.jpeg')"
}

// Offres
const detailsOffre = document.querySelector('.details-offre p')

const afficherOffreDuMois = async () => {

    const response = await fetch('/api/offresMois', {})
    const result = await response.json()

    if (response.ok) {
        detailsOffre.innerHTML = !result.offre.description ? 'Aucune offre pour le moment' : result.offre.description
    } else {
        console.log(result.error);
    }
}

if (detailsOffre) {
    afficherOffreDuMois()
}

// Prix du marché
const contenuPrix = document.querySelector('.contenu-prix')

const afficherPrixMarche = async () => {   

    const response = await fetch('/api/marchesLimit', {})
    const result = await response.json()

    if (response.ok) {
        result.marche.forEach(marche => {
            const div = document.createElement('div')
            div.classList.add('prix')

            div.innerHTML = `
                <img src="/assets/${marche.image}" alt="Image produit">
                <div class="detail-prix">
                    <h3>${marche.produit}</h3>
                    <p>${marche.prix}$</p>
                    <span>Toutes ces informations ont été vérifiées avant d’être publiées.</span>
                </div>
            `
            contenuPrix.appendChild(div)
        })
    } else {
        console.log(result.error);
    }
 }
if (contenuPrix) {
    afficherPrixMarche()
}

// Actualités
const contenuActualite = document.querySelector('.contenu-actualite')

const afficherActualite = async () => {
    const response = await fetch('/api/actualitesLimit', {})
    const result = await response.json()

    if (response.ok) {
        result.actualites.forEach(actualites => {
            const div = document.createElement('div')
            div.classList.add('actualite')

            const date = actualites.created_at.split('T')[0]

            div.innerHTML = `
                <div class="image">
                    <img src="/assets/${actualites.image}" alt="Image actualité">
                    <p>${actualites.secteur}</p>
                </div>
                <div class="actualite-detail">
                    <p>${date}</p>
                    <h3>${actualites.titre}</h3>

                    <div class="lire-option">
                        <a href="/visiteurs/actualites/lectures?id=${actualites.id}">
                        <span>LIRE LA SUITE</span>
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                        </a>
                    </div>
                </div>
            `
            contenuActualite.appendChild(div)
        })
    } else {
        console.log(result.error);
    }
}

if (contenuActualite) {
    afficherActualite()
}

// Services
const contenuService = document.querySelector('#service')

const afficherService = async () => {
    const response = await fetch('/api/servicesStatutTrue', {})
    const result = await response.json()      

    if (response.ok) {
        result.services.forEach(service => {
            const p = document.createElement('p')

            p.innerHTML = service.titre
            contenuService.appendChild(p)
        })
    } else {
        console.log(result.error);
    }
}

if (contenuService) {
    afficherService()
}

// S'abonner gratuitement
const formAbonnement = document.querySelector('.form-abonne')
const messages = document.querySelector('.message')

// popup
const popup = document.querySelector('#popup')
const popupIcon = document.querySelector('#popup-icon')
const popupTitle = document.querySelector('#popup-title')
const popupMessage = document.querySelector('#popup-message')
const popupBtn = document.querySelector('#popup-btn')
const popupClose = document.querySelector('#popup-close')

const sAbonner = async (event) => {
    event.preventDefault()

    const formData = new FormData(formAbonnement)

    const response = await fetch('/api/utilisateurs', {
        method: 'POST',
        body: formData
    })

    const result = await response.json()

    if (response.ok) {
        messages.innerHTML = result.message
        messages.style.color = 'green'
        formAbonnement.reset()

        afficherPopup(
            'success',
            'Abonnement réussi !',
            result.message,
            'checkmark-circle-outline'
        )
    } else {
        messages.innerHTML = result.error
        messages.style.color = 'red'

         afficherPopup(
            'warning',
            'Erreur !',
            result.error,
            'alert-circle-outline'
        )
    }
}

if (formAbonnement) {
    formAbonnement.addEventListener('submit', sAbonner)
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



if (btnOpenMenu) {
    btnOpenMenu.addEventListener('click', (event) => {

        event.currentTarget.style.display = 'none'
        menuContainer.classList.add('active')
        
    })
}
if (btnClosenMenu) {
    btnClosenMenu.addEventListener('click', (event) => {

        menuContainer.classList.remove('active')
        btnOpenMenu.style.display = 'flex'
        
    })
}













const date = document.querySelector(".date")
const dateNow = new Date().getFullYear()
if (date) {
    date.innerHTML = dateNow
}

const uppercase = document.querySelector('.detail-background h1')
if (uppercase) {
    uppercase.innerHTML = uppercase.innerHTML.toUpperCase()
}
