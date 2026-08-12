const btnOpenForm = document.querySelector('#btn-add')
const form = document.querySelector('.form-add-edite')
const formulaire = document.querySelector('.form')
const btnForm = document.querySelectorAll('.btn-add-edtite button')
const messages = document.querySelector('.message1')
const titleForm = document.querySelectorAll('.titre h2')
const tbody = document.querySelector('tbody')
let idRealisation = null

const scrollToForm = () => {
    const target = form || document.getElementById('form')
    if (target?.scrollIntoView) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }
}

const openForm = (event) => {
    event.preventDefault()

    form.style.display = 'flex'
    btnForm[1].style.display = 'flex'
    titleForm[0].style.display = 'flex'
    btnForm[0].style.display = 'none'
    titleForm[1].style.display = 'none'
    messages.innerHTML = ''
    document.querySelector('.message2').innerHTML = ''

}

const createRealisation = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[1]) {
        return
    }

    const formData = new FormData(formulaire)

    const responce = await fetch('/api/realisations', {
        method: 'POST',
        body: formData
    })

    const result = await responce.json()

    if (responce.ok) {
        messages.style.color = 'green'
        messages.innerHTML = result.message

        const tr = document.createElement('tr')

        const date = result.realisationCreated.created_at.split('T')[0]

        tr.innerHTML = `
            <tr>

                <td><img src="/assets/${result.realisationCreated.image}" alt="Photo realisation"></td>
                <td>${result.realisationCreated.secteur}</td>
                <td>${result.realisationCreated.titre}</td>
                <td class="limit-description"><p>${result.realisationCreated.description}</p></td>
                <td><p class="${result.realisationCreated.statut === true ? 'notif' : 'unnotif'}">${result.realisationCreated.statut ? 'Actif' : 'Suspendu'}</p></td>
                <td>${date}</td>
                <td class="action">
                    <div class="btn-action">
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            </tr>
        
        `
        tbody.prepend(tr)

        const btnOpenEdite = tr.querySelectorAll('.edite')
        const btnDelete = tr.querySelectorAll('.delete')


        const openEdtite = (event) => {
            event.preventDefault()

            form.style.display = 'flex'
            btnForm[0].style.display = 'flex'
            titleForm[1].style.display = 'flex'
            btnForm[1].style.display = 'none'
            titleForm[0].style.display = 'none'
            messages.innerHTML = ''
            tbody.removeChild(tr)
            document.querySelector('.message2').innerHTML = ''
            scrollToForm()
            idRealisation = result.realisationCreated.id
        }
        const deleteOffre = async (event) => {
            event.preventDefault()
            messages.innerHTML = ''

            const deleteResponse = await fetch(`/api/realisations/${result.realisationCreated.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            const deleteResult = await deleteResponse.json()

            if (deleteResponse.ok) {
                tbody.removeChild(tr)
                document.querySelector('.message2').style.color = 'green'
                document.querySelector('.message2').innerHTML = deleteResult.message
            } else {
                document.querySelector('.message2').style.color = 'red'
                document.querySelector('.message2').innerHTML = deleteResult.error
            }
        }
        if (btnOpenEdite) {
            btnOpenEdite.forEach(btn => {
                btn.addEventListener('click', openEdtite)
            })
        }
        if (btnDelete) {
            btnDelete.forEach(btn => {
                btn.addEventListener('click', deleteOffre)
            })
        }
        formulaire.reset()

    } else {
        messages.style.color = 'red'
        messages.innerHTML = result.error
    }

}
if (btnForm[1]) {
    form.addEventListener('submit', createRealisation)
}

const editeRealisation = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[0]) {
        return
    }
    const formData = new FormData(formulaire)

    const dataValue = await fetch(`/api/realisations/${idRealisation}`, {})
    if (!dataValue.ok) {
        messages.style.color = 'red'
        messages.innerHTML = 'Impossible de charger la réalisation pour modification.'
        return
    }

    const dataValueResult = await dataValue.json().catch(() => null)
    if (!dataValueResult?.realisation) {
        messages.style.color = 'red'
        messages.innerHTML = 'Données de réalisation manquantes.'
        return
    }

    const date = dataValueResult.realisation.created_at.split('T')[0]

    const tr = document.createElement('tr')




    if (dataValue.ok) {

        const response = await fetch(`/api/realisations/${idRealisation}`, {
            method: 'PATCH',
            body: formData
        })

        let result = null
        try {
            result = await response.json()
        } catch {
            result = null
        }

        if (response.ok) {
            messages.style.color = 'green'
            messages.innerHTML = result?.message || 'Modification effectuée'
            btnForm[0].style.display = 'none'

            // realisationUpdated


            tr.innerHTML = `
            <tr>
                <td><img src="/assets/${result.realisationUpdated.image === '' ?
                    dataValueResult.realisation.image : result.realisationUpdated.image}" alt="Photo offre"></td>
                <td>${result.realisationUpdated.secteur === '' ? dataValueResult.realisation.secteur : result.realisationUpdated.secteur}</td>
                <td>${result.realisationUpdated.titre === '' ? dataValueResult.realisation.titre : result.realisationUpdated.titre}</td>
                <td class="limit-description"><p>${result.realisationUpdated.description === '' ? dataValueResult.realisation.description : result.realisationUpdated.description}</p></td>
                <td><p class="${result.realisationUpdated.statut === true ? 'notif' : 'unnotif'}">${result.realisationUpdated.statut ? 'Actif' : 'Suspendu'}</p></td>
                <td>${date}</td>
                <td class="action">
                    <div class="btn-action">
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>

                
            </tr>
        
        `
            tbody.prepend(tr)

            const btnOpenEdite = tr.querySelectorAll('.edite')
            const btnDelete = tr.querySelectorAll('.delete')


            const openEdtite = (event) => {
                event.preventDefault()

                form.style.display = 'flex'
                btnForm[0].style.display = 'flex'
                titleForm[1].style.display = 'flex'
                btnForm[1].style.display = 'none'
                titleForm[0].style.display = 'none'
                messages.innerHTML = ''
                tbody.removeChild(tr)
                scrollToForm()
                idRealisation = result.realisationUpdated.id
            }
            const deleteOffre = async (event) => {
                event.preventDefault()
                messages.innerHTML = ''

                const deleteResponse = await fetch(`/api/realisations/${result.realisationUpdated.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })

                const deleteResult = await deleteResponse.json()

                if (deleteResponse.ok) {
                    tbody.removeChild(tr)
                    document.querySelector('.message2').style.color = 'green'
                    document.querySelector('.message2').innerHTML = deleteResult.message
                } else {
                    document.querySelector('.message2').style.color = 'red'
                    document.querySelector('.message2').innerHTML = deleteResult.error
                }
            }
            if (btnOpenEdite) {
                btnOpenEdite.forEach(btn => {
                    btn.addEventListener('click', openEdtite)
                })
            }
            if (btnDelete) {
                btnDelete.forEach(btn => {
                    btn.addEventListener('click', deleteOffre)
                })
            }

            formulaire.reset()


        } else {
            messages.style.color = 'red'
            messages.innerHTML = result?.error || 'Erreur lors de la modification'
        }

    } else {
        console.log(dataValueResult.error);

    }




}
if (btnForm[0]) {
    form.addEventListener('submit', editeRealisation)
}



