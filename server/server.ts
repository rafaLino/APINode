import * as restify from 'restify'
import { environment } from '../common/environment'
import { Router } from '../common/router'
import * as mongoose from 'mongoose'
import { mergePatchBodyParser } from './merge-patch.parser'
import { handleError } from './error.handler'
import { tokenParser } from '../security/token.parser'
import { readFileSync } from 'fs';
import { logger } from '../common/logger'
import * as corsMiddleware from 'restify-cors-middleware'
export class Server {

    application: restify.Server;


    private initializeDb(): Promise<typeof mongoose> {
        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
    }
    private initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger
                }

                if (environment.security.enableHTTPS) {
                    options.certificate = readFileSync(environment.security.certificate);
                    options.key = readFileSync(environment.security.key);
                }

                this.application = restify.createServer(options);

                const corsOptions: corsMiddleware.Options = {
                    preflightMaxAge: 86400,
                    origins: ['*'],
                    allowHeaders: ['authorization'],
                    exposeHeaders: ['x-custom-header']
                }

                const cors : corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions);

                this.application.pre(cors.preflight);
                //plugins
                this.application.use(cors.actual);
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(mergePatchBodyParser);
                this.application.use(tokenParser); 


                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

                this.application.on('restifyError', handleError);

                //loggers 
                this.application.pre(restify.plugins.requestLogger({
                    log: logger
                }));

                //audit logger
                // this.application.on('after', restify.plugins.auditLogger({
                //     log: logger,
                //     event: 'after',
                //     body: true,
                //     server: this.application
                // }));

                // this.application.on('audit', data => {

                // })

            } catch (error) {
                reject(error);
            }
        })
    }



    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this));

    }

    shutDown() {
        return mongoose.disconnect().then(() => this.application.close());
    }


}