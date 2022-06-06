const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('read albums', () => {
    let db;
    let albums;

    beforeEach(async () => {
        db = await getDb();
        await Promise.all([
            db.query('INSERT INTO Albums (name, year) VALUES (?, ?)', [
                'Currents',
                2015,
            ]),
            db.query('INSERT INTO Albums (name, year) VALUES (?, ?)', [
                'Definitely Maybe',
                1994,
            ]),
            db.query('INSERT INTO Albums (name, year) VALUES (?, ?)', [
                'Organ',
                2021,
            ]),
        ]);

        [albums] = await db.query({sql: 'SELECT * FROM Albums LEFT JOIN Artists ON Artists.id = Albums.artistId', nestTables: '_'});
    });

    afterEach(async () => {
        await db.query('DELETE FROM Albums');
        await db.close();
    });

    describe('/albums', () => {
        describe('GET', () => {
            it('returns all album records in the database', async () => {
                const res = await request(app).get('/albums').send();

                expect (res.status).to.equal(200);
                expect (res.body.length).to.equal(3);
                res.body.forEach(albumRecord => {
                    const expectedRecord = albums.find(album => album.Albums_id === albumRecord.Albums_id);

                    expect(albumRecord).to.deep.equal(expectedRecord);
                });
            });
        });
    });

    describe('/albums/:albumId', () => {
        describe('GET', () => {
            it('returns a single album with correct id', async () =>{
                const expectedAlbum = albums[0];
                const res = await request(app).get(`/albums/${expectedAlbum.Albums_id}`).send();

                expect(res.status).to.equal(200);
                expect(res.body).to.deep.equal(expectedAlbum);
            });

            it('returns a 404 if the album is not in the database', async () => {
                const res = await request(app).get('/albums/999999').send();

                expect(res.status).to.equal(404);
            });
        });
    });
});