import got from 'got';
import {getRequest} from '../src/methods/get';
import {postRequest} from '../src/methods/post';

import {createOptions} from './fixtures/responses';

jest.mock('got');

const response200 = { statusCode: 200, error: '', body: 'test' };
const response404 = { statusCode: 404, error: '', body: 'test' };
const response401 = { statusCode: 401, error: '', body: 'test' };
const responseNull = { statusCode: null, error: '', body: 'test' };
const responseEmpty = { statusCode: 200, error: '', body: '' };
const responseBadAPIRequest = { statusCode: 200, error: '', body: 'Bad API request' };
const responsePostLimit = { statusCode: 200, error: '', body: 'Post limit' };

describe('getRequest', () => {
    const url = 'https://pastebin.com/';
    const getOpts = createOptions('GET', {searchParams: {}});

    afterEach(jest.clearAllMocks);

    it('reject an empty request', async () => {
        await expect(getRequest()).rejects;
    });

    it('makes a GET request', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(response200);

        await expect(getRequest(url)).resolves.toBe(response200.body);

        expect(got).lastCalledWith(url, getOpts);
    });

    it('rejects a 404', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(response404);

        await expect(getRequest(url)).rejects.toEqual(new Error('Error 404, not found'));

        expect(got).lastCalledWith(url, getOpts);
    });

    it('rejects an unknown status code', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(responseNull);

        await expect(getRequest(url)).rejects.toEqual(new Error('Unknown status'));

        expect(got).lastCalledWith(url, getOpts);
    });

    it('rejects a status code other than 200', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(response401);

        await expect(getRequest(url)).rejects.toEqual(new Error(`Unknown error, status: 401`));

        expect(got).lastCalledWith(url, getOpts);
    });

    it('rejects a an empty body', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(responseEmpty);

        await expect(getRequest(url)).rejects.toEqual(new Error(`Empty response`));

        expect(got).lastCalledWith(url, getOpts);
    });

    it('rejects a bad API request', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(responseBadAPIRequest);

        await expect(getRequest(url)).rejects.toEqual(new Error(`Bad API request`));

        expect(got).lastCalledWith(url, getOpts);
    });

    it('rejects when await throws an error', async () => {
        ((got as unknown) as jest.Mock).mockRejectedValue(new Error(`Error: Unknown error`));

        await expect(getRequest(url)).rejects.toEqual(new Error(`Error: Unknown error`));

        expect(got).lastCalledWith(url, getOpts);
    });

    // it('rejects when await throws a 404 error', async () => {
    //     const err: any = new Error('Error');
    //     err.statusCode = 404;
    //     ((got as unknown) as jest.Mock).mockRejectedValue(err);

    //     await expect(getRequest(url)).rejects.toEqual(new Error(`Error 404, not found`));

    //     expect(got).lastCalledWith(url, getOpts);
    // });
});

describe('postRequest', () => {
    const url = 'https://pastebin.com/';
    const postOpts = createOptions('POST', {form: {}});

    afterEach(jest.clearAllMocks);

    it('reject an empty request', async () => {
        await expect(postRequest()).rejects;
    });

    it('makes a GET request', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(response200);

        await expect(postRequest(url)).resolves.toBe(response200.body);

        expect(got).lastCalledWith(url, postOpts);
    });

    it('rejects a 404', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(response404);

        await expect(postRequest(url)).rejects.toEqual(new Error('Error 404, not found'));

        expect(got).lastCalledWith(url, postOpts);
    });

    it('rejects an unknown status code', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(responseNull);

        await expect(postRequest(url)).rejects.toEqual(new Error('Unknown status'));

        expect(got).lastCalledWith(url, postOpts);
    });

    it('rejects a status code other than 200', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(response401);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Unknown error, status: 401`));

        expect(got).lastCalledWith(url, postOpts);
    });

    it('rejects a an empty body', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(responseEmpty);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Empty response`));

        expect(got).lastCalledWith(url, postOpts);
    });

    it('rejects a bad API request', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(responseBadAPIRequest);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Bad API request`));

        expect(got).lastCalledWith(url, postOpts);
    });

    it('rejects a post limit', async () => {
        ((got as unknown) as jest.Mock).mockResolvedValue(responsePostLimit);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Error: Post limit`));

        expect(got).lastCalledWith(url, postOpts);
    });

    // it('rejects when await throws an error', async () => {
    //     ((got as unknown) as jest.Mock).mockResolvedValue(new Error('Unknown error'))

    //     await expect(postRequest(url)).rejects.toEqual(new Error(`Error: Unknown error`));

    //     expect(got).lastCalledWith(url, postOpts);
    // });

    it('rejects when await throws a 404 error', async () => {
        const err: any = new Error('Error');
        err.statusCode = 404;
        ((got as unknown) as jest.Mock).mockResolvedValue(err);

        await expect(postRequest(url)).rejects.toEqual(new Error(`Error 404, not found`));

        expect(got).lastCalledWith(url, postOpts);
    });
});
