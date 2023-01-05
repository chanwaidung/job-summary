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
