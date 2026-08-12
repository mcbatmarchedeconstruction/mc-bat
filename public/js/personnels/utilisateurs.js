

const tbody = document.querySelector('tbody')
const messages = document.querySelector('.message')

const afficherUtilisateurs = async () => {
    
    const response = await fetch('/api/utilisateurs', {})

    const result = await response.json()

    if (response.ok) {
        result.utilisateur.forEach(utilisateurs => {
            
            const tr = document.createElement('tr')
            const date = utilisateurs.created_at.split('T')[0]

            tr.innerHTML = `
                <td>${utilisateurs.email}</td>
                <td>${date}</td>
                <td class="action">
                    <div class="btn-action">
                        <ion-icon class = "delete" name="trash-outline"></ion-icon>
                    </div>
                </td>
            `
            tbody.appendChild(tr)

            const btnDelete = tr.querySelectorAll('.delete')

            const utilisateurDeleted = async (event) => {
                event.preventDefault()

                const deleteResponse = await fetch(`/api/utilisateurs/${utilisateurs.id}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'}
                })

                const deleteResult = await deleteResponse.json()

                if (deleteResponse.ok) {
                    tbody.removeChild(tr)
                    messages.style.color = 'green'
                    messages.innerHTML = deleteResult.message
                }else {
                    messages.style.color = 'red'
                    messages.innerHTML = deleteResult.error
                    
                }

                
                
            }

            if (btnDelete) {
                btnDelete.forEach(btn => {
                    btn.addEventListener('click', utilisateurDeleted)
                })
            }
        });
    }else {
        console.log(result.error);
        
    }
}

if (tbody) {
    afficherUtilisateurs()
}


