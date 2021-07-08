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
        res.sendStatus(500);
    }
    db.close();
};

exports.read = async (__, res) => {
    const db = await getDb();
    
    try {
        //If wanted a joined table:
        // const [albums] = await db.query({sql: 'SELECT * FROM Artist LEFT JOIN Album ON Artist.id = Album.artistId', nestTables: '_'});
        const [albums] = await db.query('SELECT * FROM Album');
        res.status(200).send(albums);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
    db.close();
}

exports.readById = async (req, res) => {
    const db = await getDb();
    const { albumId } = req.params;
    console.log(albumId)

    try {
        const [[album]] = await db.query('SELECT * FROM Album WHERE id = ?', [albumId]);
        if (!album) {
            res.sendStatus(404);
        } else {
            res.status(200).json(album);
        }
    } catch (err) {
        res.sendStatus(500);
    }
    db.close();
};

exports.update = async (req, res) => {
    const db = await getDb();
    const { albumId } = req.params;
    const data = req.body;

    try {
        const [[album]] = await db.query('SELECT * FROM Album WHERE id = ?', [albumId]);
        if (!album) {
            res.sendStatus(404);
        } else {
            await db.query('UPDATE Album SET ? WHERE id = ?', [
                data,
                albumId
            ]);
            res.sendStatus(200);
        } 
    }
    catch (err) {
        res.sendStatus(500);
    }
    db.close()
};

exports.delete = async (req, res) => {
    const db = await getDb();
    const { albumId } = req.params;

    try {
        const [[album]] = await db.query('SELECT * FROM Album WHERE id = ?', [albumId]);
        if (!album) {
            res.sendStatus(404);
        } else {
            await db.query('DELETE FROM Album WHERE id = ?', [albumId]);
            res.sendStatus(200);
        };
    } catch (err) {
        res.sendStatus(500);
    };
    db.close();
};