const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

//Test fails because database is failing to drop if tests fail - just adds more records to it instead so can't use an ID to check test as it > expected.

describe('create album', () => {
    let db;
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
                'Tame Impala',
                'rock',
            ]),
        ]);
    });

    afterEach(async () => {
        await db.query('DELETE FROM Artist');
        await db.close();
    });

    describe('/artist/:artistId/album', () => {
        describe('POST', () => {
            it('creates a new album in the database', async () => {
                const res = await request(app).post(`/artist/3000/album`).send(
                {
                    name: 'Currents',
                    year: 2015,
                });

                expect(res.status).to.equal(201);

                const [[albumEntries]] = await db.query(
                    `SELECT * FROM Album WHERE id = 1`
                );

                expect(albumEntries.name).to.equal('Currents');
                expect(albumEntries.year).to.equal(2015);
                expect(albumEntries.artistId).to.equal(3);
            });
        });
    });
});