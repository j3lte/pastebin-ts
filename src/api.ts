import {
    ICreatePasteFileOptions,
    ICreatePasteTextOptions,
    IPasteAPIOptions,
    IPastebinOptions,
} from './interfaces';

import {
    defaultOptions,
    ENDPOINTS,
    expiration as expirationLevels,
    formats,
    PRIVACY_LEVEL,
} from './config';

import { extend, forEach, isNull, isUndefined, keys, map } from 'lodash';

import { getRequest } from './methods/get';

import { postRequest } from './methods/post';

import * as fsReadfilePromise from 'fs-readfile-promise';
import { Parser } from 'xml2js';

export class PastebinAPI {
    private readonly config: IPastebinOptions;

    // Public methods

    /**
     *
     * @param config
     * @returns
     */
    constructor(config?: IPastebinOptions | string) {
        if (isUndefined(config) || isNull(config)) {
            this.config = {};

            return;
        }

        let conf: IPastebinOptions | string = config;
        if (typeof config === 'string') {
            conf = {
                api_dev_key: config,
            };
        }
        this.config = extend(defaultOptions, conf);
    }

    /**
     *
     * @param id ID of the paste
     * @param isPrivate is the paste private? Needs authentication
     * @returns
     */
    public async getPaste(
        id: string,
        isPrivate: boolean = false,
    ): Promise<string> {
        if (isPrivate) {
            const params = this.createParams('show_paste');
            params.api_paste_key = id;
            try {
                await this.createAPIuserKey();
                params.api_user_key = this.config.api_user_key;

                return this.postApi(ENDPOINTS.APIRAW, params);
            } catch (error) {
                return Promise.reject(error);
            }
        }

        return this.getApi(ENDPOINTS.RAW + id);
    }

    public async createPaste(options: ICreatePasteTextOptions): Promise<{}> {
        if (!this.hasDevKey()) {
            return Promise.reject(new Error('Dev key needed!'));
        }
        if (typeof options === 'undefined') {
            return Promise.reject(new Error('Create paste needs options!'));
        }

        const { text, title, format, expiration } = options;

        let { privacy } = options;

        if (isUndefined(privacy) || typeof privacy !== 'number') {
            privacy = PRIVACY_LEVEL.PUBLIC_ANONYMOUS;
        } else if (privacy > 3 || privacy < 0) {
            return Promise.reject(new Error('Privacy level can only be 0 - 3'));
        }

        const params = this.createParams('paste');

        params.api_paste_code = text;
        params.api_paste_private = privacy;

        if (typeof text !== 'string') {
            return Promise.reject(
                new Error('text can only be of type string!'),
            );
        }

        if (!Boolean(text) || text.length === 0) {
            return Promise.reject(new Error('Paste cannot have empty content'));
        }

        if (typeof title === 'string') {
            params.api_paste_name = title;
        }

        if (typeof format === 'string') {
            if (formats[format]) {
                params.api_paste_format = format;
            } else {
                return Promise.reject(
                    new Error(`Paste format ${options.format} is unknown!`),
                );
            }
        }

        if (
            privacy === PRIVACY_LEVEL.PRIVATE ||
            privacy === PRIVACY_LEVEL.PUBLIC_USER
        ) {
            try {
                await this.createAPIuserKey();
            } catch (error) {
                return Promise.reject(error);
            }
            params.api_user_key = this.config.api_user_key;
        }

        if (typeof expiration === 'string') {
            if (!isUndefined(expirationLevels[expiration])) {
                params.api_paste_expire_date = expiration;
            } else {
                return Promise.reject(
                    new Error(`Expiration format '${expiration}' is unknown!`),
                );
            }
        }

        params.api_paste_private =
            privacy === PRIVACY_LEVEL.PUBLIC_USER
                ? PRIVACY_LEVEL.PUBLIC_ANONYMOUS
                : privacy;

        return this.postApi(ENDPOINTS.POST, params);
    }

    public async createPasteFromFile(
        options: ICreatePasteFileOptions = { file: '' },
    ): Promise<{}> {
        if (options.file === '') {
            return Promise.reject(new Error('file is undefined'));
        }

        let data: string;
        try {
            if (Buffer.isBuffer(options.file)) {
                data = options.file.toString('utf-8');
            } else {
                data = await fsReadfilePromise(options.file, 'utf8');
            }
        } catch (error) {
            return Promise.reject(new Error(`Error reading file! ${error}`));
        }

        const pasteOpts = options as ICreatePasteTextOptions;
        delete pasteOpts.file;
        pasteOpts.text = data;

        return this.createPaste(pasteOpts);
    }

    public async deletePaste(pasteID: string): Promise<{}> {
        if (!this.hasDevKey()) {
            return Promise.reject(new Error('Dev key needed!'));
        }

        const params = this.createParams('delete');
        params.api_paste_key = pasteID;

        try {
            await this.createAPIuserKey();
        } catch (error) {
            return Promise.reject(error);
        }
        params.api_user_key = this.config.api_user_key;

        return this.postApi(ENDPOINTS.POST, params);
    }

