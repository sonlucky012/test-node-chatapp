const socket = io()
//Elements
const $messageFrom = document.querySelector('#message-form')
const $messageFromInput = $messageFrom.querySelector('input')
const $messageFromButton = $messageFrom.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//Teamplates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Opitons
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix : true})

const autoscroll = ()  => {
    //new message element
    const $newMessage = $messages.lastElementChild

    //height the message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMarin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMarin
    // console.log(newMessageStyles)
    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}
socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message: message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage',(message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username : message.username,
        url : message.url,

        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

//in ra so user
socket.on('roomData', ({room, users} ) => {
    // 
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageFrom.addEventListener('submit', (e) => {    //truy van bang id, lang nghe su kien
    e.preventDefault()
    $messageFromButton.setAttribute('disable','disable')
// disable
    // const message = document.querySelector('input').value     //truyen gia tri cho tham so,o day la dien thong tin vao input
     //phat sinh 1 su kien: gui message toi server voi tham so la message dc nhap tu input

    const message = e.target.elements.message.value

    socket.emit('sendMessage' ,message, (error) => {
        $messageFromButton.removeAttribute('disable')
        $messageFromInput.value = ''
        $messageFromInput.focus()
        //enable
        // console.log('The message was delivered',message)
        if(error) {
            return console.log(error)
        }
        console.log('Message delivered')
    })   
})
// socket.on('Send Event', (count) => {
//     console.log('The cout has been Event',count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')

// })

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) { //kiem tra dia chi co ton tai
        return alert('Location is not support')
    }

    $sendLocationButton.setAttribute('disable','disable')

    navigator.geolocation.getCurrentPosition((position) => { //tim den vi tri nguoi dung
            // console.log(position)
            //gui vi tri cho server
            socket.emit('sendLocation', { 
                latitude : position.coords.latitude, //bat vi do
                longitude : position.coords.longitude //bat kinh do
            }, () => {
                $sendLocationButton.removeAttribute('disable')
                console.log('Location shared')
            })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href ='/'
    }
})
