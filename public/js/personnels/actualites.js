const btnOpenForm = document.querySelector('#btn-add')
const form = document.querySelector('.form-add-edite')
const formulaire = document.querySelector('.form')
const btnForm = document.querySelectorAll('.btn-add-edtite button')
const messages = document.querySelector('.message1')
const titleForm = document.querySelectorAll('.titre h2')
const tbody = document.querySelector('tbody')
let idActualite = null

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

const createActualite = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[1]) {
        return
    }

    const formData = new FormData(formulaire)

    const responce = await fetch('/api/actualites', {
        method: 'POST',
        body: formData
    })

    const result = await responce.json()

    if (responce.ok) {
        messages.style.color = 'green'
        messages.innerHTML = result.message

        const tr = document.createElement('tr')

        const date = result.actualiteCreated.created_at.split('T')[0]

        tr.innerHTML = `
            <tr>
                <td><img src="/assets/${result.actualiteCreated.image}" alt="Photo actualité"></td>
                <td>${result.actualiteCreated.secteur}</td>
                <td>${result.actualiteCreated.titre}</td>
                <td class="limit-description"><p>${result.actualiteCreated.contenu}</p></td>
                <td><p class="${result.actualiteCreated.statut === true ? 'notif' : 'unnotif'}">${result.actualiteCreated.statut ? 'Actif' : 'Suspendu'}</p></td>
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
            document.getElementById("form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            idActualite = result.actualiteCreated.id
        }
        const deleteOffre = async (event) => {
            event.preventDefault()
            messages.innerHTML = ''

            const deleteResponse = await fetch(`/api/actualites/${result.actualiteCreated.id}`, {
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
    form.addEventListener('submit', createActualite)
}

const editeActualite = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[0]) {
        return
    }
    const formData = new FormData(formulaire)

    const dataValue = await fetch(`/api/actualites/${idActualite}`, {})

    const dataValueResult = await dataValue.json()
    const date = dataValueResult.actualite.created_at.split('T')[0]

    const tr = document.createElement('tr')




    if (dataValue.ok) {

        const response = await fetch(`/api/actualites/${idActualite}`, {
            method: 'PATCH',
            body: formData
        })

        const result = await response.json()

        if (response.ok) {
            messages.style.color = 'green'
            messages.innerHTML = result.message
            btnForm[0].style.display = 'none'

            // offreUpdated


            tr.innerHTML = `
            <tr>
                <td><img src="/assets/${result.actualiteUpdated.image === '' ?
                    dataValueResult.actualite.image : result.actualiteUpdated.image}" alt="Photo actualité"></td>
                <td>${result.actualiteUpdated.secteur === '' ? dataValueResult.actualite.secteur : result.actualiteUpdated.secteur}</td>
                <td>${result.actualiteUpdated.titre === '' ? dataValueResult.actualite.titre : result.actualiteUpdated.titre}</td>
                <td class="limit-description"><p>${result.actualiteUpdated.contenu === '' ? dataValueResult.actualite.contenu : result.actualiteUpdated.contenu}</p></td>
                <td><p class="${result.actualiteUpdated.statut === true ? 'notif' : 'unnotif'}">${result.actualiteUpdated.statut ? 'Actif' : 'Suspendu'}</p></td>
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
                document.getElementById("form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                idActualite = result.actualiteUpdated.id
            }
            const deleteOffre = async (event) => {
                event.preventDefault()
                messages.innerHTML = ''

                const deleteResponse = await fetch(`/api/actualites/${result.actualiteUpdated.id}`, {
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

    } else {
        console.log(dataValueResult.error);

    }




}
if (btnForm[0]) {
    form.addEventListener('submit', editeActualite)
}



const afficherActualite = async () => {

    const response = await fetch('/api/actualites', {})

    const result = await response.json()

    if (response.ok) {
        result.actualite.forEach(actualites => {
            const tr = document.createElement('tr')

            const date = actualites.created_at.split('T')[0]

            tr.innerHTML = `
            <tr>
                <td><img src="/assets/${actualites.image}" alt="Photo offre"></td>
                <td>${actualites.secteur}</td>
                <td>${actualites.titre}</td>
                <td class="limit-description"><p>${actualites.contenu}</p></td>
                <td><p class="${actualites.statut === true ? 'notif' : 'unnotif'}">${actualites.statut ? 'Actif' : 'Suspendu'}</p></td>
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
                idActualite = actualites.id
                document.querySelector('.message2').innerHTML = ''
                document.getElementById("form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                tbody.removeChild(tr)
            }
            const deleteOffre = async (event) => {
                event.preventDefault()
                messages.innerHTML = ''

                const deleteResponse = await fetch(`/api/actualites/${actualites.id}`, {
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
    afficherActualite()
}


if (btnOpenForm) {
    btnOpenForm.addEventListener('click', openForm)
}

