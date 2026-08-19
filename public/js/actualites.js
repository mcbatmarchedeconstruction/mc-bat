const container = document.querySelector('.image');

const afficherActualite = async () => {

    const response = await fetch('/api/actualitesStatutTrue', {})
    
    const result = await response.json()

    if (response.ok) {
        result.actualites.forEach(actualite => {
            const a = document.createElement('a')
            a.classList.add('realisation')
            a.href = `/visiteurs/actualites/lectures?id=${actualite.id}`
            a.dataset.secteur = actualite.secteur

            a.innerHTML = `
                <img src="${actualite.image}" alt="Photo du projet réalisé">
                <p>
                    ${actualite.contenu}
                </p>
            `

            container.appendChild(a)
        })
    }
}

if (container) {
    afficherActualite()
}
