import pool from "../db/config.js";

/**
 * Création d'un utilisateur
 * @param {object} dataUtilisateur 
 * @returns {object}
 */
export const createUtilisateur = async (dataUtilisateur) => {

    const result = await pool.query(
        `
            INSERT INTO utilisateurs (email) VALUES ($1) RETURNING *
        `, [dataUtilisateur.email]
    )

    return result.rows[0];
}

/**
 * 
 * @returns {object}
 */
export const getAllUtilisateur = async () => {

    const result = await pool.query(
        `
             SELECT * FROM utilisateurs ORDER BY created_at DESC
        `
    )

    return result.rows;
}

/**
 * Par eamik
 * @returns {object}
 */
export const getUtilisateurByEamil = async (email) => {

    const result = await pool.query(
        `
             SELECT * FROM utilisateurs WHERE email=$1
        `, [email]
    )

    return result.rows[0];
}

export const deleteUtilisateur = async (id) => {

    const result = await pool.query(
        `
            DELETE FROM utilisateurs WHERE id = $1 RETURNING *
        `, [id]
    )

    return result.rows[0];           
}

export const countUtilisateur = async () => {
    const result = await pool.query(`
            SELECT COUNT(*) FROM utilisateurs
        `)

        return Number(result.rows[0].count)
}
