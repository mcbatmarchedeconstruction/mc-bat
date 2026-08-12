import { 
    isNomValide, isVilleValide, isSexeValide, isAdresseValide, isEmailValide, 
    isMotDePasseValide, isTelephoneValide, isAnneeExperienceValide, isSalaireValide, 
    isCodePersonnelValide } from '../public/js/validation.cote.client.js';


export const validatePersonnelData = (dataPersonnel) => {
    const errors = [];

    if (!dataPersonnel.nom_complet || !isNomValide(dataPersonnel.nom_complet)) {
        errors.push('Nom complet invalide');
    }

    if (!dataPersonnel.ville || !isVilleValide(dataPersonnel.ville)) {
        errors.push('Ville invalide');
    }

    if (!dataPersonnel.sexe || !isSexeValide(dataPersonnel.sexe)) {
        errors.push('Sexe invalide');
    }

    if (!dataPersonnel.adresse || !isAdresseValide(dataPersonnel.adresse)) {
        errors.push('Adresse invalide');
    }

    if (!dataPersonnel.email || !isEmailValide(dataPersonnel.email)) {
        errors.push('Email invalide');
    }

    if (dataPersonnel.mot_de_passe !== null && dataPersonnel.mot_de_passe !== "" && !isMotDePasseValide(dataPersonnel.mot_de_passe)) {
        errors.push('Mot de passe invalide');
    }

    if (!dataPersonnel.telephone || !isTelephoneValide(dataPersonnel.telephone)) {
        errors.push('Téléphone invalide');
    }

    if (!dataPersonnel.annee_experience || !isAnneeExperienceValide(dataPersonnel.annee_experience)) {
        errors.push('Année d\'expérience invalide');
    }

    if (!dataPersonnel.salaire || !isSalaireValide(dataPersonnel.salaire)) {
        errors.push('Salaire invalide');
    }

    if (!dataPersonnel.code_personnel || !isCodePersonnelValide(dataPersonnel.code_personnel)) {
        errors.push('Code personnel invalide');
    }

    return errors;
};

export const validateUpdatePersonnel = (dataPersonnel) => {
    const errors = [];

    if (
        dataPersonnel.nom_complet !== undefined && dataPersonnel.nom_complet !== '' &&
        !isNomValide(dataPersonnel.nom_complet)
    ) {
        errors.push("Nom complet invalide");
    }

    if (
        dataPersonnel.ville !== undefined &&  dataPersonnel.ville !== '' &&
        !isVilleValide(dataPersonnel.ville)
    ) {
        errors.push("Ville invalide");
    }

    if (
        dataPersonnel.sexe !== undefined &&
        !isSexeValide(dataPersonnel.sexe)
    ) {
        errors.push("Sexe invalide");
    }

    if (
        dataPersonnel.adresse !== undefined && dataPersonnel.adresse !== '' &&
        !isAdresseValide(dataPersonnel.adresse)
    ) {
        errors.push("Adresse invalide");
    }

    if (
        dataPersonnel.email !== undefined && dataPersonnel.email !== '' &&
        !isEmailValide(dataPersonnel.email)
    ) {
        errors.push("Email invalide");
    }

    if (
        dataPersonnel.mot_de_passe !== undefined &&
        dataPersonnel.mot_de_passe !== "" &&
        !isMotDePasseValide(dataPersonnel.mot_de_passe)
    ) {
        errors.push("Mot de passe invalide");
    }

    if (
        dataPersonnel.telephone !== undefined && dataPersonnel.telephone !== '' &&
        !isTelephoneValide(dataPersonnel.telephone)
    ) {
        errors.push("Téléphone invalide");
    }

    if (
        dataPersonnel.annee_experience !== undefined && dataPersonnel.annee_experience !== '' &&
        !isAnneeExperienceValide(dataPersonnel.annee_experience)
    ) {
        errors.push("Année d'expérience invalide");
    }

    if (
        dataPersonnel.salaire !== undefined &&  dataPersonnel.salaire !== '' &&
        !isSalaireValide(dataPersonnel.salaire)
    ) {
        errors.push("Salaire invalide");
    }

    if (
        dataPersonnel.code_personnel !== undefined && dataPersonnel.code_personnel !== '' &&
        !isCodePersonnelValide(dataPersonnel.code_personnel)
    ) {
        errors.push("Code personnel invalide");
    }

    return errors;
};


export const estConnecte = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/page/login');
};