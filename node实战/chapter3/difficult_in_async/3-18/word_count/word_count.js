// 实现并行化流程控制


var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete() {
    completedTasks++;
    if(completedTasks == tasks.length){
        for(var index in wordCounts){
            // 当所有任务全部完成后，列出文件中用到的每个单词以及用了多少次
            console.log(index + '：' + wordCounts[index]);
        }
    }
}

function countWordsInText(text){
    var words = text.toString().toLowerCase().split(/\W+/).sort();
    // 对文本中出现的单词计数
    for(var index in words){
        var word = words[index];
        if(word){
            wordCounts[word] = (wordCounts[word]) ? wordcounts[word] + 1 : 1;
        }
    }
}

// 得出text目录中的文件列表
fs.readdir(filesDir,function(err,files){
    if (err) throw err;
    for(var index in files){
        // 定义处理每个文件的任务。每个任务重都会调用一个伊布都区文件的函数并对文件中使用的单词计数
        var task = (function(file){
            return function(){
                fs.readFile(file,function(err,text){
                    if (err) throw err;
                    countWordsInText(text);
                    checkIfComplete();
                })
            }
        })(filesDir + '/' + files[index]);
        // 把所有任务都添加到函数调用数组中
        tasks.push(task);
    }
    // 开始并行执行所有任务
    for(var task in tasks){
        tasks[task]();
    }
})


