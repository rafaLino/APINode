import * as jestcli from 'jest-cli'

import { environment } from "./common/environment";
import { usersRouter } from "./users/users.routes";
import { Server } from "./server/server";
import { User } from "./users/users.model";
import { reviewsRouter } from "./reviews/reviews.router";
import { Review } from "./reviews/reviews.model";
import { Restaurant } from './Restaurants/restaurants.model';

let server: Server;
const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    environment.server.port = process.env.SERVER_PORT || 3001
    server = new Server()
    return server.bootstrap([
        usersRouter,
        reviewsRouter
    ])
        .then(() => User.deleteMany({}).exec())
        .then(() => {
            let admin = new User();
            admin.name = 'Bruce',
                admin.email = 'bruce@dc.com',
                admin.password = '123456',
                admin.profiles = ['admin', 'user']

            return admin.save();
        })
        .then(() => Review.deleteMany({}).exec())
        .then(() => Restaurant.deleteMany({}).exec())


}

const afterAllTests = () => {
    return server.shutDown();
}


beforeAllTests()
    .then(() => jestcli.run())
    .then(() => afterAllTests())
    .catch(console.error)