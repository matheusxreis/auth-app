## mxr-create-node-app
> my own node app template

This repository contains, how says the title, my own Node JS template.

I've decided to do this repository to do easier when I'll create a Node JS API (and who knows it helps another people), program or something like that. It contains all that I usually use in my applications.

That is:

- **[Typescript](https://www.typescriptlang.org)** and **[ts-node-dev](https://www.npmjs.com/package/ts-node-dev)**;
- **[Commitlint](https://commitlint.js.org/#/) and [Husky](https://github.com/typicode/husky)**;
- **[Eslint](https://github.com/eslint/eslint) and [Prettier](https://prettier.io)**;
- **[Jest](https://jestjs.io)**.

### About Typescript

How I use to say: "since Typescript, there is no reason to not use it".

Since I discovered Typescript, I've never done a pure Javascript project anymore. The help that Typescript give us is, no doubt: indispensable.

I use ts-node-dev to compile and run Typescript. It does tsc and node's jobs together. Instead of run:

```bash
 yarn tsc
 yarn node /src/example.js
```

I just run:

```bash
 yarn ts-node-dev /src/example.ts
```

In this case, if your run yarn dev, the above command is executed. This script is setted up to run index.ts in src directory.

### About commits

This template has the commitlint that check if your commit messages is, in according with the **[conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/)**.

The commitlint check your message commit and the husky, throught git hooks, ensures that commitlint script be executed when you commit.

It make yours commit more understanble. :smile:

How commit:

```bash

    ## type(scope?): subject
    fix(server): send cors headers ## example from commitlint lib
    feat: add comment section

```

### About the style-guide

This template uses the Standard Styled Guide, which can be found [here](https://github.com/standard/standard/), except about the semicolons. Semicolons are always necessary here.

That utilizes the ESLint library to alert us about the mistakes that we can be doing during our development.

The Prettier library, for his time, is used how code formatter. It format our code to us according with our styled guide's rules.

Extensions used in VS Code: Eslint from Microsof and Prettier Code Formatter from Prettier.

What putting in VS Code's settings.json:

```json
    "editor.formatOnSave": true, 
    "prettier.eslintIntegration": true, 
```

In src/index.ts you can fiind a simple example about the styled guide used.

### About Jest

Jest is the library which I use to test my applications. There is no much to talk about. I've tried keep jest.config.ts as simples as it come and installed ts-jest because of Typescript.

### How use: 

You can get this template in github or:

```bash 
    npx mxr-create-node-app my-app
```
That is all, folks! :metal:
