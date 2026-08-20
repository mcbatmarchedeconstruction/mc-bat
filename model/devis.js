import pool from "../db/config.js";
import { transporter } from "../config/mail.js";

/** Création de devis
 * @param {object}
 *  @returns {object}
 */
export const createDevis = async (dataDevis) => {

    const result = await pool.query(
        `
            INSERT INTO devis (
                nom_complet,
                email,
                telephone,
                details_projet,
                secteur,
                budget
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `, [dataDevis.nom_complet, dataDevis.email,
                dataDevis.telephone,
                dataDevis.details_projet,
                dataDevis.secteur,
                dataDevis.budget])

    return result.rows[0];
}

/**
 * Récupération de tous les devis.
 * @returns {Array}
 */
export const getAllDevis = async () => {

    const result = await pool.query(
        `
            SELECT * FROM devis ORDER BY created_at DESC 
        `
    )

    return result.rows;

}

/**
 * Récupération des cinq devis les plus récents.
 * @returns {Array}
 */
export const getDevisLimit = async () => {

    const result = await pool.query(
        `
            SELECT * FROM devis ORDER BY created_at DESC LIMIT 5
        `
    )

    return result.rows;

}

/**
 * Récupération d'un devis par son identifiant.
 * @returns {Array}
 */
export const getDevisById = async (id) => {

    const result = await pool.query(
        `
            SELECT * FROM devis WHERE id = $1
        `, [id]
    )

    return result.rows[0];

}


/**
 * Mise à jour devis
 * @param {number} id 
 * @param {object} dataDevis 
 * @returns {object} 
 */
export const updateDevis = async (id, dataDevis) => {

    const result = await pool.query(
        `
            UPDATE devis SET  
                nom_complet = COALESCE($1, nom_complet),
                email = COALESCE($2, email),
                telephone = COALESCE($3, telephone),
                details_projet = COALESCE($4, details_projet),
                secteur = COALESCE($5, secteur),
                budget = COALESCE($6, budget), 
                statut = COALESCE($7, statut),
                lu = COALESCE($8, lu) WHERE id = $9 RETURNING * 
        `, [dataDevis.nom_complet, dataDevis.email,
                dataDevis.telephone,
                dataDevis.details_projet,
                dataDevis.secteur,
                dataDevis.budget, dataDevis.statut, dataDevis.lu, id]
    )

    return result.rows[0];
}

/**
 * Suppression du devis
 * @param {number} id 
 * @returns {object}
 */
export const deleteDevis = async (id) => {

    const result = await pool.query(
        `
            DELETE FROM devis WHERE id = $1 RETURNING *
        `, [id]
    )

    return result.rows[0];
}

export const countDevis = async () => {
    const result = await pool.query(`
            SELECT COUNT(*) FROM devis
        `)

        return Number(result.rows[0].count)
}

export const envoyerMailTraitement = async (email, nom) => {

    await transporter.sendMail({
        from: `"MC BAT" <${process.env.EMAIL}>`,
        to: email,
        subject: "Votre demande de devis est en cours de traitement",

        html: `
            <h2>Bonjour ${nom},</h2>

            <p>
                Nous avons bien reçu votre demande de devis.
            </p>

            <p>
                Notre équipe l'étudie actuellement.
            </p>

            <p>
                Nous reviendrons vers vous dans les plus brefs délais.
            </p>

            <br>

            <strong>MC BAT</strong>
        `
    });

}
