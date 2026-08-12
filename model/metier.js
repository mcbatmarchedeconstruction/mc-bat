import pool from "../db/config.js";

/**
 * Création d'un métier
 * @param {object} dataMetier 
 * @returns {object}
 */
export const createMetier = async (dataMetier) => {

    const result = await pool.query(
        `
            INSERT INTO metiers (titre) VALUES ($1) RETURNING *
        `, [dataMetier.titre]
    )

    return result.rows[0];
}

/**
 * Récupération des métiers
 * @returns {Array}
 */
export const getAllMetier = async () => {

    const result = await pool.query(
        `
            SELECT * FROM metiers ORDER BY created_at DESC
        `
    )

    return result.rows;
}

/**
 * Récupération des métiers
 * @returns {Array}
 */
export const getMetierById = async (id) => {

    const result = await pool.query(
        `
            SELECT * FROM metiers WHERE id =$1
        `, [id]
    )

    return result.rows[0];
}


/**
 * Mise à jour d'un métier
 * @param {number} id 
 * @param {object} dataMetier 
 * @returns {object}
 */
export const updateMetier= async (id, dataMetier) => {

    const result = await pool.query(
        `
            UPDATE metiers SET titre = COALESCE($1, titre)
             WHERE id = $2 RETURNING *
        `, [ dataMetier.titre, id]
    )

    return result.rows[0]
}

/**
 * Suppression d'un métier
 * @param {number} id 
 * @returns {object}
 */
export const deleteMetier= async (id) => {

    const result =await pool.query(
        `
            DELETE FROM metiers WHERE id = $1 RETURNING *
        `, [id]
    )

    return result.rows[0]
}

