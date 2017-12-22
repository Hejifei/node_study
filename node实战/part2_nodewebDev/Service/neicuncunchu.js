//内存存储
// 用变量存放数据，这样读取和写入数据都很快，但是服务器和程序重启后数据就丢失了

// 下面的例子就是最近一次重启服务器后页面访问次数的计数器
var http = require('http');
var counter = 0;

var server = http.createServer(function(req,res){
    counter++;
    res.write('I have been accessed '+counter +' times.');
    res.end();
}).listen(8888);




