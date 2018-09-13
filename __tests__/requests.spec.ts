const request = <RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl> | jest.Mock>require('request-promise-native');

import { RequestAPI, RequiredUriUrl, ResponseRequest } from 'request';
import { RequestPromise, RequestPromiseOptions } from 'request-promise-native';

import {getRequest, postRequest} from '../src/methods';

import {createOptions} from './fixtures/responses';

jest.mock('request-promise-native');

const response200 = { statusCode: 200, error: '', body: 'test' };
const response404 = { statusCode: 404, error: '', body: 'test' };
const response401 = { statusCode: 401, error: '', body: 'test' };
const responseNull = { statusCode: null, error: '', body: 'test' };
const responseEmpty = { statusCode: 200, error: '', body: '' };
const responseBadAPIRequest = { statusCode: 200, error: '', body: 'Bad API request' };
const responsePostLimit = { statusCode: 200, error: '', body: 'Post limit' };

describe('getRequest', () => {
    const url = 'https://pastebin.com/';
    const getOpts = createOptions('GET', {qs: {}});

    afterEach(() => {
        (<jest.Mock>request).mockReset();
    });

    it('reject an empty request', async () => {
        await expect(getRequest()).rejects;
    });

    it('makes a GET request', async () => {
        (<jest.Mock>request).mockImplementation(async () => response200);

        await expect(getRequest(url)).resolves.toBe(response200.body);

        expect(request).lastCalledWith(url, getOpts);
    });

    it('rejects a 404', async () => {
        (<jest.Mock>request).mockImplementation(async () => response404);

        await expect(getRequest(url)).rejects.toEqual(new Error('Error 404, not found'));

        expect(request).lastCalledWith(url, getOpts);
    });

    it('rejects an unknown status code', async () => {
        (<jest.Mock>request).mockImplementation(async () => responseNull);

        await expect(getRequest(url)).rejects.toEqual(new Error('Unknown status'));

        expect(request).lastCalledWith(url, getOpts);
    });

    it('rejects a status code other than 200', async () => {
        (<jest.Mock>request).mockImplementation(async () => response401);

        await expect(getRequest(url)).rejects.toEqual(new Error(`Unknown error, status: 401`));

        expect(request).lastCalledWith(url, getOpts);
    });

    it('rejects a an empty body', async () => {
        (<jest.Mock>request).mockImplementation(async () => responseEmpty);

        await expect(getRequest(url)).rejects.toEqual(new Error(`Empty response`));

        expect(request).lastCalledWith(url, getOpts);
    });

    it('rejects a bad API request', async () => {
        (<jest.Mock>request).mockImplementation(async () => responseBadAPIRequest);

        await expect(getRequest(url)).rejects.toEqual(new Error(`Bad API request`));

        expect(request).lastCalledWith(url, getOpts);
    });

    it('rejects when await throws an error', async () => {
        (<jest.Mock>request).mockRejectedValue(new Error('Unknown error'))

        await expect(getRequest(url)).rejects.toEqual(new Error(`Error: Unknown error`));

        expect(request).lastCalledWith(url, getOpts);
    });

    it('rejects when await throws a 404 error', async () => {
        const err: any = new Error('Error');
        err.statusCode = 404;
        (<jest.Mock>request).mockRejectedValue(err);

        await expect(getRequest(url)).rejects.toEqual(new Error(`Error 404, not found`));

        expect(request).lastCalledWith(url, getOpts);
    });
});

describe('postRequest', () => {
    const url = 'https://pastebin.com/';
    const postOpts = createOptions('POST', {form: {}});

    afterEach(() => {
        (<jest.Mock>request).mockReset();
    });

    it('reject an empty request', async () => {
        await expect(postRequest()).rejects;
    });

    it('makes a GET request', async () => {
        (<jest.Mock>request).mockImplementation(async () => response200);

        await expect(postRequest(url)).resolves.toBe(response200.body);

        expect(request).lastCalledWith(url, postOpts);
    });

    it('rejects a 404', async () => {
        (<jest.Mock>request).mockImplementation(async () => response404);

        await expect(postRequest(url)).rejects.toEqual(new Error('Error 404, not found'));

        expect(request).lastCalledWith(url, postOpts);
    });

    it('rejects an unknown status code', async () => {
        (<jest.Mock>request).mockImplementation(async () => responseNull);

        await expect(postRequest(url)).rejects.toEqual(new Error('Unknown status'));

        expect(request).lastCalledWith(url, postOpts);
    });

    it('rejects a status code other than 200', async () => {
        (<jest.Mock>request).mockImplementation(async () => response401);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Unknown error, status: 401`));

        expect(request).lastCalledWith(url, postOpts);
    });

    it('rejects a an empty body', async () => {
        (<jest.Mock>request).mockImplementation(async () => responseEmpty);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Empty response`));

        expect(request).lastCalledWith(url, postOpts);
    });

    it('rejects a bad API request', async () => {
        (<jest.Mock>request).mockImplementation(async () => responseBadAPIRequest);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Error: Bad API request`));

        expect(request).lastCalledWith(url, postOpts);
    });

    it('rejects a post limit', async () => {
        (<jest.Mock>request).mockImplementation(async () => responsePostLimit);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Error: Post limit`));

        expect(request).lastCalledWith(url, postOpts);
    });

    it('rejects when await throws an error', async () => {
        (<jest.Mock>request).mockRejectedValue(new Error('Unknown error'))

        await expect(postRequest(url)).rejects.toEqual(new Error(`Error: Unknown error`));

        expect(request).lastCalledWith(url, postOpts);
    });

    it('rejects when await throws a 404 error', async () => {
        const err: any = new Error('Error');
        err.statusCode = 404;
        (<jest.Mock>request).mockRejectedValue(err);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Error 404, not found`));

        expect(request).lastCalledWith(url, postOpts);
    });
});
