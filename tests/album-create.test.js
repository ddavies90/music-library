const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');


describe('create album', () => {
    let db;
    let artists;
    beforeEach(async () => {
        db = await getDb();
        await Promise.all([
            db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
                'Kylie Minogue',
                'pop',
            ]),
            db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
                'Dave Brubeck',
                'jazz',
            ]),
            db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
                'Dimension',
                'DnB',
            ]),
        ]);
        [artists] = await db.query('SELECT * from Artist');
    });

    afterEach(async () => {
        await db.query('DELETE FROM Album');
        await db.close();
    });

    describe('/artist/:artistId/album', () => {
        describe('POST', () => {
            it('creates a new album in the database', async () => {

                const artist = artists[2];

                const res = await request(app).post(`/artist/${artist.id}/album`).send(
                {
                    name: 'Organ',
                    year: 2021,
                });

                expect(res.status).to.equal(201);

                const [[albumEntries]] = await db.query(
                    `SELECT * FROM Album WHERE id = ${res.body.id}`
                );
                
                expect(albumEntries.name).to.equal('Organ');
                expect(albumEntries.year).to.equal(2021);
                expect(albumEntries.artistId).to.equal(artist.id);
            });
        });
    });
});