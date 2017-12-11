// 数据流读取
var stream = fs.createReadStream('./resource.json');
stream.on('data',function(chunk){
    console.log(chunk);
})
stream.on('end',function(){
    console.log('finished!');
})

// 数据流写
//在这行代码中，数据从文件中读进来(fs.createReadStream)，然后数据随着进来就被送到（.pipe）客户端（res）。在数据流动时，事件轮询还能处理其他事件。
var http = require('http');
var fs = require('fs');
http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'image/png'});
    fs.createReadStream('./image.png').pipe(res);
}).listen(3000);
console.log('Server running at http://localhost:3000/');


