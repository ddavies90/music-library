const getDb = require('../services/db');

exports.create = async (req, res) => {
    const db = await getDb();
    const { name, genre } = req.body;

    try {
        const [ dbRes ] = await db.query(`INSERT INTO Artist (name, genre) VALUES (?, ?)`, [
            name,
            genre
        ]);
        const id = dbRes.insertId;
        res.status(201).json({id, name, genre});
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    };
    db.close();
};

exports.read = async (_, res) => {
    const db = await getDb();

    try {
        const [artists] = await db.query('SELECT * FROM Artist');
        res.status(200).send(artists);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    };
    db.close();
};

exports.getById = async (req, res) => {
    const db = await getDb();
    const { id } = req.params;

    try {
        const [[artist]] = await db.query('SELECT * FROM Artist WHERE id = ?', [id]);
        if (!artist) {
            res.status(404).send('There is no record associated with this ID');
        } else {
            res.status(200).json(artist);
        };
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    };
    db.close();
};

exports.update = async (req, res) => {
    const db = await getDb();
    const { id } = req.params;
    const data = req.body;

    try {
        const [ dbRes ] = await db.query('UPDATE Artist SET ? WHERE id = ?', [data, id]);
        if (!dbRes.affectedRows) {
            res.sendStatus(404);
        } else {
            await db.query('UPDATE Artist SET ? WHERE id = ?', [data, id]);
            res.sendStatus(200);
        };
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    };
    db.close();
};

exports.delete = async (req, res) => {
    const db = await getDb();
    const { id } = req.params;

    try {
        const [[artist]] = await db.query('SELECT * FROM Artist WHERE id = ?', [id]);
        if (!artist) {
            res.sendStatus(404);
        } else {
            await db.query('DELETE FROM Artist WHERE id = ?', [id]);
            res.sendStatus(200);
        };
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    db.close();
};