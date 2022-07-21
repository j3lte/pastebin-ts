import { Delays, Headers, Method, OptionsOfTextResponseBody, Response } from 'got';
import { isNull, isUndefined } from 'lodash';
import * as pkg from 'pjson';

const timeout: Delays = {
    request: 4000,
};
const headers: Headers = {
    'User-Agent': `Pastebin-ts/${pkg.version}`,
    'Cache-Control': 'no-cache',
};

const getOptions = (method: Method, params: {} = {}): OptionsOfTextResponseBody => {
    const options: OptionsOfTextResponseBody = {
        method,
        headers,
        timeout,
        followRedirect: true,
    };
    if (method === 'GET') {
        options.searchParams = params;
    } else if (method === 'POST') {
        options.form = params;
    }

    return options;
};

const handleResponse = (response: Response<string>, resolve: Function, reject: Function): void => {
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
