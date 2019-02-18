import { ModelRouter } from "../common/model-router";
import { Restaurant } from "./restaurants.model";
import * as restify from 'restify'
import { NotFoundError } from "restify-errors";
import { authorize } from "../security/authz.handler";



class RestaurantsRouter extends ModelRouter<Restaurant> {
    constructor() {
        super(Restaurant);

    }

    applyRoutes(application: restify.Server) {


        application.get(`${this.basePath}`, this.findAll);

        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);

        application.post(`${this.basePath}`,[authorize('admin'), this.save]);

        application.put(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.replace]);

        application.patch(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.update]);

        application.del(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.delete]);

        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);

        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);

    }


    findMenu = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        Restaurant.findById(req.params.id, "+menu")
            .then((restaurant: Restaurant) => {
                if (!restaurant) {
                    throw new NotFoundError('Restaurant not found');
                }

                resp.json(restaurant);
                return next();
            }).catch(next);
    }

    replaceMenu = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        Restaurant.findById(req.params.id)
            .then((rest: Restaurant) => {
                if (!rest)
                    throw new NotFoundError('restaurant not found');

                rest.menu = req.body;

                return rest.save();
            }).then((rest: Restaurant) => {
                resp.json(rest.menu);
                return next();
            }).catch(next);
    }


    envelop(document: any) : any {
        let resource = super.envelop(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }

}

export const restaurantsRouter: RestaurantsRouter = new RestaurantsRouter();