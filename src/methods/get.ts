import * as RequestClient from 'request-promise-native';
// tslint:disable-next-line:no-require-imports no-var-requires
const request = <RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl>>require('request-promise-native');
import { RequestAPI, RequiredUriUrl } from 'request';
// tslint:disable-next-line:no-duplicate-imports
import { FullResponse, RequestPromise, RequestPromiseOptions } from 'request-promise-native';
import { getOptions, handleResponse } from './lib';

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

    handleResponse(response, resolve, reject);
});
