// const got = <Got | jest.Mock>require('got');
// const fsReadfilePromise = <any | jest.Mock>require('fs-readfile-promise');

// import { Got } from 'got';
// import {PastebinAPI} from '../src/api';

// import {createOptions} from './fixtures/responses';

// jest.mock('got');
// jest.mock('fs-readfile-promise');

// const response1 = { statusCode: 200, error: '', body: 'https://pastebin.com/udncy74' };
// const responseOK = { statusCode: 200, error: '', body: 'ok' };
// const responseLogin = { statusCode: 200, error: '', body: '431d212f439fa6da8d1cc5ff57355a2e' }
// const responseWrongLogin = { statusCode: 200, error: '', body: '431d21439fa6da8d1cc5ff57355a2e' }

// describe('deletePaste', () => {
//     afterEach(() => {
//         (<jest.Mock>got).mockReset();
//         (<jest.Mock>fsReadfilePromise).mockReset();
//     });

//     it('reject an empty got', async () => {
//         const pastebin = new PastebinAPI('TESTKEY');
//         // @ts-ignore
//         await expect(pastebin.deletePaste()).rejects;
//     });

//     it('rejects when no key is present', async () => {
//         const pastebin = new PastebinAPI();
//         await expect(pastebin.deletePaste('xxxx')).rejects.toEqual(new Error('Dev key needed!'));
//     });

//     it('create a private paste', async () => {
//         const pastebin = new PastebinAPI({
//             api_dev_key: 'TESTKEY',
//             api_user_name: 'user@user.com',
//             api_user_password: 'Supersecret password'
//         });

//         (<jest.Mock>got).mockImplementationOnce(async () => responseLogin).mockImplementationOnce(async () => responseOK);

//         const defaultOpts = createOptions('POST', {form: {
//             api_dev_key: 'TESTKEY',
//             api_option: 'delete',
//             api_paste_key: 'xxxx',
//             api_user_key: '431d212f439fa6da8d1cc5ff57355a2e'
//         }});

//         await expect(pastebin.deletePaste('xxxx')).resolves.toBe(responseOK.body);

//         expect(got).lastCalledWith('https://pastebin.com/api/api_post.php', defaultOpts);
//     });
// });
