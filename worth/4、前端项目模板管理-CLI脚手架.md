# 前端项目模板管理 CHAN-CLI

## 一、背景

随着业务的开拓前端的项目越来越多，包括H5、Web Admin、小程序等等。

它们或因为技术、功能不同，所以往往需要不同的代码模板。

如果每次都用Vue CLI来开新项目，每次都需要重新配置项目需要的一些工具，比如:

- UI: 适配第三方UI库, arco-design、vant、ElementUI等等

- CSS: 适配CSS相关，sass、autoprefixer等等

- Mobile: 适配移动端，postcss-px2viewport、postcss-px2rem等等

- Framework Base: 使用vue-router、pinia\vuex、axios等，搭建项目基础模板

- Script: 一些工具脚本，鉴权类、本地存储类、CDN工具函数等等

但是项目越来越多，技术越来越复杂，模板库也会相应的增加。

因此，如果有一个好的项目模板工具，会使得工作变得更便捷。这样就不用

每次开新的代码库，都要去git上copy SSH link、clone显得有点麻烦。

## 二、实现效果

1.通过CLI初始化代码

![CLI-拉取项目效果预览展示](https://github.com/chanwaidung/job-summary/blob/main/static/cli-pull-coding.gif?raw=true)

2.将CLI半自动发布到npm仓库、git仓库，实现版本更新

![CLI-拉取项目效果预览展示](https://github.com/chanwaidung/job-summary/blob/main/static/cli-release-code.gif?raw=true)

## 三、实现

通过`commandjs`实现控制台初始化项目，配合`inquirerjs`为用户提供交互式操作：输入、选择等。

通过`shelljs`实现npm包发布、git代码操作提交、发布、标记。

```
chan-cli
├── config //npm、git配置目录
├── constant // 交互式代码目录
├── lib // 项目核心代码
├── script // 相关辅助脚本
├── util // 工具类目录
├── .npmignore // npm发布包忽略配置
├── .npmrc // 配置npm包token等
├── README.md
├── global.js // 全局变量
├── main.js // 项目入口文件
├── package.json
└── pnpm-lock.yaml
```

`package.json`文件中bin属性配置项目的启动命令，以实现在终端执行如下命令：

`package.json`,文件内容如下：

```json
{
  "name": "chan-cli-template",
  "version": "2.5.1",
  "description": "The cli tool for manage front-end program",
  "main": "main.js",
  "type": "module",
  "bin": {
    "chan": "main.js"
  },
  "scripts": {
    "release": "node ./script/release.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "chan waidung",
  "license": "ISC",
  "dependencies": {
    "chalk": "^5.2.0",
    "commander": "^9.4.1",
    "download-git-repo": "^3.0.2",
    "inquirer": "^9.1.4",
    "ora": "^6.1.2",
    "shelljs": "^0.8.5"
  }
}

```

```shell
chan init
```

`main.js`入口文件，`#!/usr/bin/env node`此代码为关键配置，告诉系统自动寻找并使用本地node环境。

```javascript
#!/usr/bin/env node
// 配置全局变量、函数
import "./global.js";
// 引入入口文件
import "./lib/command.js";
```

`./lib/command.js`,项目主文件，实现相关的控制台命令。

```javascript
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
```

`./global.js`配置全局变量、函数。

```javascript
import { Log } from "./lib/log.js";
const { log, warn, success, error } = new Log();
// 将基础打印函数挂载到全局global上
global.log = log
global.warn = warn
global.success = success
global.error = error

```

Log模块是基于`chalkjs`实现的控制台输出文本。`singletonLog`是基于Proxy实现的单例模式构造函数。

```javascript
import chalk from "chalk";
import { singleton } from '../util/index.js';

const { log } = console

class Log {
    constructor() {
        this.chalk = chalk
    }

    log(text) {
        log(text)
    }

    success(text) {
        log(chalk.greenBright(`[✅ SUCCESS]: ${text}`));
    }

    warn(text) {
        log(chalk.yellowBright`[⚠️ WARNING]: ${text}`);
    }

    error(text) {
        log(chalk.redBright`[❌ ERROR]: ${text}`);
    }
}

const singletonLog = singleton(Log);

export { singletonLog as Log };

```

```javascript
export function singleton(className) {
    let instance = null;
    return new Proxy(className, {
        construct(target, argArray) {
            if(instance) return instance;
            return (instance = new target(...argArray));
        }
    })
}

```

Ask模块是基于`inquirerjs`实现的控制台交互类。

Git模块是基于`shelljs`实现git相关的命令行操作：`clone、commit、tag、push`

```javascript
import download from 'download-git-repo';
import shell from 'shelljs';
import ora from 'ora';

const spinner = ora({
    discardStdin: false,
    text: 'Downloading the template which you have been selected right now....',
    spinner: 'moon',
});

async function downloadRepo(repo, programName) {
    return new Promise((resolve) => {
        download(repo, programName, { clone: true }, (err)=> {
            if(err) resolve(err);
            resolve();
        });
    });
}

class Git {
    async clone(repo, programName) {
        spinner.start();
        await downloadRepo(`direct:${repo}`, programName);
        spinner.stop();
        success('The template have downloaded success');
        log('Follow these steps to start work: ');
        log(`   1.cd ${programName}`);
        log(`   2.npm i`);
        log(`   3.npm run start`);
        return this;
    }

    commit(message) {
        shell.exec('git add ./');
        shell.exec(`git commit -m "${message}"`);
        return this;
    }

    tag(version, message) {
        shell.exec(`git tag ${version} -m "${message}"`);
        return this;
    }

    push(type) {
        if(type === 'tag') {
            shell.exec(`git push --tags`);
            return this;
        }
        shell.exec(`git push`);
        return this;
    }
}

export default Git

```

Ask类实现控制台交互式操作，调用starts函数会在node控制台出现交互式界面，供用户选择、输入等操作。

```javascript
import inquirer  from 'inquirer';

class Ask {
    constructor(questions=[]) {
        this.questions = questions;
    }

    append(questions=[]) {
        this.questions.push(...questions);
        return this.questions;
    }

    remove(name) {
        const index = this.questions.findIndex(item=> item.name === name);
        this.questions.splice(index, 1);
        return index;
    }

    async start() {
        const { questions } = this;
        const answer= await inquirer.prompt(questions);
        return Promise.resolve(answer);
    }

    clean() {
        this.questions = [];
    }
}

export default Ask;

```

## 四、总结

通过CLI我们可以很方便的统一管理前端众多的模板库。
