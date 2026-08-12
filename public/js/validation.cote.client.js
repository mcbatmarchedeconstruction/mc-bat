export const isNomValide = (nom) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    nom = nom.trim() && typeof nom === 'string'; // Supprime les espaces au début et à la fin
    if (nom.length < 2 || nom.length > 50) {
        return false; // Vérifie la longueur du nom
    }
    return regex.test(nom);
}

export const isVilleValide = (ville) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    ville = ville.trim() && typeof ville === 'string'; // Supprime les espaces au début et à la fin
    if (ville.length < 2 || ville.length > 50) {
        return false; // Vérifie la longueur de la ville
    }
    return regex.test(ville);
}

export const isSexeValide = (sexe) => {
    const regex = /^(Homme|Femme)$/;
    return regex.test(sexe);
}

export const isAdresseValide = (adresse) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    adresse = adresse.trim() && typeof adresse === 'string'; // Supprime les espaces au début et à la fin
    if (adresse.length < 2 || adresse.length > 100) {
        return false; // Vérifie la longueur de l'adresse
    }
    return regex.test(adresse);
}


export const isMotDePasseValide = (mot_de_passe) => {
    // Vérifie si le mot de passe contient au moins 8 caractères, une lettre, un chiffre et un caractère spécial ou null 

    if (mot_de_passe === null || mot_de_passe === "") {
        return true; // Autorise null comme mot de passe valide
    }
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(mot_de_passe);
}

export const isTelephoneValide = (telephone) => {
    const regex = /^\+?[0-9]{7,15}$/; // Autorise les numéros avec ou sans le signe + et entre 7 et 15 chiffres
    return regex.test(telephone);
}

export const isAnneeExperienceValide = (annee_experience) => {
    const regex = /^[0-9]+$/; // Autorise uniquement les chiffres
    return regex.test(annee_experience);
}

export const isSalaireValide = (salaire) => {
    const regex = /^[0-9]+(\.[0-9]{1,2})?$/; // Autorise les nombres avec ou sans décimales (jusqu'à 2 décimales)
    return regex.test(salaire);
}

export const isCodePersonnelValide = (code_personnel) => {
    const regex = /^[A-Za-z0-9-]+$/; // Autorise uniquement les lettres et les chiffres
    return regex.test(code_personnel);
}

export const isEmailValide = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}