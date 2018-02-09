const fs = require('fs');  
//基于Node.js解析excel文件数据及生成excel文件，仅支持xlsx格式文件；  
const xlsx = require('node-xlsx');  

// index:
// var obj = xlsx.parse(__dirname+'/luckydraw.xlsx');
var obj = xlsx.parse(__dirname+'/CMemberlist.xlsx');
var excelObj=obj[0].data;
excelObj.shift();
console.log(excelObj)

module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html', {
            title: '2018客户答谢宴抽奖活动',
            arraylist:excelObj
        });
    }
};
