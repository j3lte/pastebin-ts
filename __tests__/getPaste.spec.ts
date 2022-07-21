const request = <
    | RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl>
    | jest.Mock
>require('request-promise-native');

import { RequestAPI, RequiredUriUrl } from 'request';
import {
    RequestPromise,
    RequestPromiseOptions,
    FullResponse,
} from 'request-promise-native';

import { PastebinAPI } from '../src/api';

import { createOptions } from './fixtures/responses';

jest.mock('request-promise-native');

const response1 = {
    statusCode: 200,
    error: '',
    body: 'test',
};
const responseLogin = { statusCode: 200, error: '', body: '431d212f439fa6da8d1cc5ff57355a2e' }

describe('getPaste anonymous', () => {
    const pastebin = new PastebinAPI();

    afterEach(() => {
        (<jest.Mock>request).mockReset();
    });

    it('reject an empty request', async () => {
        // @ts-ignore
        await expect(pastebin.getPaste()).rejects.toEqual(new Error('No response!'));
    });

    it('makes a GET request', async () => {
        (<jest.Mock>request).mockImplementation(async () => response1);

        const defaultOpts = createOptions('GET', { qs: {} });

        await expect(pastebin.getPaste('xxxxx')).resolves.toBe(response1.body);

        expect(request).lastCalledWith(
            'https://pastebin.com/raw.php?i=xxxxx',
            defaultOpts,
        );
    });

    it('makes a GET request for private', async () => {
        (<jest.Mock>request).mockImplementationOnce(async () => responseLogin).mockImplementationOnce(async () => response1);

        const pastebin2 = new PastebinAPI({
            api_dev_key: 'TESTKEY',
            api_user_name: 'user@user.com',
            api_user_password: 'Supersecret password'
        });
        const defaultOpts = createOptions('GET', { qs: {} });

        await expect(pastebin2.getPaste('xxxxx', true)).resolves.toBe(response1.body);
    });
});
