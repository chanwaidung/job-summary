import shell from "shelljs";
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

git.tag(version, `release: the v${version} is release`).push('tag');

shell.exec('npm publish');
