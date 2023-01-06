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
