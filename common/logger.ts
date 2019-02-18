import * as bunyan from 'bunyan'
import { environment } from './environment'

export const logger = bunyan.createLogger({
    name: '',
    level: (<any>bunyan).resolveLevel(environment.log.level),

})