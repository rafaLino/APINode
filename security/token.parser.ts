import { RequestHandler, Request, Next } from "restify";
import * as jwt from 'jsonwebtoken'
import { environment } from "../common/environment";
import { User } from "../users/users.model";


export const tokenParser: RequestHandler = (req, resp, next) => {
    const token = extractToken(req);

    if (token) {
        jwt.verify(token, environment.security.apiSecret, applyBearer(req, next));
    } else {
        next();
    }
}

function extractToken(req: Request): string {
    const authorization = req.header('authorization');
    let token = undefined;
    if (authorization) {
        const parts: string[] = authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer')
            token = parts[1];
    }
    return token;
}


function applyBearer(req: Request, next: Next): (error: any, decoded: any) => void {
    return (error, decoded) => {
        if (decoded) {
            User.findByEmail(decoded.sub)
                .then(user => {
                    if (user) {
                        req.authenticated = user;
                    }
                    next();
                })
        } else {
            next()
        }
    }

}