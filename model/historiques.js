import pool from "../db/config.js";

/**
 * Création d'un historique
 * @param {object} dataHistorique 
 * @returns {object}
 */
export const createHistorique = async (dataHistorique) => {

    const result = await pool.query(
        `
            INSERT INTO historiques (action, titre_element, personnel_id) VALUES ($1, $2, $3) RETURNING *
        `, [dataHistorique.action, dataHistorique.titre_element, dataHistorique.personnel_id]
    )

    return result.rows[0];
}

/**
 * 
 * @returns {object}
 */
export const getAllHistorique = async () => {

    const result = await pool.query(
        `
            SELECT * FROM historiques ORDER BY created_at DESC
        `
    )

    return result.rows;
}
