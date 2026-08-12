const btnOpenForm = document.querySelector('#btn-add')
const form = document.querySelector('.form-add-edite')
const formulaire = document.querySelector('.form')
const btnForm = document.querySelectorAll('.btn-add-edtite button')
const titleForm = document.querySelectorAll('.titre h2')
const tbody = document.querySelector('tbody')
const messages = document.querySelector('.message1')
let idMarche = null

const openForm = (event) => {
    event.preventDefault()

    form.style.display = 'flex'
    btnForm[1].style.display = 'flex'
    titleForm[0].style.display = 'flex'
    btnForm[0].style.display = 'none'
    titleForm[1].style.display = 'none'
    document.querySelector('.message2').innerHTML = ''
    messages.innerHTML = ""

}

const createMarche = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[1]) {
        return
    }

    const formData = new FormData(formulaire)

    const response = await fetch('/api/marches', {
        method: 'POST',
        body: formData
    })

    const result = await response.json()

    if (response.ok) {
        messages.style.color = 'green'
        messages.innerHTML = result.message

        const tr = document.createElement('tr')
        const date = result.marcheCreated.created_at.split('T')[0]

        tr.innerHTML = `
                <td><img src="/assets/${result.marcheCreated.image}" alt=""></td>
                <td>${result.marcheCreated.produit}</td>
                <td class="limit-description"><p>${result.marcheCreated.details_produit}</p></td>
                <td>${result.marcheCreated.prix}</td>
                <td><p class="${result.marcheCreated.statut ? 'nofif' : 'unnotif'}">${result.marcheCreated.statut ? 'Actif' : 'Suspendu'}</p></td>
                <td>${date}</td>
                <td class="action">
                    <div class="btn-action">
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            
            `
        tbody.prepend(tr)

        const btnOpenEdite = tr.querySelectorAll('.edite ')
        const btnDelete = tr.querySelectorAll('.delete')

        const openEdtite = (event) => {
            event.preventDefault()

            form.style.display = 'flex'
            btnForm[0].style.display = 'flex'
            titleForm[1].style.display = 'flex'
            btnForm[1].style.display = 'none'
            titleForm[0].style.display = 'none'
            tbody.removeChild(tr)
            document.querySelector('.message2').innerHTML = ''
            messages.innerHTML = ""

            document.getElementById("form").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
            idMarche = result.marcheCreated.id
        }
        const deleteMetier = async (event) => {
            event.preventDefault()

            const responseDelete = await fetch(`/api/marches/${result.marcheCreated.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            const resultDelete = await responseDelete.json()

            if (responseDelete.ok) {
                tbody.removeChild(tr)
                document.querySelector('.message2').style.color = 'green'
                document.querySelector('.message2').innerHTML = resultDelete.message
            } else {
                document.querySelector('.message2').style.color = 'red'
                document.querySelector('.message2').innerHTML = resultDelete.error
            }
        }

        if (btnOpenEdite) {
            btnOpenEdite.forEach(btn => {
                btn.addEventListener('click', openEdtite)
            })
        }
        if (btnDelete) {
            btnDelete.forEach(btn => {
                btn.addEventListener('click', deleteMetier)
            })
        }
        formulaire.reset()
    } else {
        messages.style.color = 'red'
        messages.innerHTML = result.error
    }

}
if (btnForm[1]) {
    form.addEventListener('submit', createMarche)
}

const editeMarche = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[0]) {
        return
    }

    const valueData = await fetch(`/api/marches/${idMarche}`, {})

    const resultValueData = await valueData.json()

    if (valueData.ok) {
        const formData = new FormData(formulaire)

        const response = await fetch(`/api/marches/${idMarche}`, {
            method: 'PATCH',
            body: formData
        })

        const result = await response.json()

        if (response.ok) {
            messages.style.color = 'green'
            messages.innerHTML = result.message

            const tr = document.createElement('tr')
            const date = resultValueData.marche.created_at.split('T')[0]

            tr.innerHTML = `
                <td><img src="/assets/${result.marcheUpdated.image === ''?resultValueData.marche.image : result.marcheUpdated.image}" alt=""></td>
                <td>${result.marcheUpdated.produit === ''?resultValueData.marche.produit : result.marcheUpdated.produit}</td>
                <td class="limit-description"><p>${result.marcheUpdated.details_produit === ''?resultValueData.marche.details_produit : result.marcheUpdated.details_produit}</p></td>
                <td>${result.marcheUpdated.prix === ''?resultValueData.marche.prix : result.marcheUpdated.prix }</td>
                <td><p class="${result.marcheUpdated.statut === true? 'notif' : 'unnotif'}">${result.marcheUpdated.statut === true? 'Actif' : 'Suspendu'}</p></td>
                <td>${date}</td>
                <td class="action">
                    <div class="btn-action">
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            
            `
            tbody.prepend(tr)

            const btnOpenEdite = tr.querySelectorAll('.edite ')
            const btnDelete = tr.querySelectorAll('.delete')

            const openEdtite = (event) => {
                event.preventDefault()

                form.style.display = 'flex'
                btnForm[0].style.display = 'flex'
                titleForm[1].style.display = 'flex'
                btnForm[1].style.display = 'none'
                titleForm[0].style.display = 'none'
                tbody.removeChild(tr)
                document.querySelector('.message2').innerHTML = ''
                messages.innerHTML = ""

                document.getElementById("form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                idMarche = result.marcheUpdated.id
            }
            const deleteMetier = async (event) => {
                event.preventDefault()

                const responseDelete = await fetch(`/api/marches/${result.marcheUpdated.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })

                const resultDelete = await responseDelete.json()

                if (responseDelete.ok) {
                    tbody.removeChild(tr)
                    document.querySelector('.message2').style.color = 'green'
                    document.querySelector('.message2').innerHTML = resultDelete.message
                } else {
                    document.querySelector('.message2').style.color = 'red'
                    document.querySelector('.message2').innerHTML = resultDelete.error
                }
            }

            if (btnOpenEdite) {
                btnOpenEdite.forEach(btn => {
                    btn.addEventListener('click', openEdtite)
                })
            }
            if (btnDelete) {
                btnDelete.forEach(btn => {
                    btn.addEventListener('click', deleteMetier)
                })
            }

            formulaire.reset()
        } else {
            messages.style.color = 'red'
            messages.innerHTML = result.error
        }
    } else {
        console.log(resultValueData.error);

    }



}
if (btnForm[0]) {
    form.addEventListener('submit', editeMarche)
}


