import pool from "../db/config.js";

/**
 * Crée une nouvelle actualité dans la base de données.
 * @param {object} dataActualite 
 * @returns {object} actualite
 */
export const createActualite = async (dataActualite) => {

    const result = await pool.query(`
        INSERT INTO actualites (image, secteur, titre, contenu, statut) VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`, 
        [dataActualite.image, dataActualite.secteur, dataActualite.titre, dataActualite.contenu, dataActualite.statut]);
    
    return result.rows[0];
}

/** * Récupère toutes les actualités de la base de données.
 * @returns {Array} Liste des actualités
 */
export const getAllActualites = async () => {
    
    const result  = await pool.query(`
        SELECT * FROM actualites ORDER BY created_at DESC
    `)

    return result.rows;
}
/** * Récupère toutes les actualités de la base de données. statut true
 * @returns {Array} Liste des actualités
 */
export const getAllActualitesStatutTrue = async () => {
    
    const result  = await pool.query(`
        SELECT * FROM actualites WHERE statut = true ORDER BY created_at DESC
    `)

    return result.rows;
}
/** * Récupère  l'actualités limite 5
 * @returns {Array} Liste des actualités
 */
export const getActualitesLimit = async () => {
    
    const result  = await pool.query(`
        SELECT * FROM actualites WHERE statut = true ORDER BY created_at DESC LIMIT 5
    `)

    return result.rows;
}

/** * Récupère une actualité spécifique par son ID.
 * @param {number} id - L'ID de l'actualité à récupérer.
 * @returns {object} L'actualité correspondante ou null si non trouvée.
 */
export const getActualiteById = async (id) => {
    
    const result = await pool.query(`
        SELECT * FROM actualites WHERE id = $1
    `, [id])

    return result.rows[0];
}

/**
 * Met à jour une actualité existante dans la base de données.
 * @param {number} id 
 * @param {object} dataActualite 
 * @returns {object} actualite
 */
export const updateActualite = async (id, dataActualite) => {
    
    const result = await pool.query(`
        UPDATE actualites SET image = COALESCE($1, image), secteur = COALESCE($2, secteur), titre = COALESCE($3, titre), contenu = COALESCE($4, contenu), statut = COALESCE($5, statut)
        WHERE id = $6 RETURNING *
    `, [ dataActualite.image, dataActualite.secteur, dataActualite.titre, dataActualite.contenu, dataActualite.statut, id ]);

    return result.rows[0];
}

/**
 * Supprime une actualité de la base de données.
 * @param {number} id 
 * @returns {object} actualite
 */
export const deleteActualite = async (id) => {

    const result = await pool.query(`
        DELETE FROM actualites WHERE id = $1 RETURNING *
    `, [id]);

    return result.rows[0];
}

export const countActualite = async () => {
    const result = await pool.query(`
            SELECT COUNT(*) FROM actualites
        `)

        return Number(result.rows[0].count)
}