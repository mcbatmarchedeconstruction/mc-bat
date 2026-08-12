const tbody = document.querySelector('tbody')

const afficherMarches = async () => {
    
    const response = await fetch('/api/marchesStatutTrue', {})

    const result = await response.json()

    if (response.ok) {
        result.marches.forEach(marche => {
            const tr = document.createElement('tr')

            tr.innerHTML = `
                <td>${marche.produit}</td>
                <td>${marche.details_produit}</td>
                <td>${marche.prix}$</td>


            `
            tbody.appendChild(tr)
        })
    } else {

        console.error(result.error);
    }
}

if (tbody) {
    afficherMarches()
}