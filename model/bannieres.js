import pool from "../db/config.js";

/**
 * Création d'une bannière
 * @param {object} dataBanniere 
 * @returns {object}
 */
export const createBanniere = async (dataBanniere) => {

    const countBanniere = await pool.query(`SELECT COUNT(*) FROM bannieres`)
    const total = Number(countBanniere.rows[0].count)

    if (total >= 3) {
        throw new Error("Vous ne pouvez pas créer plus de 3 bannières.");
        
    }

    const result = await pool.query(
        `
            INSERT INTO bannieres (image, citation) VALUES ($1, $2) RETURNING *
        `, [dataBanniere.image, dataBanniere.citation]
    )

    return result.rows[0];
}

/**
 * Récuperaton des bannières
 * @returns {Array}
 */
export const getAllBanniere = async () => {

    const result = await pool.query(
        `
            SELECT * FROM bannieres ORDER BY created_at DESC 
        `
    )

    return result.rows;
}

/**
 * Récuperaton des bannières par id
 * @returns {Array}
 */
export const getBanniereById = async (id) => {

    const result = await pool.query(
        `
            SELECT * FROM bannieres WHERE id=$1
        `, [id]
    )

    return result.rows[0];
}


/**
 * Mise à jour d'une bannière
 * @param {number} id 
 * @param {object} dataBanniere 
 * @returns {object}
 */
export const updateBanniere = async (id, dataBanniere) => {

    const result = await pool.query(
        `
            UPDATE bannieres SET image = COALESCE($1, image), citation = COALESCE($2, citation), statut = COALESCE($3, statut)
             WHERE id = $4 RETURNING *
        `, [ dataBanniere.image, dataBanniere.citation, dataBanniere.statut, id]
    )

    return result.rows[0]
}

/**
 * Suppression d'une bannière
 * @param {number} id 
 * @returns {object}
 */
export const deleteBanniere= async (id) => {

    const result =await pool.query(
        `
            DELETE FROM bannieres WHERE id = $1 RETURNING *
        `, [id]
    )

    return result.rows[0]
}
