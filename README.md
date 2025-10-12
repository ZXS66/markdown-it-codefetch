# markdown-it-codefetch

This is a markdown-it plugin that fetches code snippets from remote URLs and embeds them into markdown documents.

Inspired by [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote).

<!--[![CI](https://github.com/ZXS66/markdown-it-codefetch/actions/workflows/ci.yml/badge.svg)](https://github.com/ZXS66/markdown-it-codefetch/actions/workflows/ci.yml)-->
[![NPM version](https://img.shields.io/npm/v/markdown-it-codefetch.svg?style=flat)](https://www.npmjs.org/package/markdown-it-codefetch)
[![Coverage Status](https://img.shields.io/coveralls/ZXS66/markdown-it-codefetch/master.svg?style=flat)](https://coveralls.io/r/ZXS66/markdown-it-codefetch?branch=master)


## Install

```bash
npm install markdown-it-codefetch --save
yarn add markdown-it-codefetch
```

## How-to

### Registration

node version:

```js
var md = require('markdown-it')()
            .use(require('markdown-it-codefetch'));

md.render(/*...*/) // see usage below
```

vitepress version

```ts
// docs/.vitepress/config.mts
import { DefaultTheme, UserConfig, defineConfig } from "vitepress";
import footnote from "markdown-it-footnote";
import codefetch from "markdown-it-codefetch";

const vitePressOptions: UserConfig<DefaultTheme.Config> = {
  markdown: {
    image: { lazyLoading: true },
    lineNumbers: true,
    config: (md) => {
      md.use(footnote);
      md.use(codefetch);
    },
  },
  // ...
};

export default defineConfig(vitePressOptions);
````


### Usage

````md
preview [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote):
```ts
// [!fetch("https://github.com/markdown-it/markdown-it-footnote/raw/refs/heads/master/index.mjs")]
```
````

## License

[MIT](https://github.com/ZXS66/markdown-it-codefetch/blob/master/LICENSE)
