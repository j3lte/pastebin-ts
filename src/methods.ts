import * as RequestClient from 'request-promise-native';
// tslint:disable-next-line:no-require-imports no-var-requires
const request = <RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl>>require('request-promise-native');
import { Headers, RequestAPI, RequiredUriUrl } from 'request';
// tslint:disable-next-line:no-duplicate-imports
import { FullResponse, RequestPromise, RequestPromiseOptions } from 'request-promise-native';

import {isNull, isUndefined} from 'lodash';
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

export const getRequest = (path: string = '', params?: {}) => new Promise<string>(async (resolve: Function, reject: Function) => {
    const options: RequestPromiseOptions = getOptions('GET', params);

    if (path === '') {
        return reject(new Error('No path provided!'));
    }

    let response: FullResponse;
    try {
        // tslint:disable-next-line:await-promise no-unsafe-any
        response = await request(path, options);
    } catch (e) {
        // tslint:disable-next-line:no-unsafe-any
        if (e.statusCode && e.statusCode === 404) {
            return reject(new Error('Error 404, not found'));
        }

        return reject(new Error(<string> e));
    }

    const {statusCode, body} = response;

    if (isNull(statusCode) || isUndefined(statusCode)) {
        return reject(new Error('Unknown status'));
    } else if (statusCode === 404) {
        return reject(new Error('Error 404, not found'));
    } else if (statusCode !== 200) {
        return reject(new Error(`Unknown error, status: ${statusCode}`));
    } else if (isNull(body) || isUndefined(body) || body === '') {
        return reject(new Error('Empty response'));
    }

    if ((<string>body).indexOf('Bad API request') !== -1) {
        return reject(new Error((<string>body)));
    }

    resolve(body);
});

export const postRequest = (path: string = '', params?: {}) => new Promise<string>(async (resolve: Function, reject: Function) => {
    const options: RequestPromiseOptions = getOptions('POST', params);

    if (path === '') {
        return reject(new Error('No path provided!'));
    }

    let response: FullResponse;
    try {
        // tslint:disable-next-line:await-promise no-unsafe-any
        response = await request(path, options);
    } catch (e) {
        // tslint:disable-next-line:no-unsafe-any
        if (e.statusCode && e.statusCode === 404) {
            return reject(new Error('Error 404, not found'));
        }

        return reject(new Error(<string>e));
    }

    const {statusCode, body} = response;

    if (isNull(statusCode) || isUndefined(statusCode)) {
        return reject(new Error('Unknown status'));
    } else if (statusCode === 404) {
        return reject(new Error('Error 404, not found'));
    } else if (statusCode !== 200) {
        return reject(new Error(`Unknown error, status: ${statusCode}`));
    } else if (isNull(body) || isUndefined(body) || body === '') {
        return reject(new Error('Empty response'));
    } else if ((<string>body).indexOf('Bad API request') !== -1) {
        return reject(new Error(`Error: ${body}`));
    } else if ((<string>body).indexOf('Post limit') !== -1) {
        return reject(new Error(`Error: ${body}`));
    }

    // TO DO: Replace pastebin ID (http[s]?:\/\/pastebin\.com\/)
    resolve(body);
});
