import got from 'got';
import type { OptionsOfTextResponseBody, Response } from 'got';
import { getOptions, handleResponse } from './lib';

export const getRequest = (path: string = '', params?: {}) => new Promise<string>(async (resolve: Function, reject: Function) => {
    const options: OptionsOfTextResponseBody = getOptions('GET', params);

    if (path === '') {
        return reject(new Error('No path provided!'));
    }

    let response: Response<string>;
    try {
        response = await got.get(path, options);
    } catch (e) {
        // tslint:disable-next-line:no-unsafe-any
        if (e.statusCode && e.statusCode === 404) {
            return reject(new Error('Error 404, not found'));
        }

        return reject(new Error(<string> e));
    }

    handleResponse(response, resolve, reject);
});
