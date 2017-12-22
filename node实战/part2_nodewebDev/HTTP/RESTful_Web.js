var http = require('http');
var server = http.createServer(function(req,res){
    // 将流编码设定为ascii或utf8
    req.setEncoding('utf8');
    // 只要读入了新 数据块，就触发data事件
    req.on('data',function(funk){
        // 数据块默认是个Buffer对象（字节数组）
        console.log('parsed',chunk);
    })
    // 数据全部读完之后触发end事件
    req.on('end',function(){
        console.log('done parsing');
        res.end();
    })
})





