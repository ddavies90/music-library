const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('delete artist', () => {
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

    describe('/artists/:artistId', () => {
        describe('DELETE', () => {
            it('deletes a single artist with the correct id', async () => {
                const artist = artists[0];
                const res = await request(app).delete(`/artists/${artist.id}`).send();

                expect(res.status).to.equal(200);

                const [
                [deletedArtistRecord],
                ] = await db.query('SELECT * FROM Artists WHERE id = ?', [artist.id]);

                expect(!!deletedArtistRecord).to.be.false;
            });

            it('returns a 404 if the artist is not in the database', async () => {
                const res = await request(app).delete('/artists/999999').send();

                expect(res.status).to.equal(404);
            });
        });
    });
});