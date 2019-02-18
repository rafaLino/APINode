import * as restify from 'restify'
import { EventEmitter } from 'events';




export abstract class Router extends EventEmitter {

    abstract applyRoutes(application: restify.Server): void;

    envelop(document: any): any {
        return document
    }


    render(response: restify.Response, next: restify.Next) {
        return (document: any | any[]) => {
            if (document) {

                if (document instanceof Array) {
                    document.forEach((doc, index, array) => {
                        this.emit('beforeRender', doc);
                        array[index] = this.envelop(doc);
                    })
                }
                else {
                    this.emit('beforeRender', document);
                    document = this.envelop(document);
                }


            } else {
                document = [];
            }
            response.json(document);
            return next(false);
        }
    }

}