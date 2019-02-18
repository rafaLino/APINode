import { ModelRouter } from "../common/model-router";
import { Review } from "./reviews.model";
import { Server, Response, Request, Next } from "restify";
import { DocumentQuery } from "mongoose";
import { authorize } from "../security/authz.handler";




class ReviewsRouter extends ModelRouter<Review> {



    constructor() {
        super(Review);

    }

    applyRoutes(application: Server): void {

        application.get(`${this.basePath}`, this.findAll);

        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);

        application.post(`${this.basePath}`, [authorize('user'),this.save]);

    }

    protected prepare(query: DocumentQuery<Review | Review[], Review>): DocumentQuery<Review | Review[], Review> {

        if (query instanceof Array)
            query.forEach(queryOne => {
                queryOne
                    .populate('user', 'name')
                    .populate('restaurant', 'name');
            })
        else
            query
                .populate('user', 'name')
                .populate('restaurant', 'name');

        return query

    }

    envelop(document: any): any {
        let resource = super.envelop(document);
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        resource._links.restaurant = `/restaurants/${restId}`
        return resource;
    }
}


export const reviewsRouter: ReviewsRouter = new ReviewsRouter();