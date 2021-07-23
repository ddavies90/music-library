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

        //insertId is from ResultSetHeader object returned by querying db and grabs the most recently generated auto-incremented ID value
        res.status(201).json({id: dbRes.insertId, name, year, artistId});
    } catch (err) {
        console.error(err);
        if(err.errno === 1452) {
            res.status(404).send("Invalid artist id. Please check the value and try again.");
        } else {
        res.status(500).send(err);
        }
    }
    db.close();
};

exports.read = async (_, res) => {
    const db = await getDb();
    
    try {
        const [albums] = await db.query({sql: 'SELECT * FROM Album LEFT JOIN Artist ON Artist.id = Album.artistId', nestTables: '_'});
        res.status(200).send(albums);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    db.close();
}

exports.readById = async (req, res) => {
    const db = await getDb();
    const { albumId } = req.params;

    try {
        const [[album]] = await db.query({sql: 'SELECT * FROM Album LEFT JOIN Artist ON Artist.id = Album.artistId WHERE Album.id = ?', nestTables: '_'}, [albumId]);
        if (!album) {
            res.sendStatus(404);
        } else {
            res.status(200).json(album);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
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
        console.error(err);
        res.status(500).send(err);
    }
    db.close()
};

exports.delete = async (req, res) => {
    const db = await getDb();
    const { albumId } = req.params;

    try {
        const [ dbRes ] = await db.query('DELETE FROM Album WHERE id = ?', [albumId]);
        if (!dbRes.affectedRows) {
            res.status(404).send('This album does not exist')
        } else {
            res.sendStatus(200);
        }   
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    };
    db.close();
};