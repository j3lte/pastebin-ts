// const got = <Got | jest.Mock>require('got');

// import { Got } from 'got';

// import {PastebinAPI} from '../src/api';

// import {createOptions} from './fixtures/responses';

// jest.mock('got');

// const response1 = {
//     statusCode: 200,
//     error: '',
//     body: 'test'
// };

// describe('getPaste anonymous', () => {
//     const pastebin = new PastebinAPI();

//     afterEach(() => {
//         (<jest.Mock>got).mockReset();
//     });

//     it('reject an empty request', async () => {
//         // @ts-ignore
//         await expect(pastebin.getPaste()).rejects;
//     });

//     it('makes a GET request', async () => {
//         (<jest.Mock>got).mockImplementation(async () => response1);

//         const defaultOpts = createOptions('GET', {qs: {}});

//         await expect(pastebin.getPaste('xxxxx')).resolves.toBe(response1.body);

//         expect(got).lastCalledWith('https://pastebin.com/raw.php?i=xxxxx', defaultOpts);
//     });
// });
