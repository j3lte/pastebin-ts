// const got = <Got | jest.Mock>require('got');
// const fsReadfilePromise = <any | jest.Mock>require('fs-readfile-promise');

// import { Got } from 'got';

// import {PastebinAPI} from '../src/api';

// import {createOptions} from './fixtures/responses';

// jest.mock('got');
// jest.mock('fs-readfile-promise');

// const responseLogin = { statusCode: 200, error: '', body: '431d212f439fa6da8d1cc5ff57355a2e' }
// const responseOK = { statusCode: 200, error: '', body: `
// <user>
// 	<user_name>wiz_kitty</user_name>
// 	<user_format_short>text</user_format_short>
// 	<user_expiration>N</user_expiration>
// 	<user_avatar_url>https://pastebin.com/cache/a/1.jpg</user_avatar_url>
// 	<user_private>1</user_private> (0 Public, 1 Unlisted, 2 Private)
// 	<user_website>https://myawesomesite.com</user_website>
// 	<user_email>oh@dear.com</user_email>
// 	<user_location>New York</user_location>
// 	<user_account_type>1</user_account_type> (0 normal, 1 PRO)
// </user>
// ` };
// const responseFail = { statusCode: 200, error: '', body: 'fail' };
// const responseXMLFail = { statusCode: 200, error: '', body: '</root>' };
// const parsed = {"_": "(", "user_account_type": "1", "user_avatar_url": "https://pastebin.com/cache/a/1.jpg", "user_email": "oh@dear.com", "user_expiration": "N", "user_format_short": "text", "user_location": "New York", "user_name": "wiz_kitty", "user_private": "1", "user_website": "https://myawesomesite.com"};

// describe('getUserInfo', () => {
//     afterEach(() => {
//         (<jest.Mock>got).mockReset();
//     });

//     it('rejects when no key is present', async () => {
//         const pastebin = new PastebinAPI();
//         await expect(pastebin.getUserInfo()).rejects.toEqual(new Error('Dev key needed!'));
//     });

//     it('rejects when login info is missing', async () => {
//         const pastebin = new PastebinAPI({
//             api_dev_key: 'TESTKEY',
//             api_user_name: 'user@user.com'
//         });
//         await expect(pastebin.getUserInfo()).rejects.toEqual(new Error('The following keys are missing: api_user_password'));
//     });

//     it('list user info', async () => {
//         (<jest.Mock>got).mockImplementationOnce(async () => responseLogin).mockImplementationOnce(async () => responseOK);

//         const pastebin = new PastebinAPI({
//             api_dev_key: 'TESTKEY',
//             api_user_name: 'user@user.com',
//             api_user_password: 'Supersecret password'
//         });

//         const defaultOpts = createOptions('POST', {form: {
//             api_dev_key: 'TESTKEY',
//             api_option: 'userdetails',
//             api_user_key: '431d212f439fa6da8d1cc5ff57355a2e'
//         }});

//         await expect(pastebin.getUserInfo()).resolves.toEqual(parsed);

//         expect(got).lastCalledWith('https://pastebin.com/api/api_post.php', defaultOpts);
//     });

//     it('reject on empty response', async () => {
//         (<jest.Mock>got).mockImplementation(async () => responseFail);
//         const pastebin = new PastebinAPI({
//             api_dev_key: 'TESTKEY',
//             api_user_name: 'user@user.com',
//             api_user_password: 'Supersecret password'
//         });

//         await expect(pastebin.getUserInfo()).rejects.toEqual(new Error('No data returned to _parseUser!'));
//     });

//     it('reject on xml fail', async () => {
//         (<jest.Mock>got).mockImplementation(async () => responseXMLFail);
//         const pastebin = new PastebinAPI({
//             api_dev_key: 'TESTKEY',
//             api_user_name: 'user@user.com',
//             api_user_password: 'Supersecret password'
//         });

//         await expect(pastebin.getUserInfo()).rejects.toEqual(new Error('No data returned to _parseUser!'));
//     });
// });
