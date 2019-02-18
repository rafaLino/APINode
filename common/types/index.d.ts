import { User } from '../../users/users.model'
import {Request} from 'restify'


declare module 'restify' {
    export interface Request {
        authenticated: User
    }
}