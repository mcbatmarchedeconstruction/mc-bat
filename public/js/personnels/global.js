// Menu
const btnOpenMenu = document.querySelector('.open_menu ion-icon')
const btnCloseMenu = document.querySelector('.close-menu ion-icon')
const menuContainer = document.querySelector('.menu-conatiner')

const normaliserFiltre = (valeur) => (valeur || '')
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const appliquerFiltresAdministration = () => {
    const filtre = document.querySelector('.filtre')
    const tableau = document.querySelector('.tableau tbody')
    if (!filtre || !tableau) return

    const chemin = window.location.pathname
    const valeur = normaliserFiltre(filtre.dataset.valeur || 'TOUT')
    const recherche = normaliserFiltre(filtre.querySelector('.recherche')?.value)

    tableau.querySelectorAll('tr').forEach(ligne => {
        const cellules = ligne.querySelectorAll('td')
        let correspond = valeur === 'tout'

        if (chemin.endsWith('/actualites') || chemin.endsWith('/realisations')) {
            correspond ||= normaliserFiltre(cellules[1]?.textContent) === valeur
        } else if (chemin.endsWith('/devis')) {
            correspond ||= normaliserFiltre(cellules[3]?.textContent) === valeur
            correspond ||= normaliserFiltre(cellules[5]?.textContent) === valeur
        } else if (chemin.endsWith('/personnels')) {
            correspond ||= normaliserFiltre(cellules[2]?.textContent) === valeur
            correspond ||= normaliserFiltre(cellules[3]?.textContent) === valeur
        } else if (chemin.endsWith('/historiques')) {
            correspond ||= normaliserFiltre(cellules[0]?.textContent).startsWith(valeur)
        }

        const correspondRecherche = !recherche || normaliserFiltre(ligne.textContent).includes(recherche)
        ligne.style.display = correspond && correspondRecherche ? '' : 'none'
    })
}

document.addEventListener('click', (event) => {
    const bouton = event.target.closest('.filtre .btn')
    if (!bouton) return

    const filtre = bouton.closest('.filtre')
    filtre.dataset.valeur = bouton.textContent.trim()
    filtre.querySelectorAll('.btn').forEach(btn => btn.classList.toggle('active', btn === bouton))
    appliquerFiltresAdministration()
})

document.addEventListener('input', (event) => {
    if (event.target.matches('.filtre .recherche')) appliquerFiltresAdministration()
})

// Déconnexion
const btnDeconnexion = document.querySelector('.btn-deconnexion button')

// Enregistre une action d'administration sans interrompre l'opération principale
// si l'historique est temporairement indisponible.
window.enregistrerHistorique = async (action, titreElement) => {
    if (!action || !titreElement) return

    const data = new FormData()
    data.append('action', action)
    data.append('titre_element', titreElement)

    try {
        const historique = await fetch('/api/historiques', {
            method: 'POST',
            body: data
        })
        const historiqueResult = await historique.json()

        if (historique.ok) {
            console.log(historiqueResult.message)
        } else {
            console.log(historiqueResult.error)
        }
    } catch (error) {
        console.log(error.message)
    }
}

const libellesHistorique = {
    actualites: 'actualité',
    bannieres: 'bannière',
    devis: 'devis',
    marches: 'prix du marché',
    metiers: 'métier',
    offres: 'offre',
    personnels: 'personnel',
    qualifications: 'qualification',
    realisations: 'réalisation',
    services: 'service',
    utilisateurs: 'utilisateur'
}

const titreHistorique = (valeur) => {
    if (!valeur || typeof valeur !== 'object') return null

    for (const cle of ['titre', 'produit', 'niveau_qualification', 'citation', 'nom_complet', 'email']) {
        if (valeur[cle]) return valeur[cle]
    }

    for (const enfant of Object.values(valeur)) {
        const titre = titreHistorique(enfant)
        if (titre) return titre
    }

    return null
}

