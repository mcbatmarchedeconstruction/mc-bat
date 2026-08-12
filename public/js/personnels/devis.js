const tbody = document.querySelector('tbody')
let idDevis = null


const afficherDevis = async () => {
    const response = await fetch('/api/devis', {})

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
            <td class="action">
                <div class="btn-action">
                    <ion-icon id="see" class="${devis.lu === true ? 'lu' : ''}" name="eye-outline"></ion-icon>
                    <ion-icon id="valideted" class="${devis.statut == false && devis.lu === false ? 'terminier' : '' }" name="${devis.statut == false && devis.lu === false? 'checkmark-done-outline' : 'checkmark-outline'}"></ion-icon>
                    <ion-icon class="delete" name="trash-outline"></ion-icon>
                </div>
            </td>
        
            `
            tbody.appendChild(tr)

            idDevis = devis.id

            const btnSee = tr.querySelectorAll('#see')
            const btnValideted = tr.querySelectorAll('#valideted')
            const btnDelete = tr.querySelectorAll('.delete')


            const afficherDetailDevis = async (event) => {
                event.preventDefault()

                const btn = event.currentTarget
                document.getElementById("lire").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                const responseSee = await fetch(`/api/devis/${devis.id}`, {})

                const resultSee = await responseSee.json()

                if (responseSee.ok) {
                    const nomComplet = document.querySelector('.lire div p strong');
                    const date = document.querySelector('.lire div .date');
                    const contenu = document.querySelector('.lire div .contenu');
                    document.querySelector('.lire').classList.add('active')

                    nomComplet.innerHTML = resultSee.devis.nom_complet
                    date.innerHTML = resultSee.devis.created_at.split('T')[0]
                    contenu.innerHTML = resultSee.devis.details_projet
                    document.querySelector('.message2').innerHTML = ''

                    if (devis.statut === false && devis.lu === false) {
                        return

                    }


                    const data = {
                        statut: true,
                        lu: true
                    }
                    const responseSeeBtn = await fetch(`/api/devis/${devis.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })

                    const resultSeeBtn = await responseSeeBtn.json()

                    if (responseSeeBtn.ok) {
                        btn.classList.add('lu')
                        tr.querySelector('td p').classList.remove('notif')
                        tr.querySelector('td p').classList.remove('unnotif')
                        tr.querySelector('td p').classList.add('waiting')
                        tr.querySelector('td p').innerHTML = 'En traitement...'
                    } else {
                        console.log(resultSeeBtn.error);

                    }


                } else {
                    console.log(resultSee.error);

                }

            }
            const devisRepondu = async (event) => {
                event.preventDefault()

                const btn = event.currentTarget

                if (devis.lu !== true) {
                    return

                }

                const data = {
                    statut: false,
                    lu: false
                }
                const responseValideted = await fetch(`/api/devis/${devis.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })

                const resultValideted = await responseValideted.json()

                if (responseValideted.ok) {
                    tr.querySelector('td p').classList.remove('waiting')
                    tr.querySelector('td p').classList.remove('unnotif')
                    tr.querySelector('td p').classList.add('notif')
                    tr.querySelector('td p').innerHTML = 'Terminer'
                    btn.classList.add('terminier')
                    btn.name = 'checkmark-done-outline'
                    document.querySelector('.message2').innerHTML = ""

                } else {
                    console.log(resultValideted.error)
                }



            }
            const deleteDevis = async (event) => {
                event.preventDefault()

                const responseDelete = await fetch(`/api/devis/${devis.id}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'}
                })
                const resultDelete = await responseDelete.json()

                if (responseDelete.ok) {
                    document.querySelector('.message2').style.color = 'green'
                    document.querySelector('.message2').innerHTML = resultDelete.message
                    tbody.removeChild(tr)
                }else {
                    document.querySelector('.message2').style.color = 'red'
                    document.querySelector('.message2').innerHTML = resultDelete.error
                }
                
                
                
            }

            if (btnSee) {
                btnSee.forEach(btn => {
                    btn.addEventListener('click', afficherDetailDevis)
                })
            }
            if (btnValideted) {
                btnValideted.forEach(btn => {
                    btn.addEventListener('click', devisRepondu)
                })
            }
            if (btnDelete) {
                btnDelete.forEach(btn => {
                    btn.addEventListener('click', deleteDevis)
                })
            }

        });

    } else {
        console.log(result.error);

    }

}
if (tbody) {
    afficherDevis()
}