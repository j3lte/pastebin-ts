import {PastebinAPI as Pastebin} from './api';

export {
    IPastebinOptions,
    ExpirationType,
    FormatType,
    ICreatePasteBaseOptions,
    ICreatePasteTextOptions,
    ICreatePasteFileOptions,
    IPasteAPIOptions,
} from './interfaces';

export type PastebinAPI = Pastebin;

exports = module.exports = Pastebin;
export default Pastebin;
