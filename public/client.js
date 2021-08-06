const socket = io();

let user_name;

let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area');
let nameArea = document.querySelector('#name')
let chats = document.querySelector('.chat')

do{
    user_name = prompt("please Enter you name");
}while(!user_name)

showName(user_name);

socket.emit('user_joined',user_name);

textarea.addEventListener('keyup',(e)=>{
    if(e.key =='Enter'){
        if((e.target.value).trim().length>0){
            sendMessage(e.target.value)
        }
    }
});

function send_btn(){
    if((document.getElementById("textarea").value).trim().length>0){
        sendMessage(document.getElementById("textarea").value);
    }
};

function sendMessage(msg){
    let masg = {
        user : user_name,
        message: msg.trim()
    }

    
    // Append
    appendMessage(masg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // send to server
    socket.emit('message',masg)
};

function appendMessage(msg, type){
    let mainDiv = document.createElement('div');
    let class_name = type;
    mainDiv.classList.add('message',class_name);
    if(class_name == 'outgoing'){
        let markup = `
        <p>${msg.message}</p>  
        `                               // if it is an outgoing msg it would not show your name top of the msg..
        mainDiv.innerHTML = markup;
    }else{
        let markup = `
                <h4>${msg.user}</h4>
                <p>${msg.message}</p>
                `                       // if u want to show your name remove the condition of class..
                mainDiv.innerHTML = markup;
    }
            messageArea.appendChild(mainDiv);
};

// recieved msg
socket.on('message',(msg)=>{
    appendMessage(msg, 'incoming');    
    scrollToBottom();
});

socket.on('user_connected',(socket_name)=>{         // when user is joined the chat
    userJoinLeft(socket_name,'Joined');
});

socket.on('user_disconnected',(socket_name)=>{         //when user left the chat
    userJoinLeft(socket_name,'left');
});

function userJoinLeft(name,status){
    let mainDiv = document.createElement('div');
    let markup = `<p class="chat"><b>${name} </b> ${status} the chat..</p>`
    // div.classList.add('d-flex justify-content-center');
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
};

function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight;
};

function showName(user_name){
    let mainDiv = document.createElement('div');
    let markup = `<h1>${user_name}</h1>`
    mainDiv.innerHTML = markup
    nameArea.appendChild(mainDiv);
};
