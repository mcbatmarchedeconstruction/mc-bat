const noservices = document.querySelector('.nos-services')

const afficherService = async () => {

    const response = await fetch('/api/servicesStatutTrue', {})

    const result = await response.json()

    if (response.ok) {
        result.services.forEach(service => {
            const div = document.createElement('div')
            div.classList.add('service')

            div.innerHTML = `
                <img src="/assets/${service.image}" alt="Image service">
                <h3>${service.titre}</h3>
                <p>${service.description}</p>
            `

            noservices.appendChild(div)
        })
    } else {
        console.log(result.error);
        
    }
}

if (noservices) {
    afficherService()
}
