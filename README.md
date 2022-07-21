pastebin-ts
===

[![NPM](https://nodei.co/npm/pastebin-ts.svg?downloads=true&stars=true)](https://nodei.co/npm/pastebin-ts/)
[![npm version](https://badge.fury.io/js/pastebin-ts.svg)](http://badge.fury.io/js/pastebin-ts)
[![Code Climate](https://codeclimate.com/github/j3lte/pastebin-ts/badges/gpa.svg)](https://codeclimate.com/github/j3lte/pastebin-ts)

Typescript version of the Pastebin API client

## Features

* getPaste : get a raw paste
* createAPIuserKey : get a userkey for the authenticated user
* listUserPastes : get a list of the pastes from the authenticated user
* getUserInfo : get a list of info from the authenticated user
* listTrendingPastes : get a list of the trending pastes on Pastebin
* createPaste : create a paste
* createPasteFromFile : read a file (UTF8) and paste it
* deletePaste : delete a paste created by the user


## Example

```js
const PastebinAPI = require('pastebin-ts');

const pastebin = new PastebinAPI({
    'api_dev_key' : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'api_user_name' : 'PastebinUserName',
    'api_user_password' : 'PastebinPassword'
});

pastebin
    .createPasteFromFile({
        'file': './uploadthistopastebin.txt',
        'title': 'pastebin-js test'
    })
    .then((data) => {
        // we have succesfully pasted it. Data contains the id
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });
```
