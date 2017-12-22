// 基于文件的存储

// 收集参数值并解析文件数据库的路径
var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2);//去除"node cli_tasks.js"，只留下参数
var command = args.shift();//取出第一个参数命令
var taskDescription = args.join(' ');//合并剩余的参数
var file = path.join(process.cwd(),'./.tasks');//根据当前的工作目录解析数据库的相对路径


switch (command){
    case 'list'://list会列出所有已保存的任务
        listTasks(file);
        break;
    case 'add'://add会添加新任务
        addTask(file,taskDescription);
        break;
    default:
        console.log('Usage: '+process.argv[0]
                +' list|add [taskDescription]');
}

// 定义获取已有的任务
function loadOrInitializeTaskArray(file,cb){
    //检查.tasks文件是否已经存在
    fs.exists(file,function(exists){
        var tasks = [];
        if(exists){
            //从.tasks文件中读取代码事项数据
            fs.readFile(file,'utf8',function(err,data){
                if (err) throw err;
                var data = data.toString();
                //把用JSON编码的代办事项数据解析到任务数组中
                tasks = JSON.parse(data || '[]');
                cb(tasks);
            })
        }else{
            //如果.tasks文件不存在，则创建空的任务数组
            cb([]);
        }
    })
}

// 列出任务
function listTasks(file){
    loadOrInitializeTaskArray(file,function(tasks){
        for(var i in tasks){
            console.log(tasks[i]);
        }
    })
}

// 把任务保存到磁盘中
function storeTasks(file,tasks){
    fs.writeFile(file,JSON.stringify(tasks),'utf8',function(err){
        if (err) throw err;
        console.log('Saved.');
    })
}

// 添加一项任务
function addTask(file,taskDescription){
    loadOrInitializeTaskArray(file,function(tasks){
        tasks.push(taskDescription);
        storeTasks(file,tasks);
    })
}