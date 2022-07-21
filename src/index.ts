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
export default Pastebin;
