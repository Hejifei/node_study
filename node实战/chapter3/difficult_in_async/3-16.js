// 串行化执行代码
// Nimble 流程控制工具

var flow = require('nimble');

// 给Nimble一个函数数组，让它一个接一个地执行
flow.series([
    function (callback) {
        setTimeout(function() {
            console.log('I execute first.');
            callback();
        }, 1000);
    },
    function (callback) {
        setTimeout(function() {
            console.log('I execute next.')
            callback();
        }, 500);
    },
    function (callback) {
        setTimeout(function() {
            console.log('I execute last.')
            callback();
        }, 100);
    }
])




















