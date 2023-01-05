import Log from "./lib/log.js";
const { log, warn, success, error } = new Log();

global.log = log
global.warn = warn
global.success = success
global.error = error
