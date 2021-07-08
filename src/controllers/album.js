const getDb = require('../services/db');

exports.create = async (req, res) => {
    const db = await getDb();
    const { name, year } = req.body;
    const { artistId } = req.params;

    try {
        const [ dbRes ] = await db.query(`INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`, [
            name,
            year,
            artistId
        ]);

        //insertId grabs the last 
        res.status(201).json({id: dbRes.insertId, name, year, artistId});
    } catch (err) {
        res.status(500).json(err);
    }
    db.close();
};

exports.read = async (__, res) => {
    const db = await getDb();
    
    try {
        const [albums] = await db.query({sql: 'SELECT * FROM Artist LEFT JOIN Album ON Artist.id = Album.artistId', nestTables: '_'});
        res.status(200).send(albums);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
    db.close();
}
