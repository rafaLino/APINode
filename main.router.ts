import * as restify from 'restify'
import { Router } from "./common/router";


class MainRouter extends Router {

    applyRoutes(application: restify.Server): void {

        application.get('/', (req: restify.Request, resp: restify.Response, next: restify.Next) => {

            resp.json({
                users: '/users',
                restaurants: '/restaurants',
                reviews: '/reviews'
            })

        })
    }

}

export const mainRouter = new MainRouter(); 