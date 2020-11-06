import * as pkg from 'pjson';
import {extend} from 'lodash';

export const createOptions = (method, extraOpts) => {
    const defaultOptions = {
        "followRedirect": true,
        "headers": {
            "User-Agent": `Pastebin-ts/${pkg.version}`,
            "Cache-Control": "no-cache"
        },
        method,
        "timeout": 4000
    };
    return extend(defaultOptions, extraOpts);
}
