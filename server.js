import 'dotenv/config'

import express, { json, request, response } from 'express';
import helmet, { contentSecurityPolicy } from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { engine } from "express-handlebars";
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import './auth.js'
import multer from 'multer';
import cloudinary  from './config/claudinary.js';


// Création de l'application Express
const app = express();

// Référence : configuration du moteur de rendu Handlebars.
app.engine("handlebars", engine({
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        or: function (a, b) {
            return a || b;
        }
    },
    extname: ".handlebars",
    defaultLayout: "main"
}));

app.set("view engine", "handlebars")
app.set("views", "./views")

// Config session
const MemoryStore = memorystore(session);

// Middlewares
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],

                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "'unsafe-eval'",
                    "https:",
                    "http:",
                    "https://unpkg.com",
                    "https://cdn.jsdelivr.net",
                    "https://cdn.ckeditor.com"
                ],

                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://unpkg.com",
                    "https://cdn.jsdelivr.net",
                    "https://cdn.ckeditor.com"
                ],

                imgSrc: [
                    "'self'",
                    "data:",
                    "https:",
                    "http:"
                ],

                fontSrc: [
                    "'self'",
                    "data:",
                    "https:"
                ],

                connectSrc: [
                    "'self'",
                    "https:",
                    "http:",
                    "https://unpkg.com",
                    "https://cdn.jsdelivr.net",
                    "https://cdn.ckeditor.com"
                ],

                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
                frameAncestors: ["'self'"]
            }
        }
    })
);
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://192.168.2.175:3000"
    ],
    credentials: true
}));
app.use(compression());
app.use(json());

// middleware de session 
app.use(session({
    cookie: { maxAge: 3600000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, private'
    );
    next();
});


// multer pour envoyer les données
const storage = multer.memoryStorage();

/// claudinary 

const uploadImage = (fileBuffer, folder = "mc-bat") => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "image"
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        stream.end(fileBuffer);
    });
};
const sendImage = multer({ storage });

// Autres middlewares
app.use(express.static("public"));
app.use('/assets', express.static('assets'));

// Importation des fonctions
import {
    createPersonnel, getAllPersonnels, getPersonnelById, updatePersonnel,
    deletePersonnel, getPersonnelByEmail,
    countPersonnel
} from './model/personnels.js';
import { createActualite, getAllActualites, getAllActualitesStatutTrue, getActualitesLimit, getActualiteById, updateActualite, deleteActualite, countActualite, envoyerMailNewActualite } from './model/actualites.js';
import { createBanniere, getAllBanniere, getBanniereById, updateBanniere, deleteBanniere } from './model/bannieres.js'
import { createDevis, getAllDevis, getDevisById, getDevisLimit, updateDevis, deleteDevis, countDevis, envoyerMailTraitement } from './model/devis.js'
import { createHistorique, getAllHistorique } from './model/historiques.js'
import { createMetier, getAllMetier, getMetierById, updateMetier, deleteMetier } from './model/metier.js'
import { createOffre, getAllOffre, getAllOffreStatutTrue, getOffreById, getOffreMois, updateOffre, deleteOffre, envoyerMailNewOffre } from './model/offres.js'
import { createQualification, getAllQualification, getQualificationById, updateQualification, deletequalification } from './model/qualifications.js'
import { createRealisation, getAllRealisation, getAllRealisationStatutTrue, getRealisationById, updateRealisation, deleteRealisation } from './model/realisations.js'
import { createService, getAllService, getAllServiceStatutTrue, getServiceById, updateService, deleteService, countService } from './model/services.js'
import { createUtilisateur, deleteUtilisateur, getAllUtilisateur, getUtilisateurByEamil, countUtilisateur } from './model/utilisateurs.js'
import { createMarche, getAllMarche, getAllMarcheStatutTrue, getMarcheById, getMarcheLimit, updateMarche, deleteMarche } from './model/marches.js'

// Importation des fonctions de validation
import { validatePersonnelData, validateUpdatePersonnel, estConnecte } from './middlewares/validation.cote.serveur.js';


// Création des routes
/*
 *  ======= Début route pour statut true. =======
 * 
 */
