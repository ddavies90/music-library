// tests/artist-read.test.js
const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('read artists', () => {
    let db;
    let artists;

    beforeEach(async () => {
        db = await getDb();
        await Promise.all([
            db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
                'Tame Impala',
                'rock',
            ]),
            db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
                'Kylie Minogue',
                'pop',
            ]),
            db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
                'Dave Brubeck',
                'jazz',
            ]),
        ]);

        [artists] = await db.query('SELECT * from Artists');
    });

    afterEach(async () => {
        await db.query('DELETE FROM Artists');
        await db.close();
    });

    describe('/artists', () => {
        describe('GET', () => {
            it('returns all artist records in the database', async () => {
                const res = await request(app).get('/artists').send();

                expect(res.status).to.equal(200);
                expect(res.body.length).to.equal(3);

                res.body.forEach((artistRecord) => {
                    const expected = artists.find((a) => a.id === artistRecord.id);

                    expect(artistRecord).to.deep.equal(expected);
                });
            });
        });
    });

    describe('/artists/:artistId', () => {
        describe('GET', () => {
            it('returns a single artist with the correct id', async () => {
                const expected = artists[0];
                const res = await request(app).get(`/artists/${expected.id}`).send();

                expect(res.status).to.equal(200);
                expect(res.body).to.deep.equal(expected);
            });

            it('returns a 404 if the artist is not in the database', async () => {
                const res = await request(app).get('/artists/999999').send();

                expect(res.status).to.equal(404);
            });
        });
    });
});