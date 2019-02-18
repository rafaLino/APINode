import { Router } from './router'
import { NotFoundError } from 'restify-errors';
import { Model, Document, Types, ModelUpdateOptions, ModelFindByIdAndUpdateOptions, DocumentQuery } from 'mongoose';
import { Request, Response, Next } from 'restify';


export abstract class ModelRouter<D extends Document> extends Router {

    basePath: string;
    pageSize: number = 5;
    constructor(protected model: Model<D>) {
        super();
        this.basePath = `/${model.collection.name}`;
    }

    protected prepare(query: DocumentQuery<D | D[], D>): DocumentQuery<D | D[], D> {
        return query
    }

    envelop(document: any): any {
        let resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource;
    }

    validateId = (req: Request, resp: Response, next: Next) => {
        if (!Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'));
        } else {
            next();
        }
    }

    findAll = (req: Request, resp: Response, next: Next) => {
        let page = parseInt(req.query._page || 1);
        const skip = (page - 1) * this.pageSize;
        this.prepare(this.model.find())
            .limit(this.pageSize)
            .skip(skip)
            .then(this.render(resp, next))
            .catch(next);
    }

    findById = (req: Request, resp: Response, next: Next) => {
        this.prepare(this.model.findById(req.params.id))
            .then(this.render(resp, next))
            .catch(next);
    }

    save = (req: Request, resp: Response, next: Next) => {
        let document = new this.model(req.body);

        document.save()
            .then(this.render(resp, next))
            .catch(next);
    }


    replace = (req: Request, resp: Response, next: Next) => {
        const options: ModelUpdateOptions = { overwrite: true, runValidators: true };
        this.model.update({ _id: req.params.id }, req.body, options)
            .exec()
            .then(result  => {
                if (result.n) {
                    return <PromiseLike<D>> this.model.findById(req.params.id);
                } else {
                    throw new NotFoundError('Document Not Found');
                }
            })
            .then(this.render(resp, next))
            .catch(next);
    }


    update = (req: Request, resp: Response, next: Next) => {
        const options: ModelFindByIdAndUpdateOptions = { new: true, runValidators: true };
        this.model.findOneAndUpdate(req.params.id, req.body, options)
            .then(this.render(resp, next))
            .catch(next);
    }


    delete = (req: Request, resp: Response, next: Next) => {
        this.model.deleteOne({ _id: req.params.id }).then(result => {
            if (result.n) {
                resp.send(204);
            }
            else {
                throw new NotFoundError('Document Not Found');
            }
            return next();

        })
            .catch(next);
    }
}


