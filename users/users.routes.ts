import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { User } from '../users/users.model'
import { authenticate } from '../security/auth.handler'
import { authorize } from '../security/authz.handler';




class UsersRouter extends ModelRouter<User> {


    constructor() {
        super(User);
        this.on('beforeRender', document => {
            document.password = undefined;
        })

    }

    findByEmail = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email)
                .then(this.render(resp, next))
                .catch(next);
        } else {
            next();
        }
    }

    applyRoutes(application: restify.Server) {

        application.get({ path: `${this.basePath}`, version: '2.0.0' }, restify.plugins.conditionalHandler([
            { version: '2.0.0', handler: [authorize('admin'), this.findByEmail, this.findAll] },
            { version: '1.0.0', handler: [authorize('admin'), this.findAll] }
        ]));

        application.get(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.findById]);

        application.post(`${this.basePath}`,[authorize('admin'), this.save]);

        application.put(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.replace]);

        application.patch(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.update]);

        application.del(`${this.basePath}/:id`, [authorize('admin'),this.validateId, this.delete]);

        application.post(`${this.basePath}/authenticate`, authenticate);

    }
}

export const usersRouter = new UsersRouter();