const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('update album', () => {
    let db;
    let albums;
    beforeEach(async () => {
        db = await getDb();
        await db.query('INSERT INTO Albums (name, year) VALUES(?, ?)', [
            'Organ',
            2021,
        ]);

        [albums] = await db.query('SELECT * FROM Albums');
    });

    afterEach(async () => {
        await db.query('DELETE FROM Albums');
        await db.close();
    });

    describe('/albums/:albumId', () => {
        describe('PATCH', () => {
            it('updates a single album using the correct id', async () => {
                const album = albums[0];
                const res = await request(app)
                .patch(`/albums/${album.id}`)
                .send({ name: 'new name', year: 0000 });

                expect(res.status).to.equal(200);

                const [
                [newAlbumRecord],
                ] = await db.query('SELECT * FROM Albums WHERE id = ?', [album.id]);

                expect(newAlbumRecord.name).to.equal('new name');
                expect(newAlbumRecord.year).to.equal(0000);
            });

            it('returns a 404 if the album is not in the database', async () => {
                const res = await request(app)
                .patch('/albums/999999')
                .send({ name: 'new name' });

                expect(res.status).to.equal(404);
            });
        });
    });
});