const createPopupElements = () => {
    let popup = document.getElementById('popup')
    if (popup) return popup

    popup = document.createElement('div')
    popup.id = 'popup'
    popup.className = 'popup'
    popup.style.cssText = 'position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.35);z-index:9999;padding:1rem;'

    const popupContent = document.createElement('div')
    popupContent.className = 'popup-content'
    popupContent.style.cssText = 'width:min(420px,100%);max-width:420px;background:#ffffff;color:#111111;border-radius:1rem;box-shadow:0 24px 48px rgba(0,0,0,0.22);padding:1.5rem;display:flex;flex-direction:column;gap:1rem;position:relative;'

    const popupClose = document.createElement('button')
    popupClose.type = 'button'
    popupClose.id = 'popup-close'
    popupClose.className = 'popup-close'
    popupClose.textContent = '×'
    popupClose.style.cssText = 'position:absolute;top:0.75rem;right:0.75rem;border:none;background:transparent;color:#333;font-size:1.75rem;cursor:pointer;'

    const popupIcon = document.createElement('div')
    popupIcon.id = 'popup-icon'
    popupIcon.className = 'popup-icon'
    popupIcon.style.cssText = 'font-size:2.4rem;color:#198754;display:flex;justify-content:center;'
    popupIcon.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon>'

    const popupTitle = document.createElement('h2')
    popupTitle.id = 'popup-title'
    popupTitle.style.margin = '0'
    popupTitle.style.fontSize = '1.35rem'
    popupTitle.style.fontWeight = '700'

    const popupMessage = document.createElement('p')
    popupMessage.id = 'popup-message'
    popupMessage.style.margin = '0'
    popupMessage.style.lineHeight = '1.5'

    const popupBtn = document.createElement('button')
    popupBtn.id = 'popup-btn'
    popupBtn.className = 'popup-btn'
    popupBtn.type = 'button'
    popupBtn.textContent = 'OK'
    popupBtn.style.cssText = 'align-self:flex-end;padding:0.75rem 1.25rem;border:none;border-radius:999px;background:#198754;color:#ffffff;font-weight:700;cursor:pointer;'

    popupContent.appendChild(popupClose)
    popupContent.appendChild(popupIcon)
    popupContent.appendChild(popupTitle)
    popupContent.appendChild(popupMessage)
    popupContent.appendChild(popupBtn)
    popup.appendChild(popupContent)
    document.body.appendChild(popup)

    const fermer = () => {
        popup.style.display = 'none'
    }

    popupClose.addEventListener('click', fermer)
    popupBtn.addEventListener('click', fermer)
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            fermer()
        }
    })

    return popup
}

const afficherPopup = (type, titre, message, icon = 'checkmark-circle-outline') => {
    const popup = createPopupElements()
    const popupIcon = popup.querySelector('#popup-icon')
    const popupTitle = popup.querySelector('#popup-title')
    const popupMessage = popup.querySelector('#popup-message')
    const popupBtn = popup.querySelector('#popup-btn')

    popupIcon.innerHTML = `<ion-icon name="${icon}"></ion-icon>`
    popupTitle.textContent = titre
    popupMessage.textContent = message

    if (type === 'success') {
        popupBtn.style.background = '#198754'
        popup.querySelector('.popup-content').style.border = '1px solid #198754'
    } else {
        popupBtn.style.background = '#d9534f'
        popup.querySelector('.popup-content').style.border = '1px solid #d9534f'
    }

    popup.style.display = 'flex'
}

// Toutes les mutations effectuées depuis les pages « personnels » passent par
// ici : création, modification ou suppression d'un élément administré.
const fetchOriginal = window.fetch.bind(window)
window.fetch = async (url, options = {}) => {
    const chemin = new URL(url, window.location.origin).pathname
    const segments = chemin.split('/').filter(Boolean)
    const ressource = segments[1]
    const methode = (options.method || 'GET').toUpperCase()
    const libelle = libellesHistorique[ressource]
    let elementAvantSuppression = null

    if (methode === 'DELETE' && libelle) {
        try {
            const element = await fetchOriginal(url)
            if (element.ok) elementAvantSuppression = await element.json()
        } catch (error) {
            console.log(error.message)
        }
    }

    const response = await fetchOriginal(url, options)

    if (!libelle || !['POST', 'PATCH', 'PUT', 'DELETE'].includes(methode)) {
        return response
    }

    let resultat = null
    try {
        resultat = await response.clone().json()
    } catch {
        resultat = null
    }

    const titre = titreHistorique(resultat) || titreHistorique(elementAvantSuppression)
        || (options.body instanceof FormData && ['titre', 'produit', 'niveau_qualification', 'citation', 'nom_complet', 'email']
            .map(cle => options.body.get(cle))
            .find(Boolean))
        || `${libelle} #${segments[2] || ''}`.trim()

    const articleCreation = {
        actualité: "d'une",
        bannière: "d'une",
        offre: "d'une",
        qualification: "d'une",
        réalisation: "d'une",
        service: "d'un",
        devis: "d'un",
        métier: "d'un",
        personnel: "d'un",
        utilisateur: "d'un",
        'prix du marché': "d'un"
    }
    const preposition = ['actualité', 'offre'].includes(libelle) ? "d'" : 'de '
    const actions = {
        POST: `Création ${articleCreation[libelle]} ${libelle}`,
        PATCH: `Modification ${preposition}${libelle}`,
        PUT: `Modification ${preposition}${libelle}`,
        DELETE: `Suppression ${preposition}${libelle}`
    }

    const notificationMessage = response.ok
        ? resultat?.message || actions[methode] + ' ' + titre
        : resultat?.error || `Échec ${actions[methode].toLowerCase()}`

    afficherPopup(
        response.ok ? 'success' : 'warning',
        response.ok ? `${actions[methode]} réussi` : 'Erreur',
        notificationMessage,
        response.ok ? 'checkmark-circle-outline' : 'alert-circle-outline'
    )

    if (response.ok) {
        await window.enregistrerHistorique(actions[methode], titre)
    }

    return response
}

