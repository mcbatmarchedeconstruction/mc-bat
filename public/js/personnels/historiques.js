const tbody = document.querySelector('tbody')

const afficherHistorique = async () => {

    const response = await fetch('/api/historiques', {})

    const result = await response.json()

    if (response.ok) {
        result.historique.forEach( async historiques => {
          const tr = document.createElement('tr')
          const date = historiques.created_at.split('T')[0]

          const personnel = await fetch(`/api/personnels/${historiques.personnel_id}`, {})

          const resultPersonnel = await personnel.json()

          tr.innerHTML = `
            <td>${historiques.action}</td>
            <td class="limit-description"><p>${historiques.titre_element}</p></td>
            <td>${personnel.ok?resultPersonnel.personnel.nom_complet : 'Null'}</td>
            <td>${date}</td>
          `

          tbody.appendChild(tr)
        });
    }else {
        console.log(result.error);
        
    }
    
}
if(tbody) {
    afficherHistorique()
}