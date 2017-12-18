// 用事件发射器实现的简单的发布/预订系统
var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
// 用setMaxListeners增加监听器的数量
channel.setMaxListeners(50);

channel.on('join',function(id,client){
    var welcome = "Welcome!\n"
                +'Duests online: '+this.listerners('broadcast').length();
    client.write(welcome +"\n");
    // 添加join事件的监听器，保存用户的client对象，以便程序可以将数据发送给用户
    this.clients[id] = client;
    this.subscriptions[id] = function(senderId,message){
        // 忽略发出这一广播数据的用户
        if(id != senderId){
            this.clients[id].write(message);
        }
    }
    // 添加一个专门针对当前用户的broadcast事件监听器
    this.on('broadcast',this.subscriptions[id])
})
// 创建leave事件的监听器
// leave事件的本质就是移除原来给客户端添加的broadcast监听器
channel.on('leave',function(id){
    channel.removeListener(
        'broadcast',this.subscriptions[id]);
    // 移除指定客户端的broadcast监听器
    channel.emit('broadcast',id,id+" has left the chat.\n");
})
// 停止提供聊天服务，但又不想关闭服务器。
// removeAllListeners可以去除给定类型的全部监听器
channel.on('shutdown',function(){
    channel.emit('broadcast','','Chat has shut down.\n');
    channel.removeAllListeners('broadcast');
})

var server= net.createServer(function(client){
    var id = client.remoteAddress +":"+client.remotePort;
    // 当有用户连到服务器上来时发出一个join事件，指明用户ID和client对象
    channel.emit('join',id,client);
    client.on('data',function(data){
        data = data.toString();
        if(data = 'shutdown'){
            channel.emit('shutdown');
        }
        // 当有用户发送数据时，发出一个频道broadcast事件，知名用户ID和消息
        channel.emit('broadcast',id,data);
    });
    client.on('close',function(){
        // 在用户断开连接时发出leave事件
        channel.emit('leave',id);
    })
});


server.listen(8888);


















