import * as pkg from 'pjson';
import {extend} from 'lodash';

export const createOptions = (method, extraOpts) => {
    const defaultOptions = {
        "followRedirect": true,
        "headers": [
            {"name": "User-Agent", "value": `Pastebin-ts/${pkg.version}`},
            {"name": "Cache-Control", "value": "no-cache"}
        ],
        method,
        "resolveWithFullResponse": true,
        "timeout": 4000
    };
    return extend(defaultOptions, extraOpts);
}
