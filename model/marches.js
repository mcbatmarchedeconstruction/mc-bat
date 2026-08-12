import pool from "../db/config.js";

/** Création du marches
 * @param {object}
 *  @returns {object}
 */
export const createMarche = async (dataMarches) => {

    const result = await pool.query(
        `
            INSERT INTO marches (
                produit,
                details_produit,
                prix,
                statut,
                image
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [dataMarches.produit, dataMarches.details_produit,
                dataMarches.prix, dataMarches.statut, dataMarches.image,
            ])

    return result.rows[0];
}

/**
 * Récuperatin de tous les marches
 * @returns {Array}
 */
export const getAllMarche = async () => {

    const result = await pool.query(
        `
            SELECT * FROM marches ORDER BY created_at DESC 
        `
    )

    return result.rows;

}
/**
 * Récuperatin de tous les marches statut true
 * @returns {Array}
 */
export const getAllMarcheStatutTrue = async () => {

    const result = await pool.query(
        `
            SELECT * FROM marches WHERE statut = true ORDER BY created_at DESC 
        `
    )

    return result.rows;

}

/**
 * Récuperatin du marche limit 5
 * @returns {Array}
 */
export const getMarcheLimit = async () => {

    const result = await pool.query(
        `
            SELECT * FROM marches WHERE statut = true ORDER BY created_at DESC LIMIT 5
        `
    )

    return result.rows;

}

/**
 * Récuperatin de marches par id
 * @returns {Array}
 */
export const getMarcheById = async (id) => {

    const result = await pool.query(
        `
            SELECT * FROM marches WHERE id = $1
        `, [id]
    )

    return result.rows[0];

}

/**
 * Mise à jour marche
 * @param {number} id 
 * @param {object} dataMarches 
 * @returns {object} 
 */
export const updateMarche = async (id, dataMarches) => {

    const result = await pool.query(
        `
            UPDATE marches SET  
                
                produit = COALESCE($1, produit),
                details_produit = COALESCE($2, details_produit),
                prix = COALESCE($3, prix),
                statut = COALESCE($4, statut), 
                image = COALESCE($5, image) WHERE id = $6 RETURNING * 
        `, [dataMarches.produit, dataMarches.details_produit,
                dataMarches.prix,
                dataMarches.statut, dataMarches.image, id]
    )

    return result.rows[0];
}

/**
 * Suppression du marche
 * @param {number} id 
 * @returns {object}
 */
export const deleteMarche = async (id) => {

    const result = await pool.query(
        `
            DELETE FROM marches WHERE id = $1 RETURNING *
        `, [id]
    )

    return result.rows[0];
}