import pool from "../db/config.js";

/**
 * Création d'un service
 * @param {object} dataService 
 * @returns {object}
 */
export const createService = async (dataService) => {

    const result = await pool.query(
        `
            INSERT INTO services (image, titre, description) VALUES ($1, $2, $3) RETURNING *
        `, [dataService.image,
            dataService.titre, dataService.description]
    )

    return result.rows[0];
}

/**
 * Récuperaton d'un service
 * @returns {Array}
 */
export const getAllService = async () => {

    const result = await pool.query(
        `
            SELECT * FROM services ORDER BY created_at DESC
        `
    )

    return result.rows;
}
/**
 * Récuperaton d'un service statut true
 * @returns {Array}
 */
export const getAllServiceStatutTrue = async () => {

    const result = await pool.query(
        `
            SELECT * FROM services WHERE statut = true ORDER BY created_at DESC
        `
    )

    return result.rows;
}

 

/**
 * Récuperaton d'un service
 * @returns {Array}
 */
export const getServiceById = async (id) => {

    const result = await pool.query(
        `
            SELECT * FROM services WHERE id = $1
        `, [id]
    )

    return result.rows[0];
}


/**
 * Mise à jour d'un service
 * @param {number} id 
 * @param {object} dataService 
 * @returns {object}
 */
export const updateService = async (id, dataService) => {

    const result = await pool.query(
        `
            UPDATE services SET image = COALESCE($1, image), titre = COALESCE($2, titre), description = COALESCE($3, description), statut = COALESCE($4, statut)
             WHERE id = $5 RETURNING *
        `, [dataService.image,
            dataService.titre, dataService.description, dataService.statut, id]
    )

    return result.rows[0]
}

/**
 * Suppression d'un service
 * @param {number} id 
 * @returns {object}
 */
export const deleteService = async (id) => {

    const result =await pool.query(
        `
            DELETE FROM services WHERE id = $1 RETURNING *
        `, [id]
    )

    return result.rows[0]
}

export const countService = async () => {
    const result = await pool.query(`
            SELECT COUNT(*) FROM services
        `)

        return Number(result.rows[0].count)
}
