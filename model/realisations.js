import pool from "../db/config.js";

/**
 * Création d'une réalisation
 * @param {object} dataRealisation 
 * @returns {object}
 */
export const createRealisation = async (dataRealisation) => {

    const result = await pool.query(
        `
            INSERT INTO realisations (image, secteur, titre, description, statut) VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [dataRealisation.image, dataRealisation.secteur, 
            dataRealisation.titre, dataRealisation.description, dataRealisation.statut]
    )

    return result.rows[0];
}

/**
 * Récupération des réalisations
 * @returns {Array}
 */
export const getAllRealisation = async () => {

    const result = await pool.query(
        `
            SELECT * FROM realisations ORDER BY created_at DESC
        `
    )

    return result.rows;
}
/**
 * Récupération des réalisations statut true
 * @returns {Array}
 */
export const getAllRealisationStatutTrue = async () => {

    const result = await pool.query(
        `
            SELECT * FROM realisations WHERE statut = true ORDER BY created_at DESC
        `
    )

    return result.rows;
}

/**
 * Récupération des réalisations
 * @returns {Array}
 */
export const getRealisationById = async (id) => {

    const result = await pool.query(
        `
            SELECT * FROM realisations WHERE id = $1
        `, [id]
    )

    return result.rows[0];
}


/**
 * Mise à jour d'une réalisation
 * @param {number} id 
 * @param {object} dataRealisation 
 * @returns {object}
 */
export const updateRealisation = async (id, dataRealisation) => {

    const result = await pool.query(
        `
            UPDATE realisations SET image = COALESCE($1, image),  secteur = COALESCE($2, secteur), titre = COALESCE($3, titre), description = COALESCE($4, description), statut = COALESCE($5, statut)
             WHERE id = $6 RETURNING *
        `, [dataRealisation.images, dataRealisation.secteur, 
            dataRealisation.titre, dataRealisation.description, dataRealisation.statut, id]
    )

    return result.rows[0]
}

/**
 * Suppression d'une réalisation
 * @param {number} id 
 * @returns {object}
 */
export const deleteRealisation = async (id) => {

    const result =await pool.query(
        `
            DELETE FROM realisations WHERE id = $1 RETURNING *
        `, [id]
    )

    return result.rows[0]
}

