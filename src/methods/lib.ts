import { Headers, Method, Response } from 'got';
import { isNull, isUndefined } from 'lodash';

import * as pkg from 'pjson';

export const timeout = 4000;
export const headers: Headers = {
    'User-Agent': `Pastebin-ts/${pkg.version}`,
    'Cache-Control': 'no-cache',
};

export const handleResponse = (response: Response<string>, resolve: Function, reject: Function): void => {
    if (response === null || response === undefined) {
        reject(new Error('No response!'));
    } else {
        const {statusCode, body} = response;

        if (isNull(statusCode) || isUndefined(statusCode)) {
            reject(new Error('Unknown status'));
        } else if (statusCode === 404) {
            reject(new Error('Error 404, not found'));
        } else if (statusCode !== 200) {
            reject(new Error(`Unknown error, status: ${statusCode}`));
        } else if (isNull(body) || isUndefined(body) || body === '') {
            reject(new Error('Empty response'));
        } else if ((body).indexOf('Bad API request') !== -1) {
            reject(new Error((body)));
        } else if ((body).indexOf('Post limit') !== -1) {
            reject(new Error(`Error: ${body}`));
        } else {
            resolve(body);
        }
    }
};
