const request = <RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl> | jest.Mock>require('request-promise-native');
const fsReadfilePromise = <any | jest.Mock>require('fs-readfile-promise');

import { RequestAPI, RequiredUriUrl } from 'request';
import { RequestPromise, RequestPromiseOptions, FullResponse } from 'request-promise-native';

import {PastebinAPI} from '../src/api';

import {createOptions} from './fixtures/responses';

jest.mock('request-promise-native');
jest.mock('fs-readfile-promise');

const response1 = { statusCode: 200, error: '', body: 'https://pastebin.com/udncy74' };
const responseLogin = { statusCode: 200, error: '', body: '431d212f439fa6da8d1cc5ff57355a2e' }
const responseWrongLogin = { statusCode: 200, error: '', body: '431d21439fa6da8d1cc5ff57355a2e' }

describe('createPaste', () => {
    afterEach(() => {
        (<jest.Mock>request).mockReset();
        (<jest.Mock>fsReadfilePromise).mockReset();
    });

    it('reject an empty request', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        // @ts-ignore
        await expect(pastebin.createPaste()).rejects.toEqual(new Error('Create paste needs options!'));
    });

    it('rejects when no key is present', async () => {
        const pastebin = new PastebinAPI();
        await expect(pastebin.createPaste({text: 'TEST'})).rejects.toEqual(new Error('Dev key needed!'));
    });

    it('rejects when text is empty', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        await expect(pastebin.createPaste({text: ''})).rejects.toEqual(new Error('Paste cannot have empty content'));
    });

    it('rejects with wrong privacy level', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        const err = new Error('Privacy level can only be 0 - 3');
        await expect(pastebin.createPaste({text: 'TEST', privacy: -1})).rejects.toEqual(err);
        await expect(pastebin.createPaste({text: 'TEST', privacy: 5})).rejects.toEqual(err);
    });

    it('rejects with wrong expiration', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        const err = new Error('Expiration format \'WRONG\' is unknown!');
        // @ts-ignore
        await expect(pastebin.createPaste({text: 'TEST', expiration: 'WRONG'})).rejects.toEqual(err);
    });

    it('rejects with wrong format', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        const err = new Error('Paste format unknown is unknown!');
        // @ts-ignore
        await expect(pastebin.createPaste({text: 'TEST', format: 'unknown'})).rejects.toEqual(err);
    });

    it('rejects when text is not a string', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        const err = new Error('text can only be of type string!');
        // @ts-ignore
        await expect(pastebin.createPaste({text: 1111})).rejects.toEqual(err);
        // @ts-ignore
        await expect(pastebin.createPaste({text: null})).rejects.toEqual(err);
    });

    it('rejects when file is not present', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        (<jest.Mock>fsReadfilePromise).mockImplementation(async () => 'TESTING');
        const err = new Error('file is undefined');
        await expect(pastebin.createPasteFromFile()).rejects.toEqual(err);
    });

    it('rejects when file cannot be read', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        const err = new Error('Error reading file! Unknown error');

        (<jest.Mock>fsReadfilePromise).mockRejectedValue('Unknown error')

        await expect(pastebin.createPasteFromFile({file: 'test.xml'})).rejects.toEqual(err);
    });

    it('create a simple paste', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        (<jest.Mock>request).mockImplementation(async () => response1);

        const defaultOpts = createOptions('POST', {form: {
            api_dev_key: 'TESTKEY',
            api_option: 'paste',
            api_paste_expire_date: 'N',
            api_paste_code: 'TEST',
            api_paste_format: 'typoscript',
            api_paste_name: 'title',
            api_paste_private: 0
        }});

        await expect(pastebin.createPaste({text: 'TEST', expiration: 'N', title: 'title', format: 'typoscript'})).resolves.toBe(response1.body);

        expect(request).lastCalledWith('https://pastebin.com/api/api_post.php', defaultOpts);
    });

    it('create a simple paste from file', async () => {
        const pastebin = new PastebinAPI('TESTKEY');
        (<jest.Mock>request).mockImplementation(async () => response1);
        (<jest.Mock>fsReadfilePromise).mockImplementation(async () => 'TESTING');

        const defaultOpts = createOptions('POST', {form: {
            api_dev_key: 'TESTKEY',
            api_option: 'paste',
            api_paste_expire_date: 'N',
            api_paste_code: 'TESTING',
            api_paste_format: 'typoscript',
            api_paste_name: 'title',
            api_paste_private: 0
        }});

        await expect(pastebin.createPasteFromFile({file: 'test.js', expiration: 'N', title: 'title', format: 'typoscript'})).resolves.toBe(response1.body);

        expect(request).lastCalledWith('https://pastebin.com/api/api_post.php', defaultOpts);
    });

    it('rejects a private paste when user_name is missing', async () => {
        const pastebin = new PastebinAPI({
            api_dev_key: 'TESTKEY',
            api_user_password: 'Supersecret password'
        });

        (<jest.Mock>request).mockImplementationOnce(async () => responseLogin).mockImplementationOnce(async () => response1);

        await expect(pastebin.createPaste({text: 'TEST', privacy: 2 })).rejects.toEqual(new Error('The following keys are missing: api_user_name'));
    });

    it('rejects a private paste when user_key cannot be created', async () => {
        const pastebin = new PastebinAPI({
            api_dev_key: 'TESTKEY',
            api_user_name: 'user@user.com',
            api_user_password: 'Supersecret password'
        });

        (<jest.Mock>request).mockImplementationOnce(async () => responseWrongLogin).mockImplementationOnce(async () => response1);

        await expect(pastebin.createPaste({text: 'TEST', privacy: 2 })).rejects.toEqual(new Error('Error in creating user key: 431d21439fa6da8d1cc5ff57355a2e'));
    });

    it('create a private paste', async () => {
        const pastebin = new PastebinAPI({
            api_dev_key: 'TESTKEY',
            api_user_name: 'user@user.com',
            api_user_password: 'Supersecret password'
        });

        (<jest.Mock>request).mockImplementationOnce(async () => responseLogin).mockImplementationOnce(async () => response1);

        const defaultOpts = createOptions('POST', {form: {
            api_dev_key: 'TESTKEY',
            api_option: 'paste',
            api_paste_code: 'TEST',
            api_paste_private: 2,
            api_user_key: '431d212f439fa6da8d1cc5ff57355a2e'
        }});

        await expect(pastebin.createPaste({text: 'TEST', privacy: 2 })).resolves.toBe(response1.body);

        expect(request).lastCalledWith('https://pastebin.com/api/api_post.php', defaultOpts);
    });

    it('create a public paste, under user name', async () => {
        const pastebin = new PastebinAPI({
            api_dev_key: 'TESTKEY',
            api_user_name: 'user@user.com',
            api_user_password: 'Supersecret password'
        });

        (<jest.Mock>request).mockImplementation(async () => response1);

        const defaultOpts = createOptions('POST', {form: {
            api_dev_key: 'TESTKEY',
            api_option: 'paste',
            api_paste_code: 'TEST',
            api_paste_private: 0,
            api_user_key: '431d212f439fa6da8d1cc5ff57355a2e'
        }});

        await expect(pastebin.createPaste({text: 'TEST', privacy: 3 })).resolves.toBe(response1.body);

        expect(request).lastCalledWith('https://pastebin.com/api/api_post.php', defaultOpts);
    });
});
