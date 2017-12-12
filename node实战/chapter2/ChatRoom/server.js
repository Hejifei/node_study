var http = require('http');//提供了HTTP服务器和客户端功能
var fs = require('fs');//提供了与文件系统相关的功能
var path = require('path');//提供了与文件系统路径相关的功能
var mime = require('mime');//mime模块有根据文件扩展名得出MIME类型的能力
var cache = {};//换成文件内容的对象

// 请求的文件不存在发送404错误
function send404(response){
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('Error 404:resource not found.');
    response.end();
}

// 辅助函数提供文件数据服务
function sendFile(response,filePath,fileContents){
    response.writeHead(200,{'Content-Type':mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

// 提供静态文件服务
function serveStatic(response,cache,absPath){
    // 检测文件是否缓存在内存中
    if(cache[absPath]){
        // 从内存中返回文件
        sendFile(response,absPath,cache[absPath]);
    }else{
        // 检测文件是否存在
        fs.exists(absPath,function(exists){
            if(exists){
                // 从硬盘中读取文件
                fs.readFile(absPath,function(err,data){
                    if(err){
                        send404(response);
                    }else{
                        cache[absPath] = data;
                        // 从硬盘中读取文件并返回
                        sendFile(response,absPath,data);
                    }
                })
            }else{
                // 发送HTTP404响应
                send404(response);
            }
        })
    }
}


// 创建HTTP服务器的逻辑
var server = http.createServer(function(request,response){
    var filePath = false;
    if(request.url == '/'){
        // 确定返回的默认HTML文件
        filePath = 'public/index.html';
    }else{
        // 将URL路径转化为文件的相对路径
        filePath = 'public'+request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response,cache,absPath);
})


// 启动HTTP服务器
server.listen(3000,function(){
    console.log("Server listening on port 3000");
})

//加载一个定制的Node模块，它提供的逻辑是用来处理基于Socket.IO的服务器聊天功能。
var chartServer = require('./lib/chat_server');
// 启动Socket.IO服务器，给它提供一个已经定义好的HTTP服务器，这样就能跟HTTP服务器共享同一个TCP/IP端口。
chartServer.listen(server);






