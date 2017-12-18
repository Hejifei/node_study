
function Watcher(watchDir,processedDir){
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

var events = require('events'),
    util = require('util');

// 用inherits函数继承另一个对象里的行为看起来很简洁
util.inherits(Watcher,events.EventEmitter);

var fs = require('fs'),
    watchDir = './watch',
    processedDir = './done';

// 扩展EventEmitter，添加处理文件的方法
Watcher.prototype.watch = function(){
    var watcher = this;
    // 保存对Watcher对象的引用，以便在回调函数readdir中使用
    fs.readdir(this.watchDir,function(err,files){
        if (err) throw err;
        for(var index in files){
            // 处理watch目录中的所有文件
            watcher.emit('process'),files[index];
        }
    })
}

// 扩展EventEmitter，添加开始监控的方法
Watcher.prototype.start = function(){
    var watcher = this;
    fs.watchFile(watchDir,function(){
        watcher.watch();
    })
}

var watcher = new Watcher(watchDir,processedDir);

watcher.on('process',function(){
    var watchFile = this.watchDir + '/'+file;
    var processedFile = this.processedDir +'/'+file.toLowerCase();

    fs.rename(watchFile,processedFile,function(err){
        if (err) throw err;
    })
})

watcher.start();


