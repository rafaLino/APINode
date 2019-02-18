import 'jest'
import * as request from 'supertest'

const url: string = (<any>global).address;
const auth: string = (<any>global).auth;

test('get /users', async () => {
    try {
        const response = await request(url)
            .get('/users').set('Authorization',auth);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    }
    catch (fail) {
        console.error(fail)
    }
});


test('get /users/aaa - not found', async () => {
    const response = await request(url)
        .get('/users/aaaa').set('Authorization',auth);
    expect(response.status).toBe(404);
})


test('get /users/:id', async () => {
    try {
        const response = await request(url)
            .post('/users').set('Authorization',auth)
            .send({
                name: 'usuario1',
                email: 'usuario1@email.com',
                password: '123456'
            });

        const response_1 = await request(url)
            .get(`/users/${response.body._id}`).set('Authorization',auth);

        expect(response.body._id).toEqual(response_1.body._id);
        expect(response.body).toEqual(response_1.body);

    } catch (fail) {
        console.error(fail)

    }
    const response = await request(url)
        .get('/users/aaaa').set('Authorization',auth);
    expect(response.status).toBe(404);
})


test('post /users', async () => {
    try {
        const response = await request(url)
            .post('/users').set('Authorization',auth)
            .send({
                name: 'usuario2',
                email: 'usuario2@email.com',
                password: '123456'
            });
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('usuario2');
        expect(response.body.email).toBe('usuario2@email.com');
        expect(response.body.password).toBeUndefined();
    }
    catch (fail) {
        console.error(fail)

    }
});

test('patch /usesrs/:id', async () => {
    try {
        const response = await request(url)
            .post('/users').set('Authorization',auth)
            .send({
                name: 'usuario3',
                email: 'usuario3@email.com',
                password: '123456'
            });
        const response_1 = await request(url)
            .patch(`/users/${response.body._id}`).set('Authorization',auth)
            .send({
                name: 'usuario-patch'
            });
        expect(response_1.body.name).toBe('usuario-patch');
    }
    catch (fail) {
        console.error(fail)
    }
})

test('delete /users/:id', async () => {
    try {
        const response = await request(url)
            .post('/users')
            .set('Authorization',auth)
            .send({ 
                name: 'usuario4',
                email: 'usuario4@email.com',
                password: '123456'
            });
        const response_1 = await request(url)
            .del(`/users/${response.body._id}`).set('Authorization',auth);

        expect(response_1.status).toBe(204);
    } catch (fail) {
        console.error(fail)
    }
})