import pool from '../db/config.js';
import bcrypt from 'bcrypt';

/**
 * Crée un nouvel personnel dans la base de données.
 * @param {object} dataPersonnel 
 * @returns {object} personnel
 */
export const createPersonnel  = async (dataPersonnel) => {
    
    const mot_de_passe = dataPersonnel.mot_de_passe ? await bcrypt.hash(dataPersonnel.mot_de_passe, 10) : null;

    const result = await pool.query(`
        INSERT INTO personnels (role, nom_complet, date_de_naissance, ville_de_naissance, pays_de_naissance, sexe, adresse, ville,
        pays, email, telephone, metier_id, qualification_id, annee_experience, code_personnel, date_embauche, date_fin_contrat, salaire,
        image, statut, mot_de_passe) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`, 
        [dataPersonnel.role, dataPersonnel.nom_complet, dataPersonnel.date_de_naissance, dataPersonnel.ville_de_naissance, dataPersonnel.pays_de_naissance, dataPersonnel.sexe, dataPersonnel.adresse, dataPersonnel.ville,
        dataPersonnel.pays, dataPersonnel.email, dataPersonnel.telephone, dataPersonnel.metier_id, dataPersonnel.qualification_id, dataPersonnel.annee_experience, dataPersonnel.code_personnel, dataPersonnel.date_embauche, dataPersonnel.date_fin_contrat, dataPersonnel.salaire,
        dataPersonnel.image, dataPersonnel.statut, mot_de_passe]);
    
    return result.rows[0];

}

/** * Récupère tous les personnels de la base de données.
 * @returns {Array} Liste des personnels
 */
export const getAllPersonnels = async () => {

    const result = await pool.query(`
        SELECT * FROM personnels ORDER BY created_at DESC
    `)

    return result.rows;
}

/** * Récupère un personnel spécifique par son ID.
 * @param {number} id - L'ID du personnel à récupérer.
 * @returns {object} Le personnel correspondant ou null si non trouvé.
 */
export const getPersonnelById = async (id) => {

    const result = await pool.query(`
        SELECT * FROM personnels WHERE id = $1
    `, [id])

    return result.rows[0];
}

export const getPersonnelByEmail = async (email) => {
    const result = await pool.query(`
        SELECT * FROM personnels WHERE email = $1
    `, [email])

    return result.rows[0];
}

/** * Met à jour un personnel existant dans la base de données.
 * @param {number} id 
 * @param {object} dataPersonnel 
 * @returns {object} personnel
 */
export const updatePersonnel = async (id, dataPersonnel) => {

    const mot_de_passe = dataPersonnel.mot_de_passe ? await bcrypt.hash(dataPersonnel.mot_de_passe, 10) : null;

    const result = await pool.query(`
        UPDATE personnels SET 
        role = COALESCE($1, role), nom_complet = COALESCE($2, nom_complet), date_de_naissance = COALESCE($3, date_de_naissance),
        ville_de_naissance = COALESCE($4, ville_de_naissance), pays_de_naissance = COALESCE($5, pays_de_naissance), 
        sexe = COALESCE($6, sexe), adresse = COALESCE($7, adresse), ville = COALESCE($8, ville), pays = COALESCE($9, pays), 
        email = COALESCE($10, email), telephone = COALESCE($11, telephone), metier_id = COALESCE($12, metier_id), 
        qualification_id = COALESCE($13, qualification_id), annee_experience = COALESCE($14, annee_experience), 
        code_personnel = COALESCE($15, code_personnel), date_embauche = COALESCE($16, date_embauche), 
        date_fin_contrat = COALESCE($17, date_fin_contrat), salaire = COALESCE($18, salaire), 
        image = COALESCE($19, image), statut = COALESCE($20, statut), mot_de_passe = COALESCE($21, mot_de_passe) WHERE id = $22 RETURNING *`, 
        
        [dataPersonnel.role, dataPersonnel.nom_complet, dataPersonnel.date_de_naissance, dataPersonnel.ville_de_naissance, dataPersonnel.pays_de_naissance, dataPersonnel.sexe, dataPersonnel.adresse, dataPersonnel.ville,
        dataPersonnel.pays, dataPersonnel.email, dataPersonnel.telephone, dataPersonnel.metier_id, dataPersonnel.qualification_id, dataPersonnel.annee_experience, dataPersonnel.code_personnel, dataPersonnel.date_embauche, dataPersonnel.date_fin_contrat, dataPersonnel.salaire,
        dataPersonnel.image, dataPersonnel.statut, mot_de_passe, id]);

    return result.rows[0];
}

/** * Supprime un personnel de la base de données.
 * @param {number} id 
 * @returns {object} personnel
 */
export const deletePersonnel = async (id) => {

    const result = await pool.query(`
        DELETE FROM personnels WHERE id = $1 RETURNING *
    `, [id]);

    return result.rows[0];
}
export const countPersonnel = async () => {
    const result = await pool.query(
        `
            SELECT COUNT(*) FROM personnels
        `
    )

    return Number(result.rows[0].count)
}