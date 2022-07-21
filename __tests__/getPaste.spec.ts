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
});
