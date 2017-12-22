// 4-3 最基础的ReadStream静态文件服务器
var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;

var server = http.createServer(function(req,res){
    var url = parse(req.url);
    var path = join(root,url.pathname);//构造绝对路径
    // 检查文件是否存在
    fs.stat(path,function(err,stat){
        if(err){
            // 文件不存在
            if('ENOENT' == err.code){
                res.statusCode = 404;
                res.end('Not Found');
            }else{
                // 其他错误
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        }else{
            // 用stat对象的属性设置Content-Length
            res.setHeader('Content-Length',stat.size);
            var stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error',function(err){
                res.statusCode = 500;
                res.end('Internal Server Error');
            })
        }
    })
    var stream = fs.createReadStream(path);//创建fs.ReadStream
    stream.pipe(res);//res.end()会在stream.pipe()内部调用
    stream.on('error',function(err){
        // 注册一个error事件处理器，可以捕获任何可以预见或无法预见的错误，给客户端更优雅的响应
        res.statusCode= 500;
        res.end('Internal Server Error');
    })
})

server.listen(3000);





