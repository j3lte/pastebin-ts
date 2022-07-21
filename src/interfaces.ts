export interface IPastebinOptions {
    api_dev_key? : null | string;
    api_user_key? : null | string;
    api_user_name? : null | string;
    api_user_password? : null | string;
}

export type ExpirationType = 'N' | '10M' | '1H' | '1D' | '1W' | '2W' | '1M' | null;
export type FormatType = '4cs' | '6502acme' | '6502kickass' | '6502tasm' | 'abap' | 'actionscript' |
'actionscript3' | 'ada' | 'aimms' | 'algol68' | 'apache' | 'applescript' | 'apt_sources' | 'arm' |
'asm' | 'asp' | 'asymptote' | 'autoconf' | 'autohotkey' | 'autoit' | 'avisynth' | 'awk' |
'bascomavr' | 'bash' | 'basic4gl' | 'dos' | 'bibtex' | 'blitzbasic' | 'b3d' | 'bmx' | 'bnf' |
'boo' | 'bf' | 'c' | 'c_winapi' | 'c_mac' | 'cil' | 'csharp' | 'cpp' | 'cpp-winapi' | 'cpp-qt' |
'c_loadrunner' | 'caddcl' | 'cadlisp' | 'cfdg' | 'chaiscript' | 'chapel' | 'clojure' | 'klonec' |
'klonecpp' | 'cmake' | 'cobol' | 'coffeescript' | 'cfm' | 'css' | 'cuesheet' | 'd' | 'dart' |
'dcl' | 'dcpu16' | 'dcs' | 'delphi' | 'oxygene' | 'diff' | 'div' | 'dot' | 'e' | 'ezt' |
'ecmascript' | 'eiffel' | 'email' | 'epc' | 'erlang' | 'euphoria' | 'fsharp' | 'falcon' |
'filemaker' | 'fo' | 'f1' | 'fortran' | 'freebasic' | 'freeswitch' | 'gambas' | 'gml' | 'gdb' |
'genero' | 'genie' | 'gettext' | 'go' | 'groovy' | 'gwbasic' | 'haskell' | 'haxe' | 'hicest' |
'hq9plus' | 'html4strict' | 'html5' | 'icon' | 'idl' | 'ini' | 'inno' | 'intercal' | 'io' |
'ispfpanel' | 'j' | 'java' | 'java5' | 'javascript' | 'jcl' | 'jquery' | 'json' | 'julia' |
'kixtart' | 'latex' | 'ldif' | 'lb' | 'lsl2' | 'lisp' | 'llvm' | 'locobasic' | 'logtalk' |
'lolcode' | 'lotusformulas' | 'lotusscript' | 'lscript' | 'lua' | 'm68k' | 'magiksf' |
'make' | 'mapbasic' | 'markdown' | 'matlab' | 'mirc' | 'mmix' | 'modula2' | 'modula3' |
'68000devpac' | 'mpasm' | 'mxml' | 'mysql' | 'nagios' | 'netrexx' | 'newlisp' | 'nginx' |
'nimrod' | 'text' | 'nsis' | 'oberon2' | 'objeck' | 'objc' | 'ocaml-brief' | 'ocaml' | 'octave' |
'oorexx' | 'pf' | 'glsl' | 'oobas' | 'oracle11' | 'oracle8' | 'oz' | 'parasail' | 'parigp' |
'pascal' | 'pawn' | 'pcre' | 'per' | 'perl' | 'perl6' | 'php' | 'php-brief' | 'pic16' | 'pike' |
'pixelbender' | 'pli' | 'plsql' | 'postgresql' | 'postscript' | 'povray' | 'powershell' | 'powerbuilder' |
'proftpd' | 'progress' | 'prolog' | 'properties' | 'providex' | 'puppet' | 'purebasic' | 'pycon' |
'python' | 'pys60' | 'q' | 'qbasic' | 'qml' | 'rsplus' | 'racket' | 'rails' | 'rbs' | 'rebol' |
'reg' | 'rexx' | 'robots' | 'rpmspec' | 'ruby' | 'gnuplot' | 'rust' | 'sas' | 'scala' | 'scheme' |
'scilab' | 'scl' | 'sdlbasic' | 'smalltalk' | 'smarty' | 'spark' | 'sparql' | 'sqf' | 'sql' |
'standardml' | 'stonescript' | 'sclang' | 'swift' | 'systemverilog' | 'tsql' | 'tcl' | 'teraterm' |
'thinbasic' | 'typoscript' | 'unicon' | 'uscript' | 'upc' | 'urbi' | 'vala' | 'vbnet' | 'vbscript' |
'vedit' | 'verilog' | 'vhdl' | 'vim' | 'visualprolog' | 'vb' | 'visualfoxpro' | 'whitespace' |
'whois' | 'winbatch' | 'xbasic' | 'xml' | 'xorg_conf' | 'xpp' | 'yaml' | 'z80' | 'zxbasic' | null;

export interface ICreatePasteBaseOptions {
    text?: string;
    file?: string | Buffer;
    title?: string;
    format?: FormatType;
    privacy?: number;
    expiration?: ExpirationType;
}

export interface ICreatePasteTextOptions extends ICreatePasteBaseOptions {
    text: string;
}

export interface ICreatePasteFileOptions extends ICreatePasteBaseOptions {
    file: string | Buffer;
}

export interface IPasteAPIOptions {
    api_option: string;
    api_dev_key?: string;
    api_user_key?: string;
    api_paste_code?: string;
    api_paste_format?: FormatType;
    api_paste_expire_date?: ExpirationType;
    api_paste_private?: number;
    api_results_limit?: number;
    api_paste_name?: string;
    api_paste_key?: string;
}
