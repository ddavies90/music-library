const getDb = require('../services/db');

exports.create = async (req, res) => {
    const db = await getDb();
    const { name, genre } = req.body;

    try {
        const [ dbRes ] = await db.query(`INSERT INTO Artists (name, genre) VALUES (?, ?)`, [
            name,
            genre
        ]);
        res.status(201).json( {
            id: dbRes.insertId,
            name,
            genre
        } );
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    db.close();
};

exports.read = async (_, res) => {
    const db = await getDb();

    try {
        const [artists] = await db.query('SELECT * FROM Artists');
        res.status(200).json(artists);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    db.close();
};

exports.getById = async (req, res) => {
    const db = await getDb();
    const { id } = req.params;

    try {
        const [[artist]] = await db.query('SELECT * FROM Artists WHERE id = ?', [id]);
        if (!artist) {
            res.status(404).send('There is no record associated with this ID');
        } else {
            res.status(200).json(artist);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    db.close();
};

exports.update = async (req, res) => {
    const db = await getDb();
    const { id } = req.params;
    const data = req.body;

    try {
        const [ dbRes ] = await db.query('UPDATE Artists SET ? WHERE id = ?', [data, id]);
        if (!dbRes.affectedRows) {
            res.sendStatus(404);
        } else {
            res.status(200).json({
                rowsUpdated: dbRes.affectedRows
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    db.close();
};

exports.delete = async (req, res) => {
    const db = await getDb();
    const { id } = req.params;

    try {
        const [ dbRes ] = await db.query('DELETE FROM Artists WHERE id = ?', [id]);
        if (!dbRes.affectedRows) {
            res.status(404).send('This artist does not exist in the database');
        } else {
            res.status(200).json({
                rowsUpdated: dbRes.affectedRows
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    db.close();
};