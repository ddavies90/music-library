const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('read album', () => {
    let db;
    let albums;

    beforeEach(async () => {
        db = await getDb();
        await Promise.all([
            db.query('INSERT INTO Album (name, year) VALUES (?, ?)', [
                'Currents',
                2015,
            ]),
            db.query('INSERT INTO Album (name, year) VALUES (?, ?)', [
                'Definitely Maybe',
                1994,
            ]),
            db.query('INSERT INTO Album (name, year) VALUES (?, ?)', [
                'Organ',
                2021,
            ]),
        ]);

        [albums] = await db.query('SELECT * FROM Album');
    });

    afterEach(async () => {
        await db.query('DELETE FROM Album');
        await db.close();
    })

    describe('/album', () => {
        describe('GET', () => {
            it('returns all album records in the database', async () => {
                const res = await request(app).get('/album').send();

                expect (res.status).to.equal(200);
                expect (res.body.length).to.equal(3);

                res.body.forEach(albumRecord => {
                    const expectedRecord = albums.find(album => album.id === albumRecord.id);

                    expect(albumRecord).to.deep.equal(expectedRecord);
                })
            })
        })
    })
});