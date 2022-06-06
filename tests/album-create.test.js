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
            db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
                'Kylie Minogue',
                'pop',
            ]),
            db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
                'Dave Brubeck',
                'jazz',
            ]),
            db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
                'Dimension',
                'DnB',
            ]),
        ]);
        [artists] = await db.query('SELECT * from Artists');
    });

    afterEach(async () => {
        await db.query('DELETE FROM Albums');
        await db.query('DELETE FROM Artists');
        await db.close();
    });

    describe('/artists/:artistId/albums', () => {
        describe('POST', () => {
            it('creates a new album in the database', async () => {

                const artist = artists[2];

                const res = await request(app).post(`/artists/${artist.id}/albums`).send(
                {
                    name: 'Organ',
                    year: 2021,
                });

                expect(res.status).to.equal(201);

                const [[albumEntries]] = await db.query(
                    `SELECT * FROM Albums WHERE id = ${res.body.id}`
                );
                
                expect(albumEntries.name).to.equal('Organ');
                expect(albumEntries.year).to.equal(2021);
                expect(albumEntries.artistId).to.equal(artist.id);
            });
        });
    });
});