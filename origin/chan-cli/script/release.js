import "../global.js";
import Ask from "../lib/ask.js";
import { VERSION_QUESTION_LIST } from "../constant/version.js";
import fs from "fs";
import { createRequire } from 'module';
import Git from "../lib/git.js";

const require = createRequire(import.meta.url);

const pkg = require("../package.json");

const generateVersionQues = [...VERSION_QUESTION_LIST].map(item=> {
    if(item.name === 'version') {
        item.message = item.message.replace('$version$', pkg.version)
    }
    return item
});

const ask = new Ask(generateVersionQues);
const git = new Git();

const { version, message } = await ask.start();

pkg.version = version;

fs.writeFileSync("./package.json", JSON.stringify(pkg), { encoding: 'utf-8' });

git.commit(message).push();

success('代码提交、发布成功');

git.tag(version, `release: 发布新版本v${version}`).push('tag');

success(`代码标签标记成功、发布标签成功: v${version}`);

// TODO: 请先配置.npmrc文件中的token，否则将导致报错
// shell.exec('npm publish');
