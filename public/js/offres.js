const lecture = document.querySelector(".lecture");

const afficherOffre = async () => {
    const response = await fetch('/api/offresMois', {})
    
    const result = await response.json()

    if (response.ok && result.offre) {

        let date = null

        if(result.offre.created_at) {
             date = result.offre.created_at.split('T')[0]
        }
        lecture.innerHTML = `
            <img class="image-lecture" src="/assets/${result.offre.image}" alt="Photo de profil" >
            

            <div class="detail-lecture">
                <div class="date-secteur">
                    <p>${date}</p>
                </div>
                <h2>${result.offre.titre}</h2>

                <p>${result.offre.description}</p>
                </p>

                <div class="retour">
                    <a href="/visiteurs/actualites/liste">RETOUR AUX ACTUALITÉS</a>
                </div>
            </div>
        `
    } else {
        lecture.innerHTML = `<p style="color:red;">${result.error}</p>`
    }
}
if (lecture) {
    afficherOffre()
}
