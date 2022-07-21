import got from 'got';
import type { OptionsOfTextResponseBody, Response } from 'got';
import { getOptions, handleResponse} from './lib';

export const postRequest = (path: string = '', params?: {}) => new Promise<string>(async (resolve: Function, reject: Function) => {
    const options: OptionsOfTextResponseBody = getOptions('POST', params);

    if (path === '') {
        return reject(new Error('No path provided!'));
    }

    let response: Response<string>;
    try {
        // tslint:disable-next-line:await-promise no-unsafe-any
        response = await got.post(path, options);
    } catch (e) {
        // tslint:disable-next-line:no-unsafe-any
        if (e.statusCode && e.statusCode === 404) {
            return reject(new Error('Error 404, not found'));
        }

        return reject(new Error(<string>e));
    }

    handleResponse(response, resolve, reject);
});
