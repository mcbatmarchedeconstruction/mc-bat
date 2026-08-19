const btnOpenForm = document.querySelector('#btn-add')

const form = document.querySelector('.form-add-edite')
const btnForm = document.querySelectorAll('.btn-add-edtite button')
const titleForm = document.querySelectorAll('.titre h2')
const contenu = document.querySelector('textarea')
const image = document.querySelector('input')
const messages = document.querySelector('.message')
let idBanniere = null

const openForm = (event) => {
    event.preventDefault()

    messages.innerHTML = " "
    form.style.display = 'flex'
    btnForm[1].style.display = 'flex'
    titleForm[0].style.display = 'flex'
    btnForm[0].style.display = 'none'
    titleForm[1].style.display = 'none'

}


// Formulaire
const creerBanniere = async (event) => {
    event.preventDefault()
    // Utilisation de multer
    if (event.submitter !== btnForm[1]) {
        return
    }

    const formData = new FormData()

    formData.append('citation', contenu.value)
    formData.append('image', image.files[0])


    const response = await fetch('/api/bannieres', {
        method: 'POST',
        body: formData
    })

    const result = await response.json()

    if (response.ok) {

        const tr = document.createElement('tr')

        messages.style.color = 'green'
        messages.innerHTML = result.message;

        tr.innerHTML = `
                <td>
                    <img src="${result.banniereCreated.image}" alt="Image bannière">
                </td>
                <td class="citation">
                    <p>
                        ${result.banniereCreated.citation}
                    </p>
                </td>
                <td ><p class="notif">${result.banniereCreated.statut = true ? 'Publié' : 'En attente...'}</p></td>
                <td class="action">
                    <div class="btn-action">
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            
            `
        tbody.prepend(tr)

        contenu.value = ""
        image.value = ""
    } else {
        messages.style.color = 'red'
        messages.innerHTML = result.error;

    }



}
const editeBanniere = async (event) => {
    event.preventDefault()

    if (event.submitter !== btnForm[0]) {
        return

    }

    const formData = new FormData()

    formData.append('citation', contenu.value)
    if (image.files[0]) {
        formData.append('image', image.files[0])
    }

    const dataValue = await fetch(`/api/bannieres/${idBanniere}`, {})
    const resultDataValue = await dataValue.json()

    if (dataValue.ok) {
        const response = await fetch(`/api/bannieres/${idBanniere}`, {
            method: 'PATCH',
            body: formData
        })

        const result = await response.json()

        if (response.ok) {
            messages.style.color = 'green'
            messages.innerHTML = result.message

            contenu.value = ""
            image.value = ""
            btnForm[0].style.display = 'none'

            const tr = document.createElement('tr')


            tr.innerHTML = `
                <td>
                    <img src="${result.banniereUpdated.image === ''?resultDataValue.bannieres.image : result.banniereUpdated.image}" alt="Image bannière">
                </td>
                <td class="citation">
                    <p>
                        ${result.banniereUpdated.citation === ''?resultDataValue.bannieres.citation : result.banniereUpdated.citation}
                    </p>
                </td>
                <td ><p class="notif">${resultDataValue.bannieres.statut = true ? 'Publié' : 'En attente...'}</p></td>
                <td class="action">
                    <div class="btn-action">
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            
            `
            tbody.prepend(tr)



        } else {
            messages.style.color = 'red'
            messages.innerHTML = result.error
        }
    } else {
        console.log(resultDataValue.error);

    }








}
if (btnForm[1]) {
    form.addEventListener('submit', creerBanniere)
}
if (btnForm[0]) {
    form.addEventListener('submit', editeBanniere)
}


// Tableau affichage
const tbody = document.querySelector('tbody')
const afficherBannieres = async () => {
    const response = await fetch('/api/bannieres', {})
    const result = await response.json()

    if (response.ok) {

        result.bannieres.forEach(banniere => {
            const tr = document.createElement('tr')

            tr.innerHTML = `
                <td>
                    <img src="${banniere.image}" alt="Image bannière">
                </td>
                <td class="citation">
                    <p>
                        ${banniere.citation}
                    </p>
                </td>
                <td ><p class="notif">${banniere.statut = true ? 'Publié' : 'En attente...'}</p></td>
                <td class="action">
                    <div class="btn-action">
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            
            `
            tbody.appendChild(tr)

            const btnOpenEdite = tr.querySelectorAll('.edite ')
            const btnDelete = tr.querySelectorAll('.delete ')

            const openEdtite = async (event) => {
                event.preventDefault()
                messages.innerHTML = " "

                form.style.display = 'flex'
                btnForm[0].style.display = 'flex'
                titleForm[1].style.display = 'flex'
                btnForm[1].style.display = 'none'
                titleForm[0].style.display = 'none'

                idBanniere = banniere.id

                const editeOpenResponse = await fetch(`/api/bannieres/${banniere.id}`, {
                    method: 'GET'
                })

                const editeOpenResult = await editeOpenResponse.json()

                if (editeOpenResponse.ok) {
                    contenu.value = editeOpenResult.bannieres.citation
                    tbody.removeChild(tr)
                } else {
                    console.log(editeOpenResult.error);

                }




            }
            const Delete = async (event) => {
                event.preventDefault()

                const deleteResponse = await fetch(`/api/bannieres/${banniere.id}`, {
                    method: "DELETE",
                    headers: { 'Content-Type': 'application/json' }
                })

                if (deleteResponse.ok) {
                    tbody.removeChild(tr)
                } else {
                    console.log(result.error);

                }


            }
            if (btnOpenEdite) {
                btnOpenEdite.forEach(btn => {
                    btn.addEventListener('click', openEdtite)
                })
            }
            if (btnDelete) {
                btnDelete.forEach(btn => {
                    btn.addEventListener('click', Delete)
                })
            }
        });


    } else {
        console.log(result.error);
    }
}

if (tbody) {
    afficherBannieres()
}




if (btnOpenForm) {
    btnOpenForm.addEventListener('click', openForm)
}

