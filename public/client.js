const socket = io();

let user_name;

let textarea = document.querySelector('#textarea');     // getting the msg from text_Area
let messageArea = document.querySelector('.message_area');  // apeend incoming & outtgoing msg's
let nameArea = document.querySelector('#name')      // showing user's name on the header
let typingStatus = document.querySelector(".brand");
let feedback = document.getElementById("feedback");

let TypingCount = 0;
// do{
    user_name = prompt("please Enter you name");
    if (user_name == null || user_name == "" || user_name.length < 3) {
        location.href = 'blank.html'
      } else {
        showName(user_name);
      }
// }while(!user_name)
socket.emit('user_joined',user_name);


textarea.addEventListener('keyup',(e)=>{
    if(e.key =='Enter'){
        if((e.target.value).trim().length>0){
            sendMessage(e.target.value)
        }
    }
});

textarea.addEventListener('keypress',()=>{
    socket.emit('typing',user_name)
})

socket.on('typing',(name)=>{
    feedback.innerHTML = '<p><em>'+name+' is typing a message...</em></p>'
})

// recieved msg
socket.on('message',(msg)=>{
    feedback.innerHTML = ""
    if(msg.length > 0){
        appendMessage(msg, 'incoming');    
        scrollToBottom();
    }
});

socket.on('user_connected',(socket_name)=>{         // when user is joined the chat
    userJoinLeft(socket_name,'Joined');
});

socket.on('user_disconnected',(socket_name)=>{         //when user left the chat
    userJoinLeft(socket_name,'left');
});

function deleteTypingStatus(){
    setTimeout(()=>{
        if (document.getElementById("textarea").value.trim().length < 1) {
            socket.emit('message',"");
        }
        deleteTypingStatus();
    },1000);
}

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

function userJoinLeft(name,status){
    let mainDiv = document.createElement('div');
    let markup = `<p class="chat"><b>${name} </b> ${status} the chat..</p>`
    mainDiv.classList.add('notification');
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
