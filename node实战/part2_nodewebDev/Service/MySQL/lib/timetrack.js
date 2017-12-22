// 包含程序相关功能的模块
var qs = require('querystring');

// 发送HTML响应
exports.sendHTML = function(res,html){
    res.setHeader('Content-Type','text/html:charset=utf8');
    res.setHeader('Content-Length',Buffer.byteLength(html));
    res.end(html);
}

// 解析HTTP POST数据
exports.parseReceivedData = function(req,db){
    var body= '';
    req.setEndoding('utf8');
    req.on('data',function(chunk){body += chunk});
    req.on('end',function(){
        var data = qs.parse(body);
        cb(data);
    });
};

// 渲染简单的表单
exports.actionForm = function(id,path,label){
    var html = '<form method="POST" action="'+path+'">'+
        '<input type="hidden" name="id" value="'+id+'" />'+
        '<input type="submit" value="'+label+'" />'+
        '<form/>';
    return html;
}

// 用MySQL添加数据
exports.add =function(db,req,res){
    // 解析HTTP POST数据
    exports.parseReceivedData(req,function(work){
        // 添加工作记录的SQL
        db.query(
            "INSERT INTO work (hours,date,description) "+
            "VALUES (?,?,?)",
            [work.hours,work.data,work.description],
            function(err){
                if (err) throw err;
                // 给用户显示工作记录清单
                exports.show(db,res);
            }
        )
    })
}


// 删除工作记录
exports.delet = function(db,req,res){
    exports.parseReceivedData(req,function(work){
        db.query(
            'DELETE FROM work WHERE id=?',
            [work.id],
            function(err){
                if (err) throw err;
                exports.show(db,res);
            }
        )
    })
}



