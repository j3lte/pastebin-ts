// const got = <Got | jest.Mock>require('got');
// const fsReadfilePromise = <any | jest.Mock>require('fs-readfile-promise');

// import { Got } from 'got';

// import {PastebinAPI} from '../src/api';

// import {createOptions} from './fixtures/responses';

// jest.mock('got');
// jest.mock('fs-readfile-promise');

// const responseLogin = { statusCode: 200, error: '', body: '431d212f439fa6da8d1cc5ff57355a2e' }
// const responseOK = { statusCode: 200, error: '', body: `
// <paste>
// 	<paste_key>4eWYATXe</paste_key>
// 	<paste_date>1319458935</paste_date>
// 	<paste_title>577 French MPs</paste_title>
// 	<paste_size>29397</paste_size>
// 	<paste_expire_date>0</paste_expire_date>
// 	<paste_private>0</paste_private>
// 	<paste_format_long>None</paste_format_long>
// 	<paste_format_short>text</paste_format_short>
// 	<paste_url>https://pastebin.com/4eWYATXe</paste_url>
// 	<paste_hits>804</paste_hits>
// </paste>
// ` };
// const responseFail = { statusCode: 200, error: '', body: 'fail' };
// const parsed = [{"paste_date": "1319458935", "paste_expire_date": "0", "paste_format_long": "None", "paste_format_short": "text", "paste_hits": "804", "paste_key": "4eWYATXe", "paste_private": "0", "paste_size": "29397", "paste_title": "577 French MPs", "paste_url": "https://pastebin.com/4eWYATXe"}]

// describe('listUserPastes', () => {
//     afterEach(() => {
//         (<jest.Mock>got).mockReset();
//     });

//     it('rejects when no key is present', async () => {
//         const pastebin = new PastebinAPI();
//         await expect(pastebin.listUserPastes()).rejects.toEqual(new Error('Dev key needed!'));
//     });

//     it('rejects when login info is missing', async () => {
//         const pastebin = new PastebinAPI({
//             api_dev_key: 'TESTKEY',
//             api_user_name: 'user@user.com'
//         });
//         await expect(pastebin.listUserPastes()).rejects.toEqual(new Error('The following keys are missing: api_user_password'));
//     });

//     it('list user pastes', async () => {
//         (<jest.Mock>got).mockImplementationOnce(async () => responseLogin).mockImplementationOnce(async () => responseOK);

//         const pastebin = new PastebinAPI({
//             api_dev_key: 'TESTKEY',
//             api_user_name: 'user@user.com',
//             api_user_password: 'Supersecret password'
//         });

//         const defaultOpts = createOptions('POST', {form: {
//             api_dev_key: 'TESTKEY',
//             api_option: 'list',
//             api_results_limit: 50,
//             api_user_key: '431d212f439fa6da8d1cc5ff57355a2e'
//         }});

//         await expect(pastebin.listUserPastes()).resolves.toEqual(parsed);

//         expect(got).lastCalledWith('https://pastebin.com/api/api_post.php', defaultOpts);
//     });

//     it('reject on empty response', async () => {
//         (<jest.Mock>got).mockImplementation(async () => responseFail);
//         const pastebin = new PastebinAPI({
//             api_dev_key: 'TESTKEY',
//             api_user_name: 'user@user.com',
//             api_user_password: 'Supersecret password'
//         });

//         const defaultOpts = createOptions('POST', {form: {
//             api_dev_key: 'TESTKEY',
//             api_option: 'list',
//             api_results_limit: 50,
//             api_user_key: '431d212f439fa6da8d1cc5ff57355a2e'
//         }});

//         await expect(pastebin.listUserPastes(-1)).rejects.toEqual(new Error('listUserPastes only accepts a limit between 1 and 1000'))
//         await expect(pastebin.listUserPastes(1002)).rejects.toEqual(new Error('listUserPastes only accepts a limit between 1 and 1000'))
//         await expect(pastebin.listUserPastes()).rejects.toEqual(new Error('No data returned to _parsePastes!'))
//     });
// });
