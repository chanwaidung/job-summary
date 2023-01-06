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
