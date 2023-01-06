import { Command } from 'commander';
// ESM模块引入json文件需要添加启动参数--experimental-json-modules
// 或者使用createRequire, 构造require函数
// https://github.com/nodejs/help/issues/3221
import { createRequire } from "module";
import Ask  from "./ask.js";
import { INIT_QUESTION_LIST } from "../constant/question.js"
import Git from "./git.js";
import {TEMPLATE_QUESTION_LIST} from "../constant/template.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");
const program = new Command;
const ask = new Ask(INIT_QUESTION_LIST);
const git = new Git

program
    .name(pkg.name)
    .description('😋 CHAN CLI: 前端项目模板脚手架')
    .version(pkg.version, '-v, --version', '获取CLI版本号')

program.helpOption('-h, --help', '显示指令的具体信息')

program
    .command('init')
    .action(async ()=> {
        const { template, program } = await ask.start();
        const templateIndex = TEMPLATE_QUESTION_LIST.findIndex(item=> item.value === template);
        await git.clone(TEMPLATE_QUESTION_LIST[templateIndex].link, program);
    })

program.parse()
