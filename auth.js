import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from 'bcrypt';
import { getPersonnelById, getPersonnelByEmail } from './model/personnels.js'

// Configuration générale de la stratégie.
// On indique ici qu'on s'attend à ce que le client
// envoie une variable "email" et "mot_de_passe" au
// serveur pour l'authentification.
const config = {
    usernameField : 'email',
    passwordField : 'mot_de_passe'
}

// Configuration de la stratégie d'authentification locale
passport.use(new Strategy(config, async(email, mot_de_passe, done) => {
    // S'il y a une erreur avec la base de données,
    // on retourne l'erreur au serveur
    try {
        // On va chercher l'utilisateur dans la base
        // de données avec son identifiant, le
        // courriel ici
        const utilisateur = await getPersonnelByEmail(email);

         // Si on ne trouve pas l'utilisateur, on
        // retourne que l'authentification a échoué
        // avec un code d'erreur

        if (!utilisateur) {
            return done(null, false, {error: "Cet utilisateur n'existe pas."})
        }

         // Si on a trouvé l'utilisateur, on compare
        // son mot de passe dans la base de données
        // avec celui envoyé au serveur. On utilise
        // une fonction de bcrypt pour le faire
        const valide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe)
        

        // Si les mots de passe ne concordent pas, on
        // retourne que l'authentification a échoué
        // avec un code d'erreur
        if (!valide) {
            return done(null, false, {error: "Mot de passe incorrect."})
        }

              
        // Si les mots de passe concordent, on retourne
        // l'information de l'utilisateur au serveur
        return done(null, utilisateur);

    } catch (error) {
        return done(error);
    }
}));

// Sérialisation
passport.serializeUser((utilisateur, done) => {
    // On met seulement l'id de l'utilisateur

    return done(null, utilisateur.id)

});

// Désérialisation
passport.deserializeUser(async (idUtilisateur, done) => {
    // S'il y a une erreur de base de données, on
    // retourne l'erreur au serveur
    try {
        // Puisqu'on a juste l'identifiant dans la 
        // session, on doit être capable d'aller chercher 
        // l'utilisateur avec celui-ci dans la base de 
        // données.
        const utilisateur = await getPersonnelById(idUtilisateur)
        if (!utilisateur) {
            return done(null, false, {error: "Cet utilisateur n'existe pas"})
        }

        return done(null, utilisateur);
    } catch (error) {
        return done(error);   
    }
});