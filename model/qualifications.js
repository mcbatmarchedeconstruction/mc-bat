import pool from "../db/config.js";

/**
 * Création d'une qualification
 * @param {object} dataQualification 
 * @returns {object}
 */
export const createQualification = async (dataQualification) => {

    const result = await pool.query(
        `
            INSERT INTO qualifications (niveau_qualification) VALUES ($1) RETURNING *
        `, [dataQualification.niveau_qualification]
    )

    return result.rows[0];
}

/**
 * Récuperaton des qualifications
 * @returns {Array}
 */
export const getAllQualification = async () => {

    const result = await pool.query(
        `
            SELECT * FROM qualifications ORDER BY created_at DESC
        `
    )

    return result.rows;
}

/**
 * Récuperaton des qualifications
 * @returns {Array}
 */
export const getQualificationById = async (id) => {

    const result = await pool.query(
        `
            SELECT * FROM qualifications WHERE id = $1
        `, [id]
    )

    return result.rows[0];
}


/**
 * Mise à jour d'une qualification
 * @param {number} id 
 * @param {object} dataQualification 
 * @returns {object}
 */
export const updateQualification= async (id, dataQualification) => {

    const result = await pool.query(
        `
            UPDATE qualifications SET niveau_qualification = COALESCE($1, niveau_qualification)
             WHERE id = $2 RETURNING *
        `, [ dataQualification.niveau_qualification, id]
    )

    return result.rows[0]
}

/**
 * Suppression d'une qualification
 * @param {number} id 
 * @returns {object}
 */
export const deletequalification = async (id) => {

    const result =await pool.query(
        `
            DELETE FROM qualifications WHERE id = $1 RETURNING *
        `, [id]
    )

    return result.rows[0]
}
