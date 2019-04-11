import { isNull, isUndefined } from 'lodash';
import { Headers, Response } from 'request';
import { RequestPromiseOptions } from 'request-promise-native';

import * as pkg from 'pjson';

const timeout = 4000;
const headers: Headers = [
    {
        name: 'User-Agent',
        value: `Pastebin-ts/${pkg.version}`,
    },
    {
        name: 'Cache-Control',
        value: 'no-cache',
    },
];

const getOptions = (method: string, params: {} = {}): RequestPromiseOptions => {
    const options: RequestPromiseOptions = {
        resolveWithFullResponse: true,
        method,
        headers,
        timeout,
        followRedirect: true,
    };
    if (method === 'GET') {
        options.qs = params;
    } else if (method === 'POST') {
        options.form = params;
    }

    return options;
};

const handleResponse = (response: Response, resolve: Function, reject: Function): void => {
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
        } else if ((<string>body).indexOf('Bad API request') !== -1) {
            reject(new Error((<string>body)));
        } else if ((<string>body).indexOf('Post limit') !== -1) {
            reject(new Error(`Error: ${body}`));
        } else {
            resolve(body);
        }
    }
};

export {
    getOptions,
    handleResponse,
};
