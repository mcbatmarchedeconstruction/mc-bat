-- DROP TABLE IF EXISTS actualites, offres, devis, realisations, services, bannieres, metiers, qualifications, personnels, utilisateurs, historiques CASCADE;
/* Creation des tables **/
CREATE TABLE IF NOT EXISTS actualites(

    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    secteur VARCHAR(255) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    statut BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offres (

    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    prix VARCHAR(255) NOT NULL,
    remise VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    statut BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ALTER TABLE offres
-- ADD COLUMN IF NOT EXISTS image TEXT,
-- ADD COLUMN IF NOT EXISTS prix VARCHAR(255);

CREATE TABLE IF NOT EXISTS devis(

    id SERIAL PRIMARY KEY,
    nom_complet VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(255) NOT NULL,
    details_projet TEXT NOT NULL,
    secteur VARCHAR(255) NOT NULL,
    budget VARCHAR(255) NOT NULL,
    statut BOOLEAN DEFAULT TRUE,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ALTER TABLE devis ADD COLUMN IF NOT EXISTS lu BOOLEAN DEFAULT FALSE;
CREATE TABLE IF NOT EXISTS marches(

    id SERIAL PRIMARY KEY,
    produit VARCHAR(255) NOT NULL,
    details_produit TEXT NOT NULL,
    prix VARCHAR(255) NOT NULL,
    statut BOOLEAN DEFAULT TRUE,
    image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS realisations(

    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    secteur VARCHAR(255) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    statut BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services(

    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    titre VARCHAR(225) NOT NULL,
    description TEXT NOT NULL,
    statut BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS bannieres(

    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    citation VARCHAR(255) NOT NULL,
    statut BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS metiers(

    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS qualifications(

    id SERIAL PRIMARY KEY,
    niveau_qualification VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATe TABLE IF NOT EXISTS personnels(

    id SERIAL PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    nom_complet VARCHAR(255) NOT NULL,
    date_de_naissance DATE NOT NULL,
    ville_de_naissance VARCHAR(255) NOT NULL,
    pays_de_naissance VARCHAR(255) NOT NULL,
    sexe VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    ville VARCHAR(255) NOT NULL,
    pays VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mot_de_passe VARCHAR(255) DEFAULT NULL,
    telephone VARCHAR(225) NOT NULL,
    metier_id INTEGER REFERENCES metiers(id),
    qualification_id INTEGER REFERENCES qualifications(id),
    annee_experience INTEGER NOT NULL,
    code_personnel VARCHAR(255) NOT NULL,
    date_embauche DATE NOT NULL,
    date_fin_contrat DATE DEFAULT NULL,
    salaire NUMERIC(10, 2) NOT NULL,
    image TEXT NOT NULL,
    statut BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ALTER TABLE personnels ADD COLUMN IF NOT EXISTS mot_de_passe VARCHAR(255) DEFAULT NULL;

CREATE TABLE IF NOT EXISTS utilisateurs(

    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS historiques(

    id SERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    titre_element VARCHAR(255) NOT NULL,
    personnel_id INTEGER REFERENCES personnels(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

