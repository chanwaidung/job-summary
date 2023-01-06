import { TEMPLATE_QUESTION_LIST } from "./template.js";

export const INIT_QUESTION_LIST = [
    {
        type: 'input',
        name: 'program',
        message: 'Input the program name which you want....',
        default() { return 'chan-template' }
    },
    {
        type: 'list',
        name: 'template',
        message: 'Select the coding template',
        choices: TEMPLATE_QUESTION_LIST,
    },
];