const afficherRealisation = async () => {

    const response = await fetch('/api/realisations', {})

    const result = await response.json()

    if (response.ok) {
        result.realisation.forEach(realisations => {
            const tr = document.createElement('tr')

            const date = realisations.created_at.split('T')[0]

            tr.innerHTML = `
            <tr>
                <td><img src="/assets/${realisations.image}" alt="Photo offre"></td>
                <td>${realisations.secteur}</td>
                <td>${realisations.titre}</td>
                <td class="limit-description"><p>${realisations.description}</p></td>
                <td><p class="${realisations.statut === true ? 'notif' : 'unnotif'}">${realisations.statut ? 'Actif' : 'Suspendu'}</p></td>
                <td>${date}</td>
                <td class="action">
                    <div class="btn-action">

                        <ion-icon class="edite" name="create-outline"></ion-icon>

                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            </tr>
        
            `
            tbody.appendChild(tr)

            const btnOpenEdite = tr.querySelectorAll('.edite')
            const btnDelete = tr.querySelectorAll('.delete')

            const openEdtite = (event) => {
                event.preventDefault()

                form.style.display = 'flex'
                btnForm[0].style.display = 'flex'
                titleForm[1].style.display = 'flex'
                btnForm[1].style.display = 'none'
                titleForm[0].style.display = 'none'
                messages.innerHTML = ''
                idRealisation = realisations.id
                document.querySelector('.message2').innerHTML = ''
                scrollToForm()

                tbody.removeChild(tr)
            }
            const deleteOffre = async (event) => {
                event.preventDefault()
                messages.innerHTML = ''

                const deleteResponse = await fetch(`/api/realisations/${realisations.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })

                const deleteResult = await deleteResponse.json()

                if (deleteResponse.ok) {
                    tbody.removeChild(tr)
                    document.querySelector('.message2').style.color = 'green'
                    document.querySelector('.message2').innerHTML = deleteResult.message
                } else {
                    document.querySelector('.message2').style.color = 'red'
                    document.querySelector('.message2').innerHTML = deleteResult.error
                }
            }
            if (btnOpenEdite) {
                btnOpenEdite.forEach(btn => {
                    btn.addEventListener('click', openEdtite)
                })
            }
            if (btnDelete) {
                btnDelete.forEach(btn => {
                    btn.addEventListener('click', deleteOffre)
                })
            }
        });
    } else {
        console.log(result.error);

    }

}

if (tbody) {
    afficherRealisation()
}


if (btnOpenForm) {
    btnOpenForm.addEventListener('click', openForm)
}

