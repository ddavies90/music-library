const getDb = require('../services/db');

exports.create = async (req, res) => {
    const db = await getDb();
    const { name, year } = req.body;
    const { id } = req.params;

    try {
        await db.query(`INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`, [
            name,
            year,
            id
        ]);
        res.status(201).json(req.body);
    } catch (err) {
        res.Status(500).json(err);
    }
    db.close();
};
