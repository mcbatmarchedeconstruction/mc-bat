

// Menu 
const btnOpenMenu = document.querySelector('.open_menu ion-icon')
const btnClosenMenu = document.querySelector('.close-menu ion-icon')
let menuContainer = document.querySelector('.menu-conatiner')
const menuLinks = document.querySelectorAll('.menu-conatiner a');

// Affiche les nombres avec des séparateurs de milliers et, si nécessaire,
// deux décimales (ex. : 198.458.09).
window.formaterNombre = (valeur) => {
    if (valeur === null || valeur === undefined || valeur === '') return ''
    const nombre = Number(valeur)
    if (!Number.isFinite(nombre)) return valeur ?? ''

    const [entier, decimal = ''] = Math.abs(nombre).toFixed(2).split('.')
    const entierFormate = entier.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    const decimales = decimal === '00' ? '' : `.${decimal}`
    return `${nombre < 0 ? '-' : ''}${entierFormate}${decimales}`
}

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
const imageCarousel = document.querySelector('.container-banniere')

const  afficherBannieres = async () => {
    
    const response = await fetch ('/api/bannieres/', {})

    const result = await response.json()

    if (response.ok) {


        result.bannieres.map((banniere) => {
            const div = document.createElement('div')
            div.className = 'banniere'
            const p = document.createElement('p')

            p.innerHTML = banniere.citation

            div.appendChild(p)

            div.style.backgroundImage = `linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)), url(${banniere.image})`

            imageCarousel.appendChild(div)
        });
        
        
    }
}

if (imageCarousel) {

    afficherBannieres()

}

// Offres
const detailsOffre = document.querySelector('.details-offre p')

const afficherOffreDuMois = async () => {
    try {
        const response = await fetch('/api/offresMois');
        const result = await response.json();

        if (!response.ok) {
            console.error(result.error || result.message);
            detailsOffre.innerHTML = 'Une erreur est survenue';
            return;
        }

        if (!result.offre || !result.offre.description) {
            detailsOffre.innerHTML = 'Aucune offre pour le moment';
            return;
        }

        detailsOffre.innerHTML = result.offre.description;

    } catch (error) {
        console.error("Erreur lors de la récupération de l'offre :", error);
        detailsOffre.innerHTML = 'Impossible de récupérer l’offre';
    }
};

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
                <img src="${marche.image}" alt="Image produit">
                <div class="detail-prix">
                    <h3>${marche.produit}</h3>
                    <p>${window.formaterNombre(marche.prix)} $</p>
                    <span>Toutes ces informations ont été vérifiées avant d’être publiées.</span>
                </div>
            `
            contenuPrix.appendChild(div)
        })
    } else {
        return
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
                    <img src="${actualites.image}" alt="Image actualité">
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
        return
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
        return
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

// Fermer le menu lorsqu'on clique sur un lien
if (menuLinks.length > 0) {
    menuLinks.forEach(link => {

        link.addEventListener('click', () => {

            menuContainer.classList.remove('active');

            if (btnOpenMenu) {
                btnOpenMenu.style.display = 'flex';
            }

        });

    });
}

// animation scroll 
const elements = document.querySelectorAll(
    '.scroll-animation, .scroll-left, .scroll-right, .scroll-up'
);

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add('show');

            // On arrête d'observer une fois l'animation terminée
            observer.unobserve(entry.target);
        }

    });

}, {
    threshold: 0.15
});

elements.forEach(element => {
    observer.observe(element);
});













const date = document.querySelector(".date")
const dateNow = new Date().getFullYear()
if (date) {
    date.innerHTML = dateNow
}

const uppercase = document.querySelector('.detail-background h1')
if (uppercase) {
    uppercase.innerHTML = uppercase.innerHTML.toUpperCase()
}