    public listTrending(): Promise<{}> {
        if (!this.hasDevKey()) {
            return Promise.reject(new Error('Dev key needed!'));
        }
        const params = this.createParams('trends');

        return this.postAndParse(params, this.parsePastes);
    }

    public async listUserPastes(limit: number = 50): Promise<{}> {
        if (limit < 1 || limit > 1000) {
            return Promise.reject(
                new Error(
                    'listUserPastes only accepts a limit between 1 and 1000',
                ),
            );
        }
        if (!this.hasDevKey()) {
            return Promise.reject(new Error('Dev key needed!'));
        }

        const params = this.createParams('list');
        params.api_results_limit = limit;

        try {
            await this.createAPIuserKey();
        } catch (error) {
            return Promise.reject(error);
        }
        params.api_user_key = this.config.api_user_key;

        return this.postAndParse(params, this.parsePastes);
    }

    public async getUserInfo(): Promise<{}> {
        if (!this.hasDevKey()) {
            return Promise.reject(new Error('Dev key needed!'));
        }

        const params = this.createParams('userdetails');

        try {
            await this.createAPIuserKey();
        } catch (error) {
            return Promise.reject(error);
        }
        params.api_user_key = this.config.api_user_key;

        return this.postAndParse(params, this.parseUser);
    }

    // Private methods

    private createParams(option: string): IPasteAPIOptions {
        return {
            api_option: option,
            api_dev_key: this.config.api_dev_key,
        };
    }

    private createAPIuserKey(): Promise<void> {
        const inValid = this.validateConfig(
            'api_dev_key',
            'api_user_name',
            'api_user_password',
        );
        if (typeof inValid === 'string') {
            return Promise.reject(new Error(inValid));
        }
        if (
            !isUndefined(this.config.api_user_key) &&
            !isNull(this.config.api_user_key) &&
            this.config.api_user_key !== ''
        ) {
            // We already have a key. Returning
            return Promise.resolve();
        }
        const { api_dev_key, api_user_name, api_user_password } = this.config;

        return this.postApi(ENDPOINTS.LOGIN, {
            api_dev_key,
            api_user_name,
            api_user_password,
        }).then((data: string) => {
            const key = data.trim();
            if (key.length !== 32) {
                return Promise.reject(
                    new Error(`Error in creating user key: ${key}`),
                );
            }
            this.config.api_user_key = key;

            return Promise.resolve();
        });
    }

    private hasDevKey(): boolean {
        return this.validateConfig('api_dev_key') === false;
    }

    private validateConfig(...validateKeys: string[]): string | boolean {
        const missing = validateKeys.filter(
            (key: string) =>
                isUndefined(this.config[key]) ||
                this.config[key] === null ||
                this.config[key] === '',
        );

        if (missing.length > 0) {
            return `The following keys are missing: ${missing.join(',')}`;
        }

        return false;
    }

    private postAndParse(params: IPasteAPIOptions, parseFunc: Function) {
        return this.postApi(ENDPOINTS.POST, params).then((data: any) => {
            return parseFunc.call(this, data);
        });
    }

    private parsePastes(xml: string) {
        return this.parseXML(xml).then((data: { paste?: {} }) => {
            if (isUndefined(data) || isNull(data) || isUndefined(data.paste)) {
                throw new Error('No data returned to _parsePastes!');
            }

            return map(data.paste, (paste: {}) => {
                const obj = {};
                forEach(keys(paste), (key: string) => {
                    // tslint:disable-next-line
                    obj[key] = paste[key][0];
                });

                return obj;
            });
        });
    }

    private parseUser(xml: string) {
        return this.parseXML(xml).then((data: { user?: {}[] }) => {
            if (isUndefined(data) || isNull(data) || isUndefined(data.user)) {
                throw new Error('No data returned to _parseUser!');
            }
            const rootObj = data.user[0];
            const normalize = {};
            forEach(keys(rootObj), (key: string) => {
                // tslint:disable-next-line
                normalize[key] = rootObj[key][0];
            });

            return normalize;
        });
    }

    private parseXML(xml: string): Promise<unknown> {
        return new Promise((resolve: Function, reject: Function) => {
            const parser = new Parser({
                trim: true,
                explicitRoot: false,
            });

            parser.parseString(
                `<root>${xml}</root>`,
                (err: Error, data: {}) => {
                    if (!isNull(err)) {
                        return reject(
                            new Error(`Error in parsing XML: ${err}`),
                        );
                    }
                    resolve(data);
                },
            );
        });
    }

    private getApi(path: string, params?: {}): Promise<string> {
        return getRequest(path, params);
    }

    private postApi(path: string, params?: {}): Promise<string> {
        return postRequest(path, params);
    }
}
