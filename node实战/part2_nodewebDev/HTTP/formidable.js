var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function(req,res){
    switch (req.method) {
        case 'GET':
            show(req,res);
            break;
        case 'POST':
            upload(req,res);
            break;
        default:
            break;
    }
})

function show(req,res){
    var html = ''
                +'<form method="post" action="/" enctype="multipart/form-data">'
                +'<p><input type="text" name="name" /></p>'
                +'<p><input type="file" name="file" /></p>'
                +'<p><input type="submit" value="Upload" /></p>'
                +'</form></body></html>'
    res.setHeader('Content-Type','text/html');
    res.setHeader('Content-Type',Buffer.byteLength(html));
    res.end(html);
}

function upload(req,res){
    // 上传逻辑
    // 请求中的内容类型不对时返回400 Bad Request响应
    if(!isFormData(req)){
        res.statusCode = 400;
        res.end('Bad Request:expecting multipart/form-data');
        return;
    }
    // 确定完这是一个文件上传请求后，需要初始化一个新的formidable.IncomingForm表单，然后调用form.parse(req)方法。
    // 这样formidable就可以访问请求的data事件进行解析了
    var form = new formidable.IncomingForm();
    // form.on('field',function(field,value){
    //     console.log(field);
    //     console.log(value);
    // })
    // form.on('file',function(name,file){
    //     console.log(name);
    //     console.log(file);
    // })
    // form.on('end',function(){
    //     res.end('upload complete!');
    // })
    // form.parse(req);
    // 文件上传功能实现
    form.parse(req,function(err,fields,files){
        console.log(fields);
        console.log(files);
        res.end('upload complete!');
    })
    // 文件上传进度计算
    form.on('progress',function(bytesReceived,bytesExpected){
        var percent = Math.floor(bytesReceived/bytesExpected *100);
        console.log(percent);
    })
    

}

function isFormData(req){
    // 检查请求投中的Content-Type字段，断言它的值是以multipart/form-data开头的
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}