app.get('/api/actualitesStatutTrue', async (request, response) => {
    try {
        const actualites = await getAllActualitesStatutTrue()
        response.status(200).json({
            actualites
        })
    } catch (error) {
        response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/servicesStatutTrue', async (request, response) => {
    try {
        const services = await getAllServiceStatutTrue()
        response.status(200).json({
            services
        })
    } catch (error) {
        response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/realisationsStatutTrue', async (request, response) => {
    try {
        const realisations = await getAllRealisationStatutTrue()
        response.status(200).json({
            realisations
        })
    } catch (error) {
        response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/offresStatutTrue', async (request, response) => {
    try {
        const offres = await getAllOffreStatutTrue()
        response.status(200).json({
            offres
        }  )
    } catch (error) {
        response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/marchesStatutTrue', async (request, response) => {
    try {
        const marches = await getAllMarcheStatutTrue()
        response.status(200).json({
            marches
        })
    } catch (error) {
        response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
/*
 *  ======= Fin route pour statut true. =======
 * 
 */
/*
 *  ======= Début route pour marche. =======
 * 
 */
app.post('/api/marches', sendImage.single('image'), async (request, response) => {

    try {

        const dataMarche = request.body
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataMarche.image = image.secure_url;
        }
        if (!dataMarche.produit || dataMarche.produit.trim() === "" || !dataMarche.details_produit || dataMarche.details_produit.trim() === "" || !dataMarche.prix || dataMarche.prix.trim() === "" || !dataMarche.image) {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const marcheCreated = await createMarche(dataMarche)

        if (!marcheCreated) {
            return response.status(404).json({ error: "La création de prix du marché échouée" })
        }

        return response.status(201).json({ message: "La création du prix du marché a réussi", marcheCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la création", error: error.message })
    }
})
app.get('/api/marches', async (request, response) => {
    try {
        const marche = await getAllMarche()

        if (!marche) {
            return response.status(404).json({ error: "La récupération du prix du marché a échoué" })
        }

        return response.status(200).json({ message: "La récupération du prix du marché a réussi", marche })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/marches/:id', async (request, response) => {
    try {
        const { id } = request.params
        const marche = await getMarcheById(id)

        if (!marche) {
            return response.status(404).json({ error: "La récupération du prix du marché a échoué" })
        }

        return response.status(200).json({ message: "La récupération du prix du marché a réussi", marche })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/marchesLimit', async (request, response) => {
    try {
        const marche = await getMarcheLimit()

        if (!marche) {
            return response.status(404).json({ error: "La récupération du prix du marché a échoué" })
        }

        return response.status(200).json({ message: "La récupération du prix du marché a réussi", marche })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.patch('/api/marches/:id', sendImage.single('image'), async (request, response) => {
    try {
        const { id } = request.params
        const dataMarche = request.body
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataMarche.image = image.secure_url;
        }

        // if (!dataMarche.produit || dataMarche.produit.trim() === "" || !dataMarche.details_produit || dataMarche.details_produit.trim() === "" || !dataMarche.prix || dataMarche.prix.trim() === "") {
        //     return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        // }

        Object.keys(dataMarche).forEach((key) => {
            if (dataMarche[key] === '') {
                dataMarche[key] = null
            }
        })

        const marcheUpdated = await updateMarche(id, dataMarche)

        if (!marcheUpdated) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La mise à jour du prix du marché a réussi", marcheUpdated })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message })
    }
})
app.delete('/api/marches/:id', async (request, response) => {
    try {
        const { id } = request.params

        const marcheDeleted = await deleteMarche(id)

        if (!marcheDeleted) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La suppression du prix du marché a réussi", marcheDeleted })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
    }
})
/** 
 *  ======= Fin route pour marche. =======
 * 
 */
/** 
 *  ======= Début route pour utilisateur. =======
 * 
 */
app.post('/api/utilisateurs', sendImage.single('image'), async (request, response) => {
    try {
        const dataUtilisateur = request.body
        if (!dataUtilisateur.email || dataUtilisateur.email.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const utilisateurExiste = await getUtilisateurByEamil(dataUtilisateur.email)

        if (utilisateurExiste) {
            return response.status(409).json({ error: "Cet utilisateur existe déjà" })
        }

        const utilisateurCreated = await createUtilisateur(dataUtilisateur)

        if (!utilisateurCreated) {
            return response.status(404).json({ error: "L'abonnement a échoué" })
        }

        return response.status(201).json({ message: "L'abonnement a réussi", utilisateurCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de l'abonnement", error: error.message })
    }
})
app.get('/api/utilisateurs', async (request, response) => {
    try {
        const utilisateur = await getAllUtilisateur()

        if (!utilisateur) {
            return response.status(404).json({ error: "La récupération de l'utilisateur a échoué" })
        }

        return response.status(200).json({ message: "La récupération de l'utilisateur a réussi", utilisateur })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.delete('/api/utilisateurs/:id', async (request, response) => {
    try {
        const { id } = request.params

        const utilisateurDeleted = await deleteUtilisateur(id)

        if (!utilisateurDeleted) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La suppression de l'utilisateur a réussi", utilisateurDeleted })
    } catch (error) {


        return response.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
    }
})
/** 
 *  ======= Fin route pour utilisateur. =======
 * 
 */
/** 
 *  ======= Début route pour service. =======
 * 
 */
app.post('/api/services', sendImage.single('image'), async (request, response) => {
    try {
        const dataService = request.body
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataService.image = image.secure_url;
        }
        if (!dataService.image || !dataService.titre || dataService.titre.trim() === "" || !dataService.description || dataService.description.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const serviceCreated = await createService(dataService)

        if (!serviceCreated) {
            return response.status(404).json({ error: "La création de service échouée" })
        }

        return response.status(201).json({ message: "La création du service a réussi", serviceCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la création", error: error.message })
    }
})
app.get('/api/services', async (request, response) => {
    try {
        const service = await getAllService()

        if (!service) {
            return response.status(404).json({ error: "La récupération du service a échoué" })
        }

        return response.status(200).json({ message: "La récupération du service a réussi", service })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/services/:id', async (request, response) => {
    try {
        const { id } = request.params
        const service = await getServiceById(id)

        if (!service) {
            return response.status(404).json({ error: "La récupération du service a échoué" })
        }

        return response.status(200).json({ message: "La récupération du service a réussi", service })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.patch('/api/services/:id', sendImage.single('image'), async (request, response) => {
    try {
        const { id } = request.params
        const dataService = request.body
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataService.image = image.secure_url;
        }
        if (dataService.titre.trim() === "" && dataService.description.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        Object.keys(dataService).forEach((key) => {
            if (dataService[key] === '') {
                dataService[key] = null
            }
        })

        const serviceUpdated = await updateService(id, dataService)

        if (!serviceUpdated) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La mise à jour du service a réussi", serviceUpdated })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message })
    }
})
app.delete('/api/services/:id', async (request, response) => {
    try {
        const { id } = request.params

        const serviceDeleted = await deleteService(id)

        if (!serviceDeleted) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La suppression du service a réussi", serviceDeleted })
    } catch (error) {


        return response.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
    }
})
/** 
 *  ======= Fin route pour service. =======
 * 
 */
/** 
 *  ======= Début route pour realisation. =======
 * 
 */
app.post('/api/realisations', sendImage.single('image'), async (request, response) => {
    try {
        const dataRealisation = request.body
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataRealisation.image = image.secure_url;
        }

        if (!dataRealisation.image || !dataRealisation.secteur || !dataRealisation.titre || dataRealisation.titre.trim() === "" || !dataRealisation.description || dataRealisation.description.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const realisationCreated = await createRealisation(dataRealisation)

        if (!realisationCreated) {
            return response.status(404).json({ error: "La création de la réalisation échouée" })
        }

        return response.status(201).json({ message: "La création de la réalisation a réussi", realisationCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la création", error: error.message })
    }
})
app.get('/api/realisations', async (request, response) => {
    try {
        const realisation = await getAllRealisation()

        if (!realisation) {
            return response.status(404).json({ error: "La récupération de la réalisation a échoué" })
        }

        return response.status(200).json({ message: "La récupération de la réalisation a réussi", realisation })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/realisations/:id', async (request, response) => {
    try {
        const { id } = request.params
        const realisation = await getRealisationById(id)

        if (!realisation) {
            return response.status(404).json({ error: "La récupération de la réalisation a échoué" })
        }

        return response.status(200).json({ message: "La récupération de la réalisation a réussi", realisation })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.patch('/api/realisations/:id', sendImage.single('image'), async (request, response) => {
    try {
        const { id } = request.params
        const dataRealisation = request.body
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataRealisation.image = image.secure_url;
        }
        // if (dataRealisation.titre.trim() === "" && dataRealisation.description.trim() === "" && dataRealisation.secteur.trim() === '') {
        //     return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        // }
        Object.keys(dataRealisation).forEach((key) => {
            if (dataRealisation[key] === '') {
                dataRealisation[key] = null
            }
        })

        const realisationUpdated = await updateRealisation(id, dataRealisation)

        if (!realisationUpdated) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La mise à jour de la réalisation a réussi", realisationUpdated })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message })
    }
})
app.delete('/api/realisations/:id', async (request, response) => {
    try {
        const { id } = request.params

        const realisationDeleted = await deleteRealisation(id)

        if (!realisationDeleted) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La suppression de la réalisation a réussi", realisationDeleted })
    } catch (error) {


        return response.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
    }
})
/** 
 *  ======= Fin route pour realisation. =======
 * 
 */
/** 
 *  ======= Début route pour qualification. =======
 * 
 */
app.post('/api/qualifications', sendImage.single('image'), async (request, response) => {
    try {
        const dataQualification = request.body
        if (!dataQualification.niveau_qualification || dataQualification.niveau_qualification.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const qualificationCreated = await createQualification(dataQualification)

        if (!qualificationCreated) {
            return response.status(404).json({ error: "La création de la qualification échouée" })
        }

        return response.status(201).json({ message: "La création de la qualification a réussi", qualificationCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la création", error: error.message })
    }
})
app.get('/api/qualifications', async (request, response) => {
    try {
        const qualification = await getAllQualification()

        if (!qualification) {
            return response.status(404).json({ error: "La récupération de la qualification a échoué" })
        }

        return response.status(200).json({ message: "La récupération de la qualification a réussi", qualification })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/qualifications/:id', async (request, response) => {
    try {
        const { id } = request.params
        const qualification = await getQualificationById(id)

        if (!qualification) {
            return response.status(404).json({ error: "La récupération de la qualification a échoué" })
        }

        return response.status(200).json({ message: "La récupération de la qualification a réussi", qualification })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.patch('/api/qualifications/:id', sendImage.single('image'), async (request, response) => {
    try {
        const { id } = request.params
        const dataQualification = request.body

        if (!dataQualification.niveau_qualification || dataQualification.niveau_qualification.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const qualificationUpdated = await updateQualification(id, dataQualification)

        if (!qualificationUpdated) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La mise à jour de la qualification a réussi", qualificationUpdated })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message })
    }
})
app.delete('/api/qualifications/:id', async (request, response) => {
    try {
        const { id } = request.params

        const qualificationDeleted = await deletequalification(id)

        if (!qualificationDeleted) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La suppression de la qualification a réussi", qualificationDeleted })
    } catch (error) {

        if (error.code === "23503") {
            return response.status(400).json({
                error: "Impossible de supprimer cette qualification, elle est utilisée par un ou plusieurs personnels."
            });
        }
        return response.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
    }
})
/** 
 *  ======= Fin route pour qualification. =======
 * 
 */
/** 
 *  ======= Début route pour offre. =======
 * 
 */
app.post('/api/offres', sendImage.single('image'), async (request, response) => {

    try {
        const dataOffre = request.body
        if (!dataOffre.titre || dataOffre.titre.trim() === "" || !dataOffre.remise || dataOffre.remise.trim() === "" || !dataOffre.description || dataOffre.description.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataOffre.image = image.secure_url;
        }

        const offreCreated = await createOffre(dataOffre)

        if (!offreCreated) {
            return response.status(404).json({ error: "La création de l'offre échouée" })
        }

        const allUtilisateurs = await getAllUtilisateur()

         if (offreCreated.statut === true) {

            await Promise.all(
                allUtilisateurs.map(utilisateur =>
                    envoyerMailNewOffre(
                        utilisateur.email,
                        utilisateur.email,
                        offreCreated.titre
                    )
                   
                    
                )
            );

            return response.status(201).json({
                message: "Les notifications sur l'offre ont été envoyées avec succès",
                offreCreated
            });
        }

        return response.status(201).json({ message: "La création de l'offre a réussi", offreCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la création", error: error.message })
    }
})
app.get('/api/offres', async (request, response) => {
    try {
        const offre = await getAllOffre()

        if (!offre) {
            return response.status(404).json({ error: "La récupération de l'offre a échoué" })
        }

        return response.status(200).json({ message: "La récupération de l'offre a réussi", offre })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/offres/:id', async (request, response) => {
    try {
        const { id } = request.params
        const offre = await getOffreById(id)

        if (!offre) {
            return response.status(404).json({ error: "La récupération de l'offre a échoué" })
        }

        return response.status(200).json({ message: "La récupération de l'offre a réussi", offre })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.get('/api/offresMois', async (request, response) => {
    try {
        const offre = await getOffreMois()

        if (!offre) {
            return response.status(200).json({ error: "Aucune offre du mois disponible" })
        }

        return response.status(200).json({ message: "La récupération de l'offre a réussi", offre })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
app.patch('/api/offres/:id', sendImage.single('image'), async (request, response) => {

    try {
        const { id } = request.params
        const dataOffre = request.body

        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataOffre.image = image.secure_url;
        }

        Object.keys(dataOffre).forEach((key) => {
            if (dataOffre[key] === '') {
                dataOffre[key] = null
            }
        })

        const offreUpdated = await updateOffre(id, dataOffre)

        if (!offreUpdated) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La mise à jour de l'offre a réussi", offreUpdated })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message })
    }
})
app.delete('/api/offres/:id', async (request, response) => {
    try {
        const { id } = request.params

        const offreDeleted = await deleteOffre(id)

        if (!offreDeleted) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La suppression de l'offre a réussi", offreDeleted })
    } catch (error) {

        return response.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
    }
})
/** 
 *  ======= Fin route pour offre. =======
 * 
 */
/** 
 *  ======= Début route pour metier. =======
 * 
 */
app.post('/api/metiers', sendImage.single('image'), async (request, response) => {
    try {
        const dataMetier = request.body
        if (!dataMetier.titre || dataMetier.titre.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const metierCreated = await createMetier(dataMetier)

        if (!metierCreated) {
            return response.status(404).json({ error: "La création du métier a échoué" })
        }

        return response.status(201).json({ message: "La création du métier a réussi", metierCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la création", error: error.message })
    }
})
app.get('/api/metiers', async (request, response) => {
    try {
        const metier = await getAllMetier()

        if (!metier) {
            return response.status(404).json({ error: "La récupération des métiers a échoué" })
        }

        return response.status(200).json({ message: "La récupération des métiers réussie", metier })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récuperation", error: error.message })
    }
})
app.get('/api/metiers/:id', async (request, response) => {
    try {
        const { id } = request.params
        const metier = await getMetierById(id)

        if (!metier) {
            return response.status(404).json({ error: "La récupération des métiers a échoué" })
        }

        return response.status(200).json({ message: "La récupération des métiers réussie", metier })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récuperation", error: error.message })
    }
})
app.patch('/api/metiers/:id', sendImage.single('image'), async (request, response) => {
    try {
        const { id } = request.params
        const dataMetier = request.body

        if (!dataMetier.titre || dataMetier.titre.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const metierUpdated = await updateMetier(id, dataMetier)

        if (!metierUpdated) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La mise à jour du métier a réussi", metierUpdated })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message })
    }
})
app.delete('/api/metiers/:id', async (request, response) => {
    try {
        const { id } = request.params

        const metierDeleted = await deleteMetier(id)

        if (!metierDeleted) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La suppression du métier a réussi", metierDeleted })
    } catch (error) {
        if (error.code === "23503") {
            return response.status(400).json({
                error: "Impossible de supprimer ce métier, il est utilisé par un ou plusieurs personnels."
            });
        }
        return response.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
    }
})
/** 
 *  ======= Fin des routes pour les métiers. =======
 * 
 */
/** 
 *  ======= Début des routes pour l'historique. =======
 * 
 */
app.post('/api/historiques', sendImage.single('image'), async (request, response) => {
    try {
        const dataHistorique = request.body
        dataHistorique.personnel_id = request.user.id

        if (!dataHistorique.action || !dataHistorique.titre_element || !dataHistorique.personnel_id) {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }


        Object.keys(dataHistorique).forEach((key) => {
            if (dataHistorique[key] === '') {
                dataHistorique[key] = null
            }
        })



        const historiqueCreated = await createHistorique(dataHistorique)

        if (!historiqueCreated) {
            return response.status(404).json({ error: "La création de l'historique échouée" })
        }

        return response.status(201).json({ message: "La création de l'historique a réussi", historiqueCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la création", error: error.message })
    }
})
app.get('/api/historiques', async (request, response) => {
    try {
        const historique = await getAllHistorique()

        if (!historique) {
            return response.status(404).json({ error: "La récupération de l'historique a échoué" })
        }

        return response.status(200).json({ message: "La récupération de l'historique a réussi", historique })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récupération", error: error.message })
    }
})
/** 
 *  ======= Fin route pour historique. =======
 * 
 */
/** 
 *  ======= Début route pour devis. =======
 * 
 */
app.post('/api/devis', sendImage.single('image'), async (request, response) => {
    try {
        const dataDevis = request.body

        if (!dataDevis.nom_complet || dataDevis.nom_complet.trim() === ""
            || !dataDevis.email || dataDevis.email.trim() === ""
            || !dataDevis.telephone || dataDevis.telephone.trim() === ""
            || !dataDevis.details_projet || dataDevis.details_projet.trim() === "" || !dataDevis.secteur || dataDevis.secteur.trim() === '' || !dataDevis.budget || dataDevis.budget.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const devisCreated = await createDevis(dataDevis)

        if (!devisCreated) {
            return response.status(404).json({ error: "La création de devis échouée" })
        }

        return response.status(201).json({ message: "La création de devis reussie", devisCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la création", error: error.message })
    }
})
app.get('/api/devis', async (request, response) => {
    try {
        const devis = await getAllDevis()

        if (!devis) {
            return response.status(404).json({ error: "La récuperation de devis échouée" })
        }

        return response.status(200).json({ message: "La récuperation de devis reussie ", devis })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récuperation", error: error.message })
    }
})
app.get('/api/devis/:id', async (request, response) => {
    try {
        const { id } = request.params
        const devis = await getDevisById(id)

        if (!devis) {
            return response.status(404).json({ error: "La récuperation de devis échouée" })
        }

        return response.status(200).json({ message: "La récuperation de devis reussie ", devis })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récuperation", error: error.message })
    }
})
app.get('/api/devisLimit', async (request, response) => {
    try {
        const devis = await getDevisLimit()

        if (!devis) {
            return response.status(404).json({ error: "La récuperation de devis échouée" })
        }

        return response.status(200).json({ message: "La récuperation de devis reussie ", devis })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récuperation", error: error.message })
    }
})
app.patch('/api/devis/:id', sendImage.single('image'), async (request, response) => {
    try {
        const { id } = request.params
        const dataDevis = request.body

        const devisUpdated = await updateDevis(id, dataDevis)

        const afterUpdatedDevis = await getDevisById(id)

        if(afterUpdatedDevis.statut === true && afterUpdatedDevis.lu === true) {
            await envoyerMailTraitement(afterUpdatedDevis.email, afterUpdatedDevis.nom_complet)
            return response.status(201).json({ message: "La confirmation de l'ecture de devis a été envoyée", devisUpdated })
        }

        if (!devisUpdated) {
            return response.status(404).json({ error: "Non trouvé" })
        }



        return response.status(201).json({ message: "La mise à jour de devis reussie", devisUpdated })
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message })
    }
})
app.delete('/api/devis/:id', async (request, response) => {
    try {
        const { id } = request.params

        const devisDeleted = await deleteDevis(id)

        if (!devisDeleted) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La suppression de devis reussie", devisDeleted })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
    }
})
/** 
 *  ======= Fin route pour devis. =======
 * 
 */
/** 
 *  ======= Début route pour banniere. =======
 * 
 */
app.post('/api/bannieres', sendImage.single('image'), async (request, response) => {
    try {
        const dataBanniere = request.body
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataBanniere.image = image.secure_url;
        }
        if (!dataBanniere.image || !dataBanniere.citation || dataBanniere.citation.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const banniereCreated = await createBanniere(dataBanniere)

        if (!banniereCreated) {
            return response.status(404).json({ error: "La création de la bannière échouée" })
        }

        return response.status(201).json({ message: "La création de la bannière reussie", banniereCreated })

    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la création", error: error.message })
    }
})
app.get('/api/bannieres', async (request, response) => {
    try {
        const bannieres = await getAllBanniere()

        if (!bannieres) {
            return response.status(404).json({ error: "La récuperation de la bannière échouée" })
        }

        return response.status(200).json({ message: "La récuperation de la bannière reussie ", bannieres })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récuperation", error: error.message })
    }
})
app.get('/api/bannieres/:id', async (request, response) => {
    try {
        const { id } = request.params
        const bannieres = await getBanniereById(id)

        if (!bannieres) {
            return response.status(404).json({ error: "La récuperation de la bannière échouée" })
        }

        return response.status(200).json({ message: "La récuperation de la bannière reussie ", bannieres })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la récuperation", error: error.message })
    }
})
app.patch('/api/bannieres/:id', sendImage.single('image'), async (request, response) => {
    try {
        const { id } = request.params
        const dataBanniere = request.body

        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataBanniere.image = image.secure_url;
        }



        if (!dataBanniere.citation || dataBanniere.citation.trim() === "") {
            return response.status(400).json({ error: "Remplissez les champs obligatoires (*)" })
        }

        const banniereUpdated = await updateBanniere(id, dataBanniere)

        if (!banniereUpdated) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La mise à jour de la bannière reussie", banniereUpdated })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message })
    }
})
app.delete('/api/bannieres/:id', async (request, response) => {
    try {
        const { id } = request.params

        const banniereDeleted = await deleteBanniere(id)

        if (!banniereDeleted) {
            return response.status(404).json({ error: "Non trouvé" })
        }

        return response.status(201).json({ message: "La suppression de la bannière reussie", banniereDeleted })
    } catch (error) {
        return response.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
    }
})
/** 
 *  ======= Fin route pour banniere. =======
 * 
 */
/** 
 *  ======= Début route pour le personnel. =======
 * 
 */
app.post('/api/personnels', sendImage.single('image'), async (request, response) => {

    try {
        // Validation des données du personnel
        const error = validatePersonnelData(request.body);
        if (error.length > 0) {
            return response.status(400).json({ error });
        }
        // Récupération des données du personnel depuis le corps de la requête
        const dataPersonnel = request.body;
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataPersonnel.image = image.secure_url;
        }

        // Validation des champs obligatoires
        if (
            !dataPersonnel.nom_complet || !dataPersonnel.date_de_naissance || !dataPersonnel.ville_de_naissance || !dataPersonnel.pays_de_naissance ||
            !dataPersonnel.sexe || !dataPersonnel.adresse || !dataPersonnel.ville || !dataPersonnel.pays || !dataPersonnel.email || !dataPersonnel.telephone || !dataPersonnel.annee_experience ||
            !dataPersonnel.code_personnel || !dataPersonnel.date_embauche || !dataPersonnel.salaire || !dataPersonnel.image
        ) {
            return response.status(400).json({ error: 'Remplissez les champs obligatoires (*)' });
        }


        const personnelExiste = await getPersonnelByEmail(dataPersonnel.email);

        if (personnelExiste) {
            return response.status(400).json({ error: 'Un personnel avec cet email existe déjà' });
        }

        Object.keys(dataPersonnel).forEach((key) => {
            if (dataPersonnel[key] === '') {
                dataPersonnel[key] = null
            }
        })

        const personnel = await createPersonnel(dataPersonnel);

        if (!personnel) {
            return response.status(400).json({ error: 'Creation du personnel échouée' });
        }

        return response.status(201).json({ message: 'Personnel créé avec succès', personnel });

    } catch (error) {

        return response.status(500).json({ message: 'Erreur lors de la création du personnel', error: error.message });
    }
})
app.get('/api/personnels', async (request, response) => {
    try {
        const personnels = await getAllPersonnels();

        if (!personnels || personnels.length === 0) {
            return response.status(404).json({ error: 'Aucun personnel trouvé' });
        }

        return response.status(200).json({ message: 'Personnels récupérés avec succès', personnels });

    } catch (error) {
        return response.status(500).json({ message: 'Erreur lors de la récupération des personnels', error: error.message });
    }
})
app.get('/api/personnels/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const personnel = await getPersonnelById(id);

        if (!personnel) {
            return response.status(404).json({ error: 'Personnel non trouvé' });
        }

        return response.status(200).json({ message: 'Personnel récupéré avec succès', personnel });

    } catch (error) {
        return response.status(500).json({ message: 'Erreur lors de la récupération du personnel', error: error.message });
    }
})
app.patch('/api/personnels/:id', sendImage.single('image'), async (request, response) => {
    try {
        const { id } = request.params;
        const dataPersonnel = { ...request.body };
        // console.log("BODY :", request.body);

        // console.log("Données reçues :", dataPersonnel);

        // Validation
        const errors = validateUpdatePersonnel(dataPersonnel);
        // console.log("ERREURS VALIDATION :", errors);

        if (errors.length > 0) {
            return response.status(400).json({
                errors
            });
        }

        // Vérifier l'email uniquement s'il est modifié
        if (dataPersonnel.email) {
            const personnelExist = await getPersonnelByEmail(dataPersonnel.email);

            if (personnelExist && personnelExist.id != id) {
                return response.status(400).json({
                    error: 'Un personnel avec cet email existe déjà'
                });
            }
        }

        // Nouvelle image
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataPersonnel.image = image.secure_url;
        }

        // Transformer les champs vides en null
        Object.keys(dataPersonnel).forEach((key) => {
            if (dataPersonnel[key] === '') {
                dataPersonnel[key] = null;
            }
        });

        // Vérifier qu'il y a réellement une modification
        if (Object.keys(dataPersonnel).length === 0) {
            return response.status(400).json({
                error: 'Aucune modification faite.'
            });
        }

        const personnel = await updatePersonnel(id, dataPersonnel);

        if (!personnel) {
            return response.status(404).json({
                error: 'Personnel non trouvé'
            });
        }

        return response.status(200).json({
            message: 'Personnel mis à jour avec succès',
            personnel
        });

    } catch (error) {
        console.error("Erreur modification personnel :", error);

        return response.status(500).json({
            message: 'Erreur lors de la mise à jour du personnel',
            error: error.message
        });
    }
});
app.delete('/api/personnels/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const personnel = await deletePersonnel(id);

        if (!personnel) {
            return response.status(404).json({ error: 'Non trouvé' });
        }

        return response.status(200).json({ message: 'Personnel supprimé avec succès', personnel });

    } catch (error) {
        return response.status(500).json({ message: 'Erreur lors de la suppression du personnel', error: error.message });
    }
})
/** 
 *  ======= Fin route pour le personnel. =======
 * 
 */
/** 
 *  ======= Début route pour l'actualité. =======
 * 
 */
app.post('/api/actualites', sendImage.single('image'), async (request, response) => {
    try {

        const dataActualite = request.body
        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataActualite.image = image.secure_url;
        }

        if (!dataActualite.image || !dataActualite.secteur || !dataActualite.titre || !dataActualite.contenu) {
            return response.status(400).json({ error: 'Remplissez les champs obligatoires (*)' });
        }

        const actualiteCreated = await createActualite(dataActualite)

        if (!actualiteCreated) {
            return response.status(400).json({ error: 'Creation de l\'actualité échouée' });
        }

        const allUtilisateurs = await getAllUtilisateur()

        if (actualiteCreated.statut === true) {
            await Promise.all(
                allUtilisateurs.map(utilisateur => {
                    envoyerMailNewActualite(
                        utilisateur.email,
                        utilisateur.email,
                        actualiteCreated.titre
                    )
                })
            );

            return response.status(201).json({
                message: "Les notifications sur la publication ont été envoyées avec succès",
                actualiteCreated
            });
        }

        return response.status(201).json({ message: "Création de l'actualité réussie", actualiteCreated })
    } catch (error) {
        return response.status(500).json({ message: 'Erreur lors de la création de l\'actualité', error: error.message });
    }
})
app.get('/api/actualites', async (request, response) => {
    try {
        const actualite = await getAllActualites()



        return response.status(200).json({ message: "actualité trouvée", actualite })
    } catch (error) {
        return response.status(500).json({ error: 'Erreur lors de la récupération des actualités', error: error.message });
    }
})
app.get('/api/actualites/:id', async (request, response) => {
    try {
        const { id } = request.params
        const actualite = await getActualiteById(id)

        if (!actualite || actualite.length === 0) {
            return response.status(404).json({ error: "Aucune actualité trouvée" })
        }

        return response.status(200).json({ message: "actualité trouvée", actualite })
    } catch (error) {
        return response.status(500).json({ error: 'Erreur lors de la récupération des actualités', error: error.message });
    }
})
app.get('/api/actualitesLimit', async (request, response) => {
    try {
        const actualites = await getActualitesLimit()

        if (!actualites || actualites.length === 0) {
            return response.status(404).json({ error: "Aucune actualité trouvée" })
        }

        return response.status(200).json({ message: "actualité trouvée", actualites })
    } catch (error) {
        return response.status(500).json({ error: 'Erreur lors de la récupération des actualités', error: error.message });
    }
})
app.patch('/api/actualites/:id', sendImage.single('image'), async (request, response) => {
    try {
        const { id } = request.params

        const dataActualite = request.body

        if (request.file) {
            const image = await uploadImage(request.file.buffer);
            
            dataActualite.image = image.secure_url;
        }

        if (dataActualite.secteur.trim() === '' && dataActualite.titre.trim() === '' && dataActualite.contenu.trim() === '' && dataActualite.statut.trim() === '') {
            return response.status(400).json({ error: 'Remplissez les champs obligatoires (*)' });
        }

        Object.keys(dataActualite).forEach((key) => {
            if (dataActualite[key] === '') {
                dataActualite[key] = null
            }
        })

        const actualiteUpdated = await updateActualite(id, dataActualite)
        if (!actualiteUpdated) {
            return response.status(404).json({ message: "Non trouvé" })
        }

        return response.status(201).json({ message: "Modification a réussie.", actualiteUpdated })

    } catch (error) {
        return response.status(500).json({ error: 'Erreur lors de la modification de l\'actualités', error: error.message });
    }
})
app.delete('/api/actualites/:id', async (request, response) => {
    try {
        const { id } = request.params

        const actualiteDeleted = await deleteActualite(id)

        if (!actualiteDeleted) {
            return response.status(400).json({ error: "Non trouvé" })
        }

        return response.status(200).json({ message: "Suppression a réussie." })
    } catch (error) {
        return response.status(500).json({ error: 'Erreur lors de la suppression de l\'actualités', error: error.message });
    }
})
/** 
 *  ======= Fin route pour l'actualité. =======
 * 
 */


/** 
 *  ======= Début route pour les pages. =======
 * 
 */
// ========== home - visiteurs ==========
app.get('/', async (request, response) => {
    const image = "https://mc-bat.onrender.com/assets/mc-bat.png";

    response.render('home', {
        title: 'Accueil',
        currentPage: '/',
        image: image
    });
});
// ========== actualités - visiteurs ==========
app.get('/visiteurs/actualites/liste', async (request, response) => {
const image =  "https://mc-bat.onrender.com/assets/mc-bat.png";

    response.render('actualites-liste',
        {
            layout: "main",
            title: "Liste des actualités",
            currentPage: "actualites-liste",
            image: image,
            styles: ["actualites.css"],
            scripts: ["actualites.js"]
        }
    )
})
// ========== informations légales - visiteurs ==========
app.get('/visiteurs/mentions-legales', (request, response) => {
    const image = "https://mc-bat.onrender.com/assets/mc-bat.png";
    response.render('mentions-legales', {
        layout: 'main',
        title: 'Mentions légales',
        currentPage: 'mentions-legales',
        image:image,
        styles: ['services.css']
    })
})

app.get('/visiteurs/confidentialite', (request, response) => {
    const image = "https://mc-bat.onrender.com/assets/mc-bat.png";

    response.render('confidentialite', {
        layout: 'main',
        title: 'Politique de confidentialité',
        currentPage: 'confidentialite',
        image:image,
        styles: ['services.css']
    })
})
// ========== actualités - visiteurs ==========
app.get('/visiteurs/actualites/lectures', async (request, response) => {

    const idActualite = request.query.id

    const actualites = await getActualiteById(idActualite)

    const actualite = {
        ...actualites,
        date: actualites.created_at.toISOString().split('T')[0]
    }

    const image = actualite.image
    ? actualite.image
    : "https://mc-bat.onrender.com/assets/mc-bat.png";

    response.render('actualite-lectures',
        {
            layout: "main",
            title: actualite.titre,
            description: actualite.contenu,
            image: image,
            url: `/visiteurs/actualites/lectures?id=${actualite.id}`,

            currentPage: "actualite-lectures",
            actualite,
            styles: ["actualites.css"],
            scripts: ["actualites.js"]
        }
    )
})
// ========== devis - visiteurs ==========
app.get('/visiteurs/devis/demandes', async (request, response) => {
    const image =  "https://mc-bat.onrender.com/assets/mc-bat.png";
    response.render('devis-demande',
        {
            layout: "main",
            title: "Demande de devis",
            currentPage: "devis-demande",
            image: image,
            styles: ["devis.css"],
            scripts: ["devis.js"]
        }
    )
})
// ========== Réalisations - visiteurs ==========
app.get('/visiteurs/realisations/liste', async (request, response) => {
const image =  "https://mc-bat.onrender.com/assets/mc-bat.png";
    response.render('realisations',
        {
            layout: "main",
            title: "Liste de nos réalisations",
            currentPage: "realisations",
            image: image,
            styles: ["realisations.css"],
            scripts: ["realisations.js"]
        }
    )
})
// ========== Lecture des réalisations - visiteurs ==========
app.get('/visiteurs/realisations/lectures', async (request, response) => {

    const idRealisation = request.query.id

    const realisations = await getRealisationById(idRealisation)

    const realisation = {
        ...realisations,
        date: realisations.created_at.toISOString().split('T')[0]
    }

    if (!realisation) {
        return response.status(404).json({ error: "Aucune réalisation trouvée" })
    }

    const image = realisation.image
    ? realisation.image
    : "https://mc-bat.onrender.com/assets/mc-bat.png";
    response.render('lecture-realisations',
        {
            layout: "main",
            title: realisation.titre,
            description: realisation.description,
            image: image,
            url: `/visiteurs/realisations/lectures?id=${realisation.id}`,

            currentPage: "lecture-realisations",
            realisation,
            styles: ["realisations.css"],
            scripts: ["realisations.js"]
        }
    )
})
// ========== services - visiteurs ==========
app.get('/visiteurs/services/lectures', async (request, response) => {
const image =  "https://mc-bat.onrender.com/assets/mc-bat.png";
    response.render('services',
        {
            layout: "main",
            title: "Nos services",
            currentPage: "services",
            image: image,
            styles: ["services.css"],
            scripts: ["services.js"]
        }
    )
})
// ========== prix du marché - visiteurs ==========
app.get('/visiteurs/meilleurs/marches/prix', async (request, response) => {
const image =  "https://mc-bat.onrender.com/assets/mc-bat.png";
    response.render('marches-prix',
        {
            layout: "main",
            title: "Meilleurs prix du marché",
            currentPage: "marches-prix",
            description: "Liste complète de nos matériaux",
            image: image,
            styles: ["marches.css"],
            scripts: ["marches.js"]
        }
    )
})
// ========== Offre spéciale du mois - visiteurs ==========
app.get('/visiteurs/speciale/offres/mois', async (request, response) => {

    const offre = await getOffreMois()

    const image = offre.image
    ? offre.image
    : "https://mc-bat.onrender.com/assets/mc-bat.png";

    response.render('offres',
        {
            layout: "main",
             title: offre.titre,
            description: offre.description,
            image: image,
            url: `/visiteurs/speciale/offres/mois`,
            currentPage: "offres",
            styles: ["offres.css"],
            scripts: ["offres.js"]
        }
    )
})

// ========== personnels ==========
app.get('/personnels/dashboard', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    
    

    const personnelCount = await countPersonnel()
    const serviceCount = await countService()
    const actualiteCount = await countActualite()
    const devisCount = await countDevis()
    const utilisateurCount = await countUtilisateur()




    response.render('personnels/dashboard',
        {
            layout: "personnels",
            personnelCount,
            serviceCount,
            actualiteCount,
            devisCount,
            utilisateurCount,
            userConnecter,
            title: "Tableau de bord",
            currentPage: "dashboard",
            styles: ["personnels/dashboard.css"],
        }
    )
})
app.get('/personnels/actualites', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/actualites',
        {
            layout: "personnels",
            title: "Actualités",
            currentPage: "actualites",
            userConnecter,
            styles: ["personnels/actualites.css"],
            scripts: ["personnels/actualites.js"]
        }
    )
})
app.get('/personnels/realisations', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/realisations',
        {
            layout: "personnels",
            title: "Réalisations",
            currentPage: "realisations",
            userConnecter,
            styles: ["personnels/realisations.css"],
            scripts: ["personnels/realisations.js"]
        }
    )
})
app.get('/personnels/services', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/services',
        {
            layout: "personnels",
            title: "Services",
            currentPage: "services",
            userConnecter,
            styles: ["personnels/services.css"],
            scripts: ["personnels/services.js"]
        }
    )
})
app.get('/personnels/devis', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/devis',
        {
            layout: "personnels",
            title: "Devis",
            currentPage: "devis",
            userConnecter,
            styles: ["personnels/devis.css"],
            scripts: ["personnels/devis.js"]
        }
    )
})
app.get('/personnels/marches', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/marches',
        {
            layout: "personnels",
            title: "Prix du marché",
            currentPage: "marches",
            userConnecter,
            styles: ["personnels/marches.css"],
            scripts: ["personnels/marches.js"]
        }
    )
})
app.get('/personnels/metiers', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/metiers',
        {
            layout: "personnels",
            title: "Metiers",
            currentPage: "metiers",
            userConnecter,
            styles: ["personnels/metiers.css"],
            scripts: ["personnels/metiers.js"]
        }
    )
})
app.get('/personnels/qualifications', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/qualifications',
        {
            layout: "personnels",
            title: "Niveau",
            currentPage: "qualifications",
            userConnecter,
            styles: ["personnels/qualifications.css"],
            scripts: ["personnels/qualifications.js"]
        }
    )
})
app.get('/personnels/offres', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/offres',
        {
            layout: "personnels",
            title: "Offres",
            currentPage: "offres",
            userConnecter,
            styles: ["personnels/offres.css"],
            scripts: ["personnels/offres.js"]
        }
    )
})
app.get('/personnels/personnels', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/personnels',
        {
            layout: "personnels",
            title: "Personnels",
            currentPage: "personnels",
            userConnecter,
            styles: ["personnels/personnels.css"],
            scripts: ["personnels/personnels.js"]
        }
    )
})
app.get('/personnels/utilisateurs', estConnecte, async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/utilisateurs',
        {
            layout: "personnels",
            title: "Utilisateurs",
            currentPage: "utilisateurs",
            userConnecter,
            styles: ["personnels/utilisateurs.css"],
            scripts: ["personnels/utilisateurs.js"]
        }
    )
})
app.get('/personnels/bannieres', async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/bannieres',
        {
            layout: "personnels",
            title: "Bannières",
            currentPage: "bannieres",
            userConnecter,
            styles: ["personnels/bannieres.css"],
            scripts: ["personnels/bannieres.js"]
        }
    )
})
app.get('/personnels/historiques', async (request, response) => {

    const idUser = request.user.id
    const userConnecter = await getPersonnelById(idUser)

    response.render('personnels/historiques',
        {
            layout: "personnels",
            title: "Historiques",
            currentPage: "historiques",
            userConnecter,
            styles: ["personnels/historiques.css"],
            scripts: ["personnels/historiques.js"]
        }
    )
})
/** 
 *  ======= Fin route pour les pages. =======
 * 
 */

/** 
 *  ======= Début route pour connexion et deconnexion. =======
 * 
 */

// Page login
app.get('/page/login', async (request, response) => {

    response.render('login', {
        layout: 'main',
        title: 'Page de connexion',
        currentPage: "login",
        styles: ["login.css"],
        scripts: ["login.js"]

    })
})

app.post('/api/connexion', sendImage.single('image'), async (request, response, next) => {
    // On lance l'authentification avec passport.js

    try {

        const { email, mot_de_passe } = request.body;

        if (!email || email.trim() === "" || !mot_de_passe || mot_de_passe.trim() === "") {
            return response.status(400).json({
                error: "Veuillez remplir tous les champs obligatoires (*)"
            });
        }

        passport.authenticate('local', (error, user, info) => {

            if (error) {
                // S'il y a une erreur, on laisse Express la 
                // gérer


                next(error)

            } else if (!user) {
                // Si la connexion échoue, on envoie
                // l'information au client avec un code
                // 401 (Unauthorized)

                response.status(401).json({error: info.message || "Email ou mot de passe incorrect"});
            } else {
                 // Vérification du rôle et du statut
                if (user.role !== "Administrateur" || user.statut !== true) {
                    return response.status(403).json({
                        error: "Accès réservé aux administrateurs actifs"
                    });
                }
                // Si tout fonctionne, on ajoute
                // l'utilisateur dans la session et on 
                // retourne un code 200 (OK)
                request.logIn(user, (error) => {
                    if (error) {
                        // On laisse Express gérer l'erreur
                        next(error);
                        // return response.status(400).json({message: "Connexion échouée!"})
                    }

                    return response.status(200).json({ message: "Connexion réussie !" })


                })
            }
        })(request, response, next)
    } catch (error) {
        return next(error);
    }
})
app.post('/api/deconnexion', async (request, response, next) => {
    // Déconnecter l'utilisateur
    request.logOut((error) => {
        if (error) {
            // On laisse Express gérer l'erreur
            next(error);
        } else {
            // Indiquer que la déconnexion a réussi
            response.status(200).json({ message: "Déconnexion réussie" });
        }
    })
})
/** 
 *  ======= Fin route pour inscription, connexion et deconnexion. =======
 * 
 */

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server est en cours d'exécution sur le port ${PORT}`);
});