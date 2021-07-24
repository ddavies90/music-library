const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('delete album', () => {
    let db;
    let albums;
    beforeEach(async () => {
        db = await getDb();
        await Promise.all([
        db.query('INSERT INTO Albums (name, year) VALUES(?, ?)', [
            'Definitely Maybe',
            1994,
        ]),
        db.query('INSERT INTO Albums (name, year) VALUES(?, ?)', [
            'Organ',
            2021,
        ]),
        ]);

        [albums] = await db.query('SELECT * from Albums');
    });

    afterEach(async () => {
        await db.query('DELETE FROM Albums');
        await db.close();
    });

    describe('/albums/:albumId', () => {
        describe('DELETE', () => {
            it('deletes a single album with the correct id', async () => {
                const album = albums[0];
                const res = await request(app).delete(`/albums/${album.id}`).send();

                expect(res.status).to.equal(200);

                const [
                [deletedAlbumRecord],
                ] = await db.query('SELECT * FROM Albums WHERE id = ?', [album.id]);

                expect(deletedAlbumRecord).to.not.exist;
            });

            it('returns a 404 if the album is not in the database', async () => {
                const res = await request(app).delete('/albums/999999').send();

                expect(res.status).to.equal(404);
            });
        });
    });
});