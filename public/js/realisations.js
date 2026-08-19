const realisations = document.querySelector('.image')

const afficherRealisations = async () => {
    const response = await fetch('/api/realisationsStatutTrue', {})

    const result = await response.json()

    if (response.ok) {
        result.realisations.forEach(realisation => {
            const a = document.createElement('a')
            a.classList.add('realisation')
            a.href = `/visiteurs/realisations/lectures?id=${realisation.id}`
            a.dataset.secteur = realisation.secteur

            a.innerHTML = `
                <img src="${realisation.image}" alt="Photo du projet réalisé">
                <p>
                ${realisation.description}
                </p>
            `

            realisations.appendChild(a)
        })
    } else {
        console.log(result.error);
        
    }
}

if (realisations) {
    afficherRealisations()
}
