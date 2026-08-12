const btnOpenForm = document.querySelector('#btn-add')
const form = document.querySelector('.form-add-edite')
const btnForm = document.querySelectorAll('.btn-valide button')
const titleForm = document.querySelectorAll('.titre h2')
const tbody = document.querySelector('tbody')
const formulaire = document.querySelector('.form')
const input = document.querySelectorAll('.form input')
const select = document.querySelectorAll('.form select')
const btn = document.querySelectorAll('.form .btn-valide button')
const profil = document.querySelector('.profil')
const profilImg = document.querySelector('.profil img')
const prifilInfo = document.querySelectorAll('.info p span')
let idPersonnel = null

const openForm = (event) => {
    event.preventDefault()

    document.querySelector('.message1').innerHTML = ""
    form.style.display = 'flex'
    btnForm[1].style.display = 'flex'
    titleForm[0].style.display = 'flex'
    btnForm[0].style.display = 'none'
    titleForm[1].style.display = 'none'
    profil.classList.remove("open");
    document.querySelector('.message2').innerHTML = ''

}

const createPersonnels = async (event) => {
    event.preventDefault()

    if (event.submitter !== btn[1]) {
        return
    }

    const formData = new FormData(formulaire)

    const response = await fetch('/api/personnels', {
        method: 'POST',
        body: formData
    })

    const result = await response.json()

    if (response.ok) {
        document.querySelector('.message1').style.color = 'green'
        document.querySelector('.message1').innerHTML = result.message

        const tr = document.createElement('tr')
        const date = result.personnel.date_embauche.split('T')[0]

        tr.innerHTML = `
            <td>${result.personnel.nom_complet}</td>
                <td>${result.personnel.email}</td>
                <td>${result.personnel.role}</td>
                <td><p class="${result.personnel.statut === true ? 'notif' : 'unnotif'}">${result.personnel.statut === true ? 'Actif' : 'Suspendu'}</p></p>
                <td>${date}</td>
                 <td class="action">
                    <div class="btn-action">
                        <ion-icon class="see" name="eye-outline"></ion-icon>
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
        
        `
        tbody.prepend(tr)

        const btnOpenEdite = tr.querySelectorAll('.edite')
        const btnDelete = tr.querySelectorAll('.delete')
        const btnSee = tr.querySelectorAll('.see')

        const openEdtite = async (event) => {
            event.preventDefault()
            profil.classList.remove("open");

            document.querySelector('.message1').innerHTML = ""

            form.style.display = 'flex'
            btnForm[0].style.display = 'flex'
            titleForm[1].style.display = 'flex'
            btnForm[1].style.display = 'none'
            titleForm[0].style.display = 'none'
            document.querySelector('.message1').style.color = 'black'
            document.querySelector('.message1').innerHTML = 'Veuillez saisir les valeurs des champs que vous souhaitez modifier.'
            document.getElementById("form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                document.querySelector('.message2').innerHTML = ''
            tbody.removeChild(tr)

            idPersonnel = result.personnel.id

            // const editeResponse = await fetch(`/api/personnels/${personnel.id}`, {})
            // const editeResult = await editeResponse.json()

            // if (editeResponse.ok) {

            //     idPersonnel = personnel.id
            //     document.querySelector('.message1').innerHTML = 'Veuillez saisir les valeurs des champs que vous souhaitez modifier.'

            // } else {
            //     console.log(editeResult.error);

            // }
        }
        const deletePersonel = async (event) => {
            event.preventDefault()
            profil.classList.remove("open");

            const deleteResponse = await fetch(`/api/personnels/${result.personnel.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            const deletResult = await deleteResponse.json()

            if (deleteResponse.ok) {
                tbody.removeChild(tr)
                document.querySelector('.message2').innerHTML = ""
                document.querySelector('.message2').style.color = 'green'
                document.querySelector('.message2').innerHTML = deletResult.message
            } else {
                document.querySelector('.message2').innerHTML = ""
                document.querySelector('.message2').style.color = 'red'
                document.querySelector('.message2').innerHTML = deletResult.error

            }

        }
        const voirPersonnel = async (event) => {
            event.preventDefault()

            form.style.display = 'none'

            const seeResponse = await fetch(`/api/personnels/${result.personnel.id}`, {})

            const seeResult = await seeResponse.json()

            const date = {
                date_de_naissance: seeResult.personnel.date_de_naissance.split('T')[0],
                date_embauche: seeResult.personnel.date_embauche.split('T')[0],
                date_fin_contrat: seeResult.personnel.date_fin_contrat !== null ? seeResult.personnel.date_fin_contrat.split('T')[0] : 'Aucune'
            }

            const metier = await fetch(`/api/metiers/${seeResult.personnel.metier_id}`, {})

            const metierResult = await metier.json()

            const qualif = await fetch(`/api/qualifications/${seeResult.personnel.qualification_id}`, {})

            const qualifResult = await qualif.json()

            if (seeResponse.ok) {


                profilImg.src = `/assets/${seeResult.personnel.image}`

                prifilInfo[0].textContent = seeResult.personnel.role
                prifilInfo[1].textContent = seeResult.personnel.nom_complet

                prifilInfo[2].textContent = date.date_de_naissance;
                prifilInfo[3].textContent = seeResult.personnel.ville_de_naissance;
                prifilInfo[4].textContent = seeResult.personnel.pays_de_naissance;
                prifilInfo[5].textContent = seeResult.personnel.sexe;
                prifilInfo[6].textContent = seeResult.personnel.adresse;
                prifilInfo[7].textContent = seeResult.personnel.ville;
                prifilInfo[8].textContent = seeResult.personnel.pays;
                prifilInfo[9].textContent = seeResult.personnel.email;
                prifilInfo[10].textContent = seeResult.personnel.telephone;
                prifilInfo[11].textContent = metier.ok ? metierResult.metier.titre : '';
                prifilInfo[12].textContent = qualif.ok ? qualifResult.qualification.niveau_qualification : '';
                prifilInfo[13].textContent = seeResult.personnel.annee_experience;
                prifilInfo[14].textContent = seeResult.personnel.code_personnel;
                prifilInfo[15].textContent = date.date_embauche;
                prifilInfo[16].textContent = date.date_fin_contrat ?? "Aucune";
                prifilInfo[17].textContent = seeResult.personnel.salaire;
                prifilInfo[18].textContent = seeResult.personnel.statut ? "Actif" : "Suspendu";

                profil.classList.add("open");


            } else {
                return

            }

        }

        if (btnOpenEdite) {
            btnOpenEdite.forEach(btn => {
                btn.addEventListener('click', openEdtite)
            })
        }
        if (btnDelete) {
            btnDelete.forEach(btn => {
                btn.addEventListener('click', deletePersonel)
            })
        }
        if (btnSee) {
            btnSee.forEach(btn => {
                btn.addEventListener('click', voirPersonnel)
            })
        }

        formulaire.reset()

    } else {
        document.querySelector('.message1').style.color = 'red'
        document.querySelector('.message1').innerHTML = result.error
    }
}
if (form) {
    form.addEventListener('submit', createPersonnels)
}

const editePersonnel = async (event) => {
    event.preventDefault()


    if (event.submitter !== btn[0]) {
        return
    }

    const formData = new FormData(formulaire)

    const dataValue = await fetch(`/api/personnels/${idPersonnel}`, {})

    const resultDataValue = await dataValue.json()

    if (dataValue.ok) {

        const response = await fetch(`/api/personnels/${idPersonnel}`, {
            method: 'PATCH',
            body: formData
        })

        const result = await response.json()

        if (response.ok) {
            document.querySelector('.message1').style.color = 'green'
            document.querySelector('.message1').innerHTML = result.message

            btn[0].style.display = 'none'
            formulaire.reset()


            const tr = document.createElement('tr')
            const date = resultDataValue.personnel.date_embauche.split('T')[0]

            tr.innerHTML = `
            <td>${result.personnel.nom_complet == ''?resultDataValue.personnel.nom_complet : result.personnel.nom_complet}</td>
                <td>${result.personnel.email == ''?resultDataValue.personnel.email : result.personnel.email}</td>
                <td>${result.personnel.nom_complet == ''?resultDataValue.personnel.role : result.personnel.role}</td>
                <td><p class="${result.personnel.statut === true ? 'notif' : 'unnotif'}">${result.personnel.statut === true ? 'Actif' : 'Suspendu'}</p></p>
                <td>${date}</td>
                 <td class="action">
                    <div class="btn-action">
                        <ion-icon class="see" name="eye-outline"></ion-icon>
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
        
        `
            tbody.prepend(tr)

            const btnOpenEdite = tr.querySelectorAll('.edite')
            const btnDelete = tr.querySelectorAll('.delete')
            const btnSee = tr.querySelectorAll('.see')

            const openEdtite = async (event) => {
                event.preventDefault()
                profil.classList.remove("open");

                document.querySelector('.message1').innerHTML = ""

                form.style.display = 'flex'
                btnForm[0].style.display = 'flex'
                titleForm[1].style.display = 'flex'
                btnForm[1].style.display = 'none'
                titleForm[0].style.display = 'none'
                document.querySelector('.message1').style.color = 'black'
                document.querySelector('.message1').innerHTML = 'Veuillez saisir les valeurs des champs que vous souhaitez modifier.'

                document.getElementById("form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                document.querySelector('.message2').innerHTML = ''
                tbody.removeChild(tr)

                idPersonnel = result.personnel.id

                // const editeResponse = await fetch(`/api/personnels/${personnel.id}`, {})
                // const editeResult = await editeResponse.json()

                // if (editeResponse.ok) {

                //     idPersonnel = personnel.id
                //     document.querySelector('.message1').innerHTML = 'Veuillez saisir les valeurs des champs que vous souhaitez modifier.'

                // } else {
                //     console.log(editeResult.error);

                // }
            }
            const deletePersonel = async (event) => {
                event.preventDefault()
                profil.classList.remove("open");

                const deleteResponse = await fetch(`/api/personnels/${result.personnel.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })

                const deletResult = await deleteResponse.json()

                if (deleteResponse.ok) {
                    tbody.removeChild(tr)
                    document.querySelector('.message2').innerHTML = ""
                    document.querySelector('.message2').style.color = 'green'
                    document.querySelector('.message2').innerHTML = deletResult.message
                } else {
                    document.querySelector('.message2').innerHTML = ""
                    document.querySelector('.message2').style.color = 'red'
                    document.querySelector('.message2').innerHTML = deletResult.error

                }

            }
            const voirPersonnel = async (event) => {
                event.preventDefault()

                form.style.display = 'none'

                const seeResponse = await fetch(`/api/personnels/${result.personnel.id}`, {})

                const seeResult = await seeResponse.json()

                const date = {
                    date_de_naissance: seeResult.personnel.date_de_naissance.split('T')[0],
                    date_embauche: seeResult.personnel.date_embauche.split('T')[0],
                    date_fin_contrat: seeResult.personnel.date_fin_contrat !== null ? seeResult.personnel.date_fin_contrat.split('T')[0] : 'Aucune'
                }

                const metier = await fetch(`/api/metiers/${seeResult.personnel.metier_id}`, {})

                const metierResult = await metier.json()

                const qualif = await fetch(`/api/qualifications/${seeResult.personnel.qualification_id}`, {})

                const qualifResult = await qualif.json()

                if (seeResponse.ok) {


                    profilImg.src = `/assets/${seeResult.personnel.image}`

                    prifilInfo[0].textContent = seeResult.personnel.role
                    prifilInfo[1].textContent = seeResult.personnel.nom_complet

                    prifilInfo[2].textContent = date.date_de_naissance;
                    prifilInfo[3].textContent = seeResult.personnel.ville_de_naissance;
                    prifilInfo[4].textContent = seeResult.personnel.pays_de_naissance;
                    prifilInfo[5].textContent = seeResult.personnel.sexe;
                    prifilInfo[6].textContent = seeResult.personnel.adresse;
                    prifilInfo[7].textContent = seeResult.personnel.ville;
                    prifilInfo[8].textContent = seeResult.personnel.pays;
                    prifilInfo[9].textContent = seeResult.personnel.email;
                    prifilInfo[10].textContent = seeResult.personnel.telephone;
                    prifilInfo[11].textContent = metier.ok ? metierResult.metier.titre : '';
                    prifilInfo[12].textContent = qualif.ok ? qualifResult.qualification.niveau_qualification : '';
                    prifilInfo[13].textContent = seeResult.personnel.annee_experience;
                    prifilInfo[14].textContent = seeResult.personnel.code_personnel;
                    prifilInfo[15].textContent = date.date_embauche;
                    prifilInfo[16].textContent = date.date_fin_contrat ?? "Aucune";
                    prifilInfo[17].textContent = seeResult.personnel.salaire;
                    prifilInfo[18].textContent = seeResult.personnel.statut ? "Actif" : "Suspendu";

                    profil.classList.add("open");


                } else {
                    return

                }

            }

            if (btnOpenEdite) {
                btnOpenEdite.forEach(btn => {
                    btn.addEventListener('click', openEdtite)
                })
            }
            if (btnDelete) {
                btnDelete.forEach(btn => {
                    btn.addEventListener('click', deletePersonel)
                })
            }
            if (btnSee) {
                btnSee.forEach(btn => {
                    btn.addEventListener('click', voirPersonnel)
                })
            }

        } else {
            document.querySelector('.message1').style.color = 'red'
            document.querySelector('.message1').innerHTML = result.error

        }
    } else {
        console.log(resultDataValue.error);

    }




}

