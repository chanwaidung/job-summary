export const VERSION_QUESTION_LIST = [
    {
        type: 'input',
        name: 'version',
        message: '请输入发布的版本号(当前为v$version$): ',
        validate(value) {
            const reg = /[0-9]*.[0-9]*.[0-9]*/ig
            if(reg.test(value)) {
                return true;
            }
            return '版本号仅支持形如8.1.8';
        }
    },
    {
        type: 'input',
        name: 'message',
        message: '请填写版本提交信息....',
        default() { return 'release: 新版本发布' }
    }
]
