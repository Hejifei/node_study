var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server){
    // 启动Socket.IO服务器，允许它搭载在已有的HTTP服务器上
    io = socketio.listen(server);
    io.set('log level',1);
    // 定义每个用户连接的处理逻辑
    io.sockets.on('connection',function(socket){
        // 在用户连接上来时赋予其一个访客名
        guestNumber = assignGuestName(socket,guestNumber,nickNames,namesUsed);
        
        // 在用户连接上来时把他放入聊天室Lobby里
        joinRoom(socket,'Lobby');

        //处理用户的消息，更名，以及聊天室的创建和变更
        handleMessageBroadcasting(socket,nickNames);
        handleNameChangeAttempts(socket,nickNames,namesUsed);
        handleRoomJoining(socket);

        // 用户发出请求时，向其提供以及被占用的聊天室的列表
        socket.on('rooms',function(){
            socket.emit('rooms',io.sockets.manager.rooms);
        })

        // 定义用户断开连接后的清除逻辑
        handleClientDisconnection(socket,nickNames,namesUsed);
    })
}

// 分配用户昵称
function assignGuestName(socket,guestNumber,nickNames,namesUsed){
    var name = 'Guest' + guestNumber;
    // 把用户昵称跟客户端连接ID关联上
    nickNames[socket.id] = name;
    // 让用户知道他们的昵称
    socket.emit('nameResult',{
        success:true,
        name:name
    })
    namesUsed.push(name);
    return guestNumber + 1;
}

// 进入聊天室相关逻辑
function joinRoom(socket,room){
    // 让用户进入房间
    socket.join(room);
    // 记录用户当前房间
    currentRoom[socket.id] = room;
    // 让用户知道他们进入了新的房间
    socket.emit('joinResult',{room:room});
    // 让房间的其他用户知道有新的用户进入了房间
    socket.broadcast.to(room).emit('message',{
        text:nickNames[socket.id] + ' 加入了房间： ' + room +'.'
    })

    // 确定哪些用户在这个房间里
    var usersInroom = io.sockets.clients(room);
    // 如果不止一个用户在这房间里，汇总下都是谁
    if(usersInroom.length > 1){
        var usersInroomSummary = 'Users currently in '+ room +':';
        for(var index in usersInroom){
            var userSocketId = usersInroom[index].id;
            if(userSocketId != socket.id){
                if(index > 0){
                    usersInroomSummary += ', ';
                }
                usersInroomSummary += nickNames[userSocketId];
            }
        }
        usersInroomSummary += '.';
        // 将房间里的其他用户的名字汇总发送给这个用户
        socket.emit('message',{text:usersInroomSummary});
    }
}

// 处理昵称变更请求
function handleNameChangeAttempts(socket,nickNames,namesUsed){
    // 添加nameAttempt事件的监听器
    socket.on('nameAttempt',function(name){
        // 昵称不能以Guest开头
        if(name.indexOf('Guest') == 0){
            socket.emit('nameResult',{
                success:false,
                message:'Names cannot begin with "Guest".'
            })
        }else{
            // 如果昵称还没注册就注册上
            if(namesUsed.indexOf(name) == -1){
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                // 删除之前用的昵称，让其他用户可以使用
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult',{
                    success:true,
                    name:name
                })
                socket.broadcast.to(currentRoom[socket.id]).emit('message',{
                    text:previousName + ' is now known as '+ name+'.'
                })
            }else{
                // 如果昵称已经被占用，给客户端发送错误消息
                socket.emit('nameResult',{
                    success:false,
                    message:'That name is already in use.'
                })
            }
        }
    })
}

// 发送聊天消息
// 用户发射一个事件，表明消息是从哪个房间发出来的，以及消息的内容是什么；
// 然后服务器将这条消息转发给同一房间的所有用户
function handleMessageBroadcasting(socket){
    socket.on('message',function(message){
        socket.broadcast.to(message.room).emit('message',{
            text : nickNames[socket.id] + '：'+message.text
        })
    })
}

// 创建房间
// 让用户加入已有房间，如果房间还没的话，则创建一个房间
function handleRoomJoining(socket){
    socket.on('join',function(room){
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket,room.newRoom);
    })
}

// 用户断开连接
// 当用户离开聊天程序时，从nickNames和namesUsed中移除用户的昵称
function handleClientDisconnection(socket){
    socket.on('disconnect',function(){
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    })
}