if (form) {
    form.addEventListener('submit', editePersonnel)

}

const afficherMetierEtQualif = async () => {
    const metier = await fetch('/api/metiers', {})
    const qualification = await fetch('/api/qualifications', {})

    const metierResult = await metier.json()
    const qualifResult = await qualification.json()

    if (metier.ok) {
        metierResult.metier.forEach(metiers => {
            const option = document.createElement('option')
            option.value = metiers.id
            option.innerHTML = metiers.titre

            select[4].appendChild(option)

        })
    }
    if (qualification.ok) {
        qualifResult.qualification.forEach(qualifications => {
            const option = document.createElement('option')
            option.value = qualifications.id
            option.innerHTML = qualifications.niveau_qualification

            select[5].appendChild(option)



        })
    } else {
        return

    }
}
if (form) {
    afficherMetierEtQualif()
}

const afficherPersonnels = async () => {
    const response = await fetch('/api/personnels', {})

    const result = await response.json()

    if (response.ok) {
        result.personnels.forEach(personnel => {
            const tr = document.createElement('tr')
            const date = personnel.date_embauche.split('T')[0]

            tr.innerHTML = `
                <td>${personnel.nom_complet}</td>
                <td>${personnel.email}</td>
                <td>${personnel.role}</td>
                <td><p class="${personnel.statut === true ? 'notif' : 'unnotif'}">${personnel.statut === true ? 'Actif' : 'Suspendu'}</p></p>
                <td>${date}</td>
                 <td class="action">
                    <div class="btn-action">
                        <ion-icon class="see" name="eye-outline"></ion-icon>
                        <ion-icon class="edite" name="create-outline"></ion-icon>
                        <ion-icon class="delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            `
            tbody.appendChild(tr)

            const btnOpenEdite = tr.querySelectorAll('.edite')
            const btnDelete = tr.querySelectorAll('.delete')
            const btnSee = tr.querySelectorAll('.see')

            const openEdtite = async (event) => {
                event.preventDefault()
                profil.classList.remove("open");

                document.querySelector('.message1').innerHTML = ""

                form.style.display = 'flex'
                btnForm[0].style.display = 'flex'
                titleForm[1].style.display = 'flex'
                btnForm[1].style.display = 'none'
                titleForm[0].style.display = 'none'

                document.querySelector('.message2').innerHTML = ''
                document.getElementById("form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                tbody.removeChild(tr)

                const editeResponse = await fetch(`/api/personnels/${personnel.id}`, {})
                const editeResult = await editeResponse.json()

                if (editeResponse.ok) {

                    idPersonnel = personnel.id
                    document.querySelector('.message1').innerHTML = 'Veuillez saisir les valeurs des champs que vous souhaitez modifier.'

                } else {
                    return

                }
            }
            const deletePersonel = async (event) => {
                event.preventDefault()
                profil.classList.remove("open");

                const deleteResponse = await fetch(`/api/personnels/${personnel.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })

                const deletResult = await deleteResponse.json()

                if (deleteResponse.ok) {
                    tbody.removeChild(tr)
                    document.querySelector('.message2').innerHTML = ""
                    document.querySelector('.message2').style.color = 'green'
                    document.querySelector('.message2').innerHTML = deletResult.message
                } else {
                    document.querySelector('.message2').innerHTML = ""
                    document.querySelector('.message2').style.color = 'red'
                    document.querySelector('.message2').innerHTML = deletResult.error

                }

            }
            const voirPersonnel = async (event) => {
                event.preventDefault()

                form.style.display = 'none'

                const seeResponse = await fetch(`/api/personnels/${personnel.id}`, {})

                const seeResult = await seeResponse.json()

                const date = {
                    date_de_naissance: seeResult.personnel.date_de_naissance.split('T')[0],
                    date_embauche: seeResult.personnel.date_embauche.split('T')[0],
                    date_fin_contrat: seeResult.personnel.date_fin_contrat !== null ? seeResult.personnel.date_fin_contrat.split('T')[0] : 'Aucune'
                }

                const metier = await fetch(`/api/metiers/${seeResult.personnel.metier_id}`, {})

                const metierResult = await metier.json()

                const qualif = await fetch(`/api/qualifications/${seeResult.personnel.qualification_id}`, {})

                const qualifResult = await qualif.json()

                if (seeResponse.ok) {


                    profilImg.src = `/assets/${seeResult.personnel.image}`

                    prifilInfo[0].textContent = seeResult.personnel.role
                    prifilInfo[1].textContent = seeResult.personnel.nom_complet

                    prifilInfo[2].textContent = date.date_de_naissance;
                    prifilInfo[3].textContent = seeResult.personnel.ville_de_naissance;
                    prifilInfo[4].textContent = seeResult.personnel.pays_de_naissance;
                    prifilInfo[5].textContent = seeResult.personnel.sexe;
                    prifilInfo[6].textContent = seeResult.personnel.adresse;
                    prifilInfo[7].textContent = seeResult.personnel.ville;
                    prifilInfo[8].textContent = seeResult.personnel.pays;
                    prifilInfo[9].textContent = seeResult.personnel.email;
                    prifilInfo[10].textContent = seeResult.personnel.telephone;
                    prifilInfo[11].textContent = metier.ok ? metierResult.metier.titre : '';
                    prifilInfo[12].textContent = qualif.ok ? qualifResult.qualification.niveau_qualification : '';
                    prifilInfo[13].textContent = seeResult.personnel.annee_experience;
                    prifilInfo[14].textContent = seeResult.personnel.code_personnel;
                    prifilInfo[15].textContent = date.date_embauche;
                    prifilInfo[16].textContent = date.date_fin_contrat ?? "Aucune";
                    prifilInfo[17].textContent = seeResult.personnel.salaire;
                    prifilInfo[18].textContent = seeResult.personnel.statut ? "Actif" : "Suspendu";

                    profil.classList.add("open");


                } else {
                    return

                }

            }

            if (btnOpenEdite) {
                btnOpenEdite.forEach(btn => {
                    btn.addEventListener('click', openEdtite)
                })
            }
            if (btnDelete) {
                btnDelete.forEach(btn => {
                    btn.addEventListener('click', deletePersonel)
                })
            }
            if (btnSee) {
                btnSee.forEach(btn => {
                    btn.addEventListener('click', voirPersonnel)
                })
            }
        });


    } else {
        return

    }

}

if (tbody) {
    afficherPersonnels()
}


if (btnOpenForm) {
    btnOpenForm.addEventListener('click', openForm)
}
