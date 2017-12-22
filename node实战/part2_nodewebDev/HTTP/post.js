// POST请求体字符串缓存
var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function(req,res){
    switch(req.method){
        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            req.on('data',function(chunk){
                item += chunk;
            });
            req.on('end',function(){
                items.push(item);
                res.end('OK\n');
            });
            break;
        case 'GET':
            // items.forEach(function(item,i){
            //     res.write(i+') '+item+'\n');
            // })
            // res.end();
            // break;
            var body = items.map(function(){
                return i+") "+item;
            }).join('\n');
            res.setHeader('Content-Length',Buffer.byteLength(body));
            res.setHeader('Content-Type','text/plain; charset="utf-8"');
            res.end(body);
            break;
        case 'DELETE':
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1),10);

            if(isNaN(i)){
                // 如果这个数字是“非数字”，状态码会被设定为400,表明是一个坏请求。
                res.statusCode = 400;
                res.end('Invalid item id');
            }else if(!items[i]){
                // 检查事项是否存在的代码，如果不存在就用404Not Found做响应
                res.statusCode = 404;
                res.end('Item not found');
            }else{
                // 在输入经过验证确认为有效狗，事项会从事项数组中移除，然后程序用200，OK响应客户端。 
                items.splice(i,1);
                res.end('OK\n');
            }
            break;

    }
})


