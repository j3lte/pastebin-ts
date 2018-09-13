const request = <RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl> | jest.Mock>require('request-promise-native');
const fsReadfilePromise = <any | jest.Mock>require('fs-readfile-promise');

import { RequestAPI, RequiredUriUrl } from 'request';
import { RequestPromise, RequestPromiseOptions, FullResponse } from 'request-promise-native';

import {PastebinAPI} from '../src/api';

import {createOptions} from './fixtures/responses';

jest.mock('request-promise-native');
jest.mock('fs-readfile-promise');

const responseOK = { statusCode: 200, error: '', body: `
<paste>
	<paste_key>4eWYATXe</paste_key>
	<paste_date>1319458935</paste_date>
	<paste_title>577 French MPs</paste_title>
	<paste_size>29397</paste_size>
	<paste_expire_date>0</paste_expire_date>
	<paste_private>0</paste_private>
	<paste_format_long>None</paste_format_long>
	<paste_format_short>text</paste_format_short>
	<paste_url>https://pastebin.com/4eWYATXe</paste_url>
	<paste_hits>804</paste_hits>
</paste>
` };
const responseFail = { statusCode: 200, error: '', body: 'fail' };
const parsed = [{"paste_date": "1319458935", "paste_expire_date": "0", "paste_format_long": "None", "paste_format_short": "text", "paste_hits": "804", "paste_key": "4eWYATXe", "paste_private": "0", "paste_size": "29397", "paste_title": "577 French MPs", "paste_url": "https://pastebin.com/4eWYATXe"}]

describe('listTrending', () => {
    afterEach(() => {
        (<jest.Mock>request).mockReset();
    });

    it('rejects when no key is present', async () => {
        const pastebin = new PastebinAPI();
        await expect(pastebin.listTrending()).rejects.toEqual(new Error('Dev key needed!'));
    });

    it('list trending', async () => {
        (<jest.Mock>request).mockImplementation(async () => responseOK);
        const pastebin = new PastebinAPI({
            api_dev_key: 'TESTKEY'
        });

        const defaultOpts = createOptions('POST', {form: {
            api_dev_key: 'TESTKEY',
            api_option: 'trends'
        }});

        await expect(pastebin.listTrending()).resolves.toEqual(parsed);

        expect(request).lastCalledWith('https://pastebin.com/api/api_post.php', defaultOpts);
    });

    it('reject on empty response', async () => {
        (<jest.Mock>request).mockImplementation(async () => responseFail);
        const pastebin = new PastebinAPI({
            api_dev_key: 'TESTKEY'
        });

        const defaultOpts = createOptions('POST', {form: {
            api_dev_key: 'TESTKEY',
            api_option: 'trends'
        }});

        await expect(pastebin.listTrending()).rejects.toEqual(new Error('No data returned to _parsePastes!'))

        expect(request).lastCalledWith('https://pastebin.com/api/api_post.php', defaultOpts);
    });
});
