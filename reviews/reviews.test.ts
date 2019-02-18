import 'jest'
import * as request from 'supertest'


let url: string = (<any>global).address;


test('get /reviews', async () => {
    try {
        const response = await request(url)
            .get('/reviews');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    }
    catch (fail) {
        console.error(fail)
    }
});