const afficherMarche = async () => {
    const response = await fetch('/api/marches', {})

    const result = await response.json()

    if (response.ok) {
        result.marche.forEach(marches => {
            const tr = document.createElement('tr')

            const date = marches.created_at.split('T')[0]

            tr.innerHTML = `
                <td><img src="/assets/${marches.image}" alt=""></td>
                <td>${marches.produit}</td>
                <td class="limit-description"><p>${marches.details_produit}</p></td>
                <td>${marches.prix}</td>
                <td><p class="${marches.statut ? 'notif' : 'unnotif'}">${marches.statut ? 'Actif' : 'Suspendu'}</p></td>
                <td>${date}</td>
                <td class="action">
                    <div class="btn-action">
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            
            `
            tbody.appendChild(tr)

            const btnOpenEdite = tr.querySelectorAll('.edite ')
            const btnDelete = tr.querySelectorAll('.delete')

            const openEdtite = (event) => {
                event.preventDefault()

                form.style.display = 'flex'
                btnForm[0].style.display = 'flex'
                titleForm[1].style.display = 'flex'
                btnForm[1].style.display = 'none'
                titleForm[0].style.display = 'none'
                tbody.removeChild(tr)
                document.querySelector('.message2').innerHTML = ''
                messages.innerHTML = ""

                document.getElementById("form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                idMarche = marches.id
            }
            const deleteMetier = async (event) => {
                event.preventDefault()

                const responseDelete = await fetch(`/api/marches/${marches.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })

                const resultDelete = await responseDelete.json()

                if (responseDelete.ok) {
                    tbody.removeChild(tr)
                    document.querySelector('.message2').style.color = 'green'
                    document.querySelector('.message2').innerHTML = resultDelete.message
                } else {
                    document.querySelector('.message2').style.color = 'red'
                    document.querySelector('.message2').innerHTML = resultDelete.error
                }
            }

            if (btnOpenEdite) {
                btnOpenEdite.forEach(btn => {
                    btn.addEventListener('click', openEdtite)
                })
            }
            if (btnDelete) {
                btnDelete.forEach(btn => {
                    btn.addEventListener('click', deleteMetier)
                })
            }
        });
    } else {
        console.log(result.error);

    }

}
if (tbody) {
    afficherMarche()
}



if (btnOpenForm) {
    btnOpenForm.addEventListener('click', openForm)
}

