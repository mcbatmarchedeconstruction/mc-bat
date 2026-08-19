const btnOpenForm = document.querySelector('#btn-add')
const form = document.querySelector('.form-add-edite')
const formulaire = document.querySelector('.form')
const btnForm = document.querySelectorAll('.btn-add-edtite button')
const messages = document.querySelector('.message1')
const titleForm = document.querySelectorAll('.titre h2')
const tbody = document.querySelector('tbody')
let idService = null

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

const createService = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[1]) {
        return
    }

    const formData = new FormData(formulaire)

    const responce = await fetch('/api/services', {
        method: 'POST',
        body: formData
    })

    const result = await responce.json()

    if (responce.ok) {
        messages.style.color = 'green'
        messages.innerHTML = result.message

        const tr = document.createElement('tr')

        const date = result.serviceCreated.created_at.split('T')[0]

        tr.innerHTML = `
            <tr>
                <td><img src="${result.serviceCreated.image}" alt="Photo offre"></td>
                <td>${result.serviceCreated.titre}</td>
                <td class="limit-description"><p>${result.serviceCreated.description}</p></td>
                <td><p class="${result.serviceCreated.statut === true ? 'notif' : 'unnotif'}">${result.serviceCreated.statut ? 'Actif' : 'Suspendu'}</p></td>
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
            idService = result.serviceCreated.id
        }
        const deleteService = async (event) => {
            event.preventDefault()
            messages.innerHTML = ''

            const deleteResponse = await fetch(`/api/services/${result.serviceCreated.id}`, {
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
                btn.addEventListener('click', deleteService)
            })
        }
        formulaire.reset()

    } else {
        messages.style.color = 'red'
        messages.innerHTML = result.error
    }

}
if (btnForm[1]) {
    form.addEventListener('submit', createService)
}

const editeService = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[0]) {
        return
    }
    const formData = new FormData(formulaire)

    const dataValue = await fetch(`/api/services/${idService}`, {})

    const dataValueResult = await dataValue.json()
    const date = dataValueResult.service.created_at.split('T')[0]

    const tr = document.createElement('tr')




    if (dataValue.ok) {

        const response = await fetch(`/api/services/${idService}`, {
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
                <td><img src="${result.serviceUpdated.image === '' ?
                    dataValueResult.service.image : result.serviceUpdated.image}" alt="Photo service"></td>
                <td>${result.serviceUpdated.titre === '' ? dataValueResult.service.titre : result.serviceUpdated.titre}</td>
                <td class="limit-description"><p>${result.serviceUpdated.description === '' ? dataValueResult.service.description : result.serviceUpdated.description}</p></td>
                <td><p class="${result.serviceUpdated.statut === true ? 'notif' : 'unnotif'}">${result.serviceUpdated.statut ? 'Actif' : 'Suspendu'}</p></td>
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
                idService = result.serviceUpdated.id
            }
            const deleteService = async (event) => {
                event.preventDefault()

                const deleteResponse = await fetch(`/api/services/${result.serviceUpdated.id}`, {
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
                    btn.addEventListener('click', deleteService)
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
    form.addEventListener('submit', editeService)
}



const afficherService = async () => {

    const response = await fetch('/api/services', {})

    const result = await response.json()

    if (response.ok) {
        result.service.forEach(services => {
            const tr = document.createElement('tr')

            const date = services.created_at.split('T')[0]

            tr.innerHTML = `
            <tr>
                <td><img src="${services.image}" alt="Photo offre"></td>
                <td>${services.titre}</td>
                <td class="limit-description"><p>${services.description}</p></td>
                <td><p class="${services.statut === true ? 'notif' : 'unnotif'}">${services.statut ? 'Actif' : 'Suspendu'}</p></td>
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
                idService = services.id
                document.querySelector('.message2').innerHTML = ''
                document.getElementById("form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                tbody.removeChild(tr)
            }
            const deleteService = async (event) => {
                event.preventDefault()
                messages.innerHTML = ''

                const deleteResponse = await fetch(`/api/services/${services.id}`, {
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
                    btn.addEventListener('click', deleteService)
                })
            }
        });
    } else {
        console.log(result.error);

    }

}

if (tbody) {
    afficherService()
}


if (btnOpenForm) {
    btnOpenForm.addEventListener('click', openForm)
}
