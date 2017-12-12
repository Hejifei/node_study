// 用户界面显示消息及可用房间


// 可疑的文本数据
function divEscapedContentElement(message){
    return $('<div></div>').text(message);
}

// 受信的文本数据
function divSystemContentElement(message){
    return $('<div></div>').html('<li>'+message+'</li> ')
}

// 处理原始的用户输入
// 如果用户输入的内容已斜杠(/)开头，它会将其作为聊天命令处理。
// 如果不是，就作为聊天消息发送给服务器并广播给其他用户，并添加到用户所在聊天室的聊天文本中
function processUserInput(chatApp,socket){
    var message = $('#send-message').val();
    var systemMessage;
    // 如果用户输入的内容已斜杠(/)开头，它会将其作为聊天命令处理。
    if(message.charAt(0) == '/'){
        systemMessage = chatApp.processCommand(message);
        if(systemMessage){
            $("#messages").append(divSystemContentElement(systemMessage));
        }
    }else{
       // 就作为聊天消息发送给服务器并广播给其他用户，并添加到用户所在聊天室的聊天文本中
        chatApp.sendMessage($("#room").text(),message);
        $("#messages").append(divEscapedContentElement(message));
        $("#messages").scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send-message').val('');
}

// 客户端程序初始化逻辑
// 在用户的浏览器加载完页面后执行，这段代码会对客户端的Socket.IO事件处理进行初始化
var socket = io.connect();

$(document).ready(function(){
    var chatApp = new Chat(socket);

    // 显示更名尝试的结果
    socket.on('nameResult',function(result){
        var message;
        if(result.success){
            message = 'You are new known as ' + result.name +'.';
        }else{
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    })

    // 显示房间变更结果
    socket.on('joinResult',function(result){
        $("#room").text(result.room);
        $('#messages').append(divSystemContentElement('Room changed.'));
    })

    // 显示接收到的消息
    socket.on('message',function(message){
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    })

    // 显示可用房间列表
    socket.on('rooms',function(rooms){
        $('#room-list').empty();
        for(var room in rooms){
            room = room.substring(1,room.length);
            if(room != ''){
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
        // 点击房间名可以换到那个房间中
        $("#room-list div").click(function(){
            chatApp.processCommand('/join '+$(this).text());
            $('#send-message').focus();
        })
    })

    // 定期请求可用房间列表
    setInterval(function(){
        socket.emit('rooms');
    },1000)

    $("#send-message").focus();

    // 提交表单发送聊天消息
    $("#send-form").submit(function(){
        processUserInput(chatApp,socket);
        return false;
    })
})

















