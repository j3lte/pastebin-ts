import got, { HTTPError, Response } from 'got';
import { handleResponse, headers, timeout } from './lib';

export const postRequest = (path: string = '', params: {} = {}) => new Promise<string>(async (resolve: Function, reject: Function) => {
    const options = {
        headers,
        timeout,
        followRedirect: true,
        form: params,
    };

    if (path === '') {
        // tslint:disable-next-line: no-unsafe-any
        return reject(new Error('No path provided!'));
    }

    got(path, {...options, method: 'POST'})
        .then((res: Response<string>) => {
            handleResponse(res, resolve, reject);
        })
        .catch((e: HTTPError)  => {
            // tslint:disable-next-line: no-typeof-undefined
            if (typeof e.response === 'undefined') {
                return reject(e);
            }

            if (e.response.statusCode === 404) {
                return reject(new Error('Error 404, not found'));
            }

            return reject(e);
        });
});