const deconnexter = async (event) => {
    event.preventDefault()

    const response = await fetch('/api/deconnexion', {
        method: 'POST',
        headers:{'Content-Type': 'application/json'}
    })

    const result = await response.json()

    if (response.ok) {
        console.log(result.message);

        window.location.replace('/page/login')
        
    }else {
        console.log(result.error);
        
    }
    
}

if (btnDeconnexion) {
    btnDeconnexion.addEventListener('click', deconnexter)
}
// Fin de la déconnexion

if (btnOpenMenu) {
    btnOpenMenu.addEventListener('click', (event) => {
        event.preventDefault()

        menuContainer.classList.remove('unactive')
        if(menuContainer.classList.add('active'))
            event.currentTarget.style.display = 'none'
        
    })
}

if (btnCloseMenu) {
    btnCloseMenu.addEventListener('click', (event) => {
        event.preventDefault()


        menuContainer.classList.remove('active')
        
    })
}


// Afficher les devis récents
const tbody = document.querySelector('.tbody')

const afficherDevis = async () => {

    const response = await fetch('/api/devisLimit', {})

    const result = await response.json()

    if (response.ok) {
        result.devis.forEach(devis => {
            const tr = document.createElement('tr')
            const date = devis.created_at.split('T')[0]

            tr.innerHTML = `
                <td>${devis.nom_complet}</td>
                <td>${devis.email}</td>
                <td>${devis.telephone}</td>
                <td>${devis.secteur}</td>
                <td>${devis.budget}$</td>
                <td><p class="${devis.lu === true ? 'waiting' : devis.statut == true ? 'unnotif' : 'notif'}">${devis.lu === true ? 'En traitement...' : devis.statut == true ? 'Nouveau' : 'Terminer'}</p></td>
                <td>${date}</td>
            `

            tbody.appendChild(tr)
        })
    }else {
        console.log(result.error);
        
    }
}

if (tbody) {
    afficherDevis()
}

// Année en cours
const date = document.querySelector(".date")
const dateNow = new Date().getFullYear()
if (date) {
    date.innerHTML = dateNow
}

// Formulaire en étapes
const selectPays = document.getElementById("pays");
const selectPaysResi = document.getElementById("pays-resi");
const steps = document.querySelectorAll(".step")
const next = document.querySelectorAll("#btn-next")
const prev = document.querySelectorAll("#btn-prev")
let currentStep = 0;

const showStep = (index) => {

    if (!steps[index]) return;
    steps.forEach(step => step.classList.remove('active'));
    steps[index].classList.add('active')
}

if (next) {
    next.forEach(nexts => {
        nexts.addEventListener('click', (event) => {
            event.preventDefault()

            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep)
            }
        })
    })
}
if (prev) {
    prev.forEach(prevs => {
        prevs.addEventListener('click', (event) => {
            event.preventDefault()
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        })
    })
}
if (steps.length > 0) {
    showStep(currentStep);
}
 


async function chargerPays() {
        try {
            const response = await fetch("/js/data/countries.json");
            const countries = await response.json();

            countries.sort((a, b) => a.name.localeCompare(b.name));

            countries.forEach(country => {
                const option = document.createElement("option");
                option.value = country.code;      // Ex. CA
                option.textContent = country.name; // Ex. Canada
                selectPays.appendChild(option);
            });
            countries.forEach(country => {
                const option = document.createElement("option");
                option.value = country.code;      // Ex. CA
                option.textContent = country.name; // Ex. Canada
                selectPaysResi.appendChild(option)
            });
        } catch (error) {
            console.error("Erreur lors du chargement des pays :", error);
        }
    }


if (selectPays || selectPaysResi) {
        chargerPays();
    }
