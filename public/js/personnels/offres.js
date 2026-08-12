const btnOpenForm = document.querySelector('#btn-add')
const form = document.querySelector('.form-add-edite')
const formulaire = document.querySelector('.form')
const btnForm = document.querySelectorAll('.btn-add-edtite button')
const messages = document.querySelector('.messgage1')
const titleForm = document.querySelectorAll('.titre h2')
const tbody = document.querySelector('tbody')
let idOffre = null

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

const createOffre = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[1]) {
        return
    }

    const formData = new FormData(formulaire)

    const responce = await fetch('/api/offres', {
        method: 'POST',
        body: formData
    })

    const result = await responce.json()

    if (responce.ok) {
        messages.style.color = 'green'
        messages.innerHTML = result.message

        const tr = document.createElement('tr')

        const date = result.offreCreated.created_at.split('T')[0]

        tr.innerHTML = `
            <tr>
                <td><img src="/assets/${result.offreCreated.image}" alt="Photo offre"></td>
                <td>- ${result.offreCreated.remise}%</td>
                <td>${result.offreCreated.prix}$</td>
                <td class="limit-description"><p>${result.offreCreated.description}</p></td>
                <td><p class="${result.offreCreated.statut === true ? 'notif' : 'unnotif'}">${result.offreCreated.statut ? 'Actif' : 'Suspendu'}</p></td>
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
            idOffre = result.offreCreated.id
        }
        const deleteOffre = async (event) => {
            event.preventDefault()
            messages.innerHTML = ''

            const deleteResponse = await fetch(`/api/offres/${result.offreCreated.id}`, {
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
    form.addEventListener('submit', createOffre)
}

const editeOffre = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[0]) {
        return
    }
    const formData = new FormData(formulaire)

    const dataValue = await fetch(`/api/offres/${idOffre}`, {})

    const dataValueResult = await dataValue.json()
    const date = dataValueResult.offre.created_at.split('T')[0]

    const tr = document.createElement('tr')




    if (dataValue.ok) {

        const response = await fetch(`/api/offres/${idOffre}`, {
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
                <td><img src="/assets/${result.offreUpdated.image === '' ?
                    dataValueResult.offre.image : result.offreUpdated.image}" alt="Photo offre"></td>
                <td>- ${result.offreUpdated.remise === '' ? dataValueResult.offre.remise : result.offreUpdated.remise}%</td>
                <td>${result.offreUpdated.prix === '' ? dataValueResult.offre.prix : result.offreUpdated.prix}$</td>
                <td class="limit-description"><p>${result.offreUpdated.description === '' ? dataValueResult.offre.description : result.offreUpdated.description}</p></td>
                <td><p class="${result.offreUpdated.statut === true ? 'notif' : 'unnotif'}">${result.offreUpdated.statut ? 'Actif' : 'Suspendu'}</p></td>
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
                idOffre = result.offreUpdated.id
            }
            const deleteOffre = async (event) => {
                event.preventDefault()
                messages.innerHTML = ''
                const deleteResponse = await fetch(`/api/offres/${result.offreUpdated.id}`, {
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
    form.addEventListener('submit', editeOffre)
}



const afficherOffres = async () => {

    const response = await fetch('/api/offres', {})

    const result = await response.json()

    if (response.ok) {
        result.offre.forEach(offres => {
            const tr = document.createElement('tr')

            const date = offres.created_at.split('T')[0]

            tr.innerHTML = `
            <tr>
                <td><img src="/assets/${offres.image}" alt="Photo offre"></td>
                <td>- ${offres.remise}%</td>
                <td>${offres.prix}$</td>
                <td class="limit-description"><p>${offres.description}</p></td>
                <td><p class="${offres.statut === true ? 'notif' : 'unnotif'}">${offres.statut ? 'Actif' : 'Suspendu'}</p></td>
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
                idOffre = offres.id
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

                const deleteResponse = await fetch(`/api/offres/${offres.id}`, {
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
    afficherOffres()
}


if (btnOpenForm) {
    btnOpenForm.addEventListener('click', openForm)
}

