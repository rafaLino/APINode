import { Server } from './server/server'
import { usersRouter } from './users/users.routes'
import { restaurantsRouter } from './Restaurants/restaurants.routes'
import { reviewsRouter } from './reviews/reviews.router';
import { mainRouter } from './main.router';



const server = new Server()
server.bootstrap([
    usersRouter,
    restaurantsRouter,
    reviewsRouter,
    mainRouter

]).then(server => {
    console.log('server is listening on:', server.application.address());

}).catch(error => {
    console.log('Server failed to start ')
    console.error(error);
    process.exit(1);
})