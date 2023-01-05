import chalk from "chalk";

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
        log(chalk.redBright`[❌ ERROR]: ${text}`)
    }
}

export default Log;
