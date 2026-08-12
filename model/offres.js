import pool from "../db/config.js";

/**
 * Création d'une offre
 * @param {object} dataOffre 
 * @returns {object}
 */
export const createOffre = async (dataOffre) => {

    const result = await pool.query(
        `
            INSERT INTO offres (titre, remise, description, statut, image, prix) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `, [
            dataOffre.titre, dataOffre.remise, dataOffre.description, dataOffre.statut, dataOffre.image, dataOffre.prix]
    )

    return result.rows[0];
}

/**
 * Récupération des offres
 * @returns {Array}
 */
export const getAllOffre = async () => {

    const result = await pool.query(
        `
            SELECT * FROM offres ORDER BY created_at DESC
        `
    )

    return result.rows;
}

/**
 * Récupération des offres statut true
 * @returns {Array}
 */
export const getAllOffreStatutTrue = async () => {

    const result = await pool.query(
        `
            SELECT * FROM offres WHERE statut = true ORDER BY created_at DESC
        `
    )

    return result.rows;
}
/**
 * Récupération des offres
 * @returns {Array}
 */
export const getOffreById = async (id) => {

    const result = await pool.query(
        `
            SELECT * FROM offres WHERE id = $1
        `, [id]
    )

    return result.rows[0];
}
/**
 * Récupération des offres du mois
 * @returns {Array}
 */
export const getOffreMois = async () => {

    const result = await pool.query(
        `
            SELECT * FROM offres 
            WHERE statut = true AND created_at >= DATE_TRUNC('month', CURRENT_DATE) 
            AND created_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
            ORDER BY created_at DESC LIMIT 1
        `
    )

    return result.rows[0];
}


/**
 * Mise à jour d'une offre
 * @param {number} id 
 * @param {object} dataOffre 
 * @returns {object}
 */
export const updateOffre = async (id, dataOffre) => {

    const result = await pool.query(
        `
            UPDATE offres SET titre = COALESCE ($1, titre), remise = COALESCE($2, remise), description = COALESCE($3, description), 
            statut = COALESCE($4, statut), image = COALESCE($5, image), prix = COALESCE($6, prix)
             WHERE id = $7 RETURNING *
        `, [
            dataOffre.titre, dataOffre.remise, dataOffre.description, dataOffre.statut, dataOffre.image, dataOffre.prix, id]
    )

    return result.rows[0]
}

/**
 * Suppression d'une offre
 * @param {number} id 
 * @returns {object}
 */
export const deleteOffre= async (id) => {

    const result =await pool.query(
        `
            DELETE FROM offres WHERE id = $1 RETURNING *
        `, [id]
    )

    return result.rows[0]
}

