/* eslint-disable no-extend-native */
/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (const k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function convertArguments(args) {
    const now = new Date().format("yyyy-MM-dd hh:mm:ss.S");
    Array.prototype.unshift.call(args, now);

    let arr = "";
    for (let i = 0; i < args.length; i++) {
        if (args[i] instanceof Error) {
            arr += " " + args[i].message;
        }
        else {
            arr += " " + args[i];
        }

    }

    return {
        argsStr: arr,
        args
    }
}



window.console = (function (origConsole) {

    if (!window.console)
        console = {};
    let isDebug = true
    const logArray = [];
    const logTrace = [];
    return {
        log: function () {
            const { argsStr, args } = convertArguments(arguments)
            logArray.push(argsStr)
            isDebug && origConsole.log && origConsole.log.apply(origConsole, args);
        },
        warn: function () {
            const { argsStr, args } = convertArguments(arguments)
            logArray.push(argsStr)
            isDebug && origConsole.warn && origConsole.warn.apply(origConsole, args);
        },
        error: function () {
            const { argsStr, args } = convertArguments(arguments)
            logArray.push(argsStr)
            isDebug && origConsole.error && origConsole.error.apply(origConsole, args);
        },
        info: function (v) {
            const { argsStr, args } = convertArguments(arguments)
            logArray.push(argsStr)
            isDebug && origConsole.info && origConsole.info.apply(origConsole, args);
        },
        debug: function (bool) {
            const { argsStr, args } = convertArguments(arguments)
            logArray.push(argsStr)
            if (argsStr.match(/\[xxx\]|\[yyy\]/)) {
                logTrace.push(argsStr)
            }
            isDebug && origConsole.debug && origConsole.debug.apply(origConsole, args);
        },
        _debug: function (bool) {
            isDebug = bool;
        },
        _logs: logArray,
        _trace: logTrace
    };

}(window.console));

