const btnOpenForm = document.querySelector('#btn-add')
const form = document.querySelector('.form-add-edite')
const formulaire = document.querySelector('.form')
const btnForm = document.querySelectorAll('.btn-add-edtite button')
const titleForm = document.querySelectorAll('.titre h2')
const messages = document.querySelector('.message1')
const tbody = document.querySelector('tbody')
let idMetier = null

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
    document.querySelector('.message2').innerHTML = ''
    messages.innerHTML = ""

}

const createMetier = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[1]) {
        return
    }

    const formData = new FormData(formulaire)

    const response = await fetch('/api/metiers', {
        method: 'POST',
        body: formData
    })

    const result = await response.json()

    if (response.ok) {
        messages.style.color = 'green'
        messages.innerHTML = result.message

        const tr = document.createElement('tr')

        const date = result.metierCreated.created_at.split('T')[0]

        tr.innerHTML = `

                <td>${result.metierCreated.titre}</td>
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
                scrollToForm()
                idMetier = result.metierCreated.id
            }
            const deleteMetier = async (event) => {
                event.preventDefault()

                const responseDelete = await fetch(`/api/metiers/${result.metierCreated.id}`, {
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
    form.addEventListener('submit', createMetier)
}

const editeMetier = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[0]) {
        return
    }

    const formData = new FormData(formulaire)

    const response = await fetch(`/api/metiers/${idMetier}`, {
        method: 'PATCH',
        body: formData
    })

    const result = await response.json()

    if (response.ok) {
        btnForm[0].style.display = 'none'
         messages.style.color = 'green'
        messages.innerHTML = result.message
        const tr = document.createElement('tr')

        const date = result.metierUpdated.created_at.split('T')[0]

        tr.innerHTML = `

                <td>${result.metierUpdated.titre}</td>
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
                scrollToForm()
                idMetier = result.metierUpdated.id
            }
            const deleteMetier = async (event) => {
                event.preventDefault()

                const responseDelete = await fetch(`/api/metiers/${result.metierUpdated.id}`, {
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
if (btnForm[0]) {
    form.addEventListener('submit', editeMetier)
}

const afficherMetier = async () => {
    const response = await fetch('/api/metiers', {})

    const result = await response.json()

    if (response.ok) {
        result.metier.forEach(metiers => {
            const tr = document.createElement('tr')

            const date = metiers.created_at.split('T')[0]

            tr.innerHTML = `

                <td>${metiers.titre}</td>
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

                scrollToForm()
                idMetier = metiers.id
            }
            const deleteMetier = async (event) => {
                event.preventDefault()

                const responseDelete = await fetch(`/api/metiers/${metiers.id}`, {
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
    afficherMetier()
}




if (btnOpenForm) {
    btnOpenForm.addEventListener('click', openForm)
}

