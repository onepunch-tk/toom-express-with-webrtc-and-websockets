const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const roomNameH3 = document.getElementById("roomName");

room.hidden = true;
let roomName;

form.addEventListener("submit", (_e) => {
    _e.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    input.value = "";
});

socket.on("join_new_user", ()=>addNewMessage(`someone joined!`));
socket.on("leave_user", ()=>addNewMessage(`someone leaved!`));
socket.on("new_message", (message)=>addNewMessage(`someone: ${message}`));

function addNewMessage(msg) {
    const chatList = document.getElementById("chat");
    const li = document.createElement("li");
    li.innerText = msg;
    chatList.append(li);
}

function showRoom(_roomName) {
    welcome.hidden = true;
    room.hidden = false;
    roomNameH3.innerText = roomName = _roomName;
    addNewMessage(`Your Joined ${_roomName}`);

    const form = room.querySelector("form");
    form.addEventListener("submit", messageSubmit);
}

function messageSubmit(_e) {
    _e.preventDefault();
    const input = room.querySelector("input");
    socket.emit("new_message", input.value, roomName, ()=>{
        addNewMessage(`You: ${input.value}`);
        input.value = "";
    });
}


