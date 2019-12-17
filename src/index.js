const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const app = express()
const server =  http.createServer(app)
const io = socketio(server)
const {addUser, removeUser, getUser, getUsersInroom }  = require('./utils/users')

const port = process.env.port || 9000
// app.use(express.static("public"));
const pulicDirectoryPath = path.join(__dirname,'../public'); //chi ra duong dan html,css
app.use(express.static(pulicDirectoryPath)) 
// let count = 0;
io.on('connection',(socket) => { //tao socket
    console.log('WebSocket Connection')

    //lang nge hanh dong cua
    socket.on('join', ( options,callback ) => {
        const {error, user} = addUser({ id: socket.id, ...options})
        if(error) {
           return callback(error)
        }
        socket.join(user.room)
        //
        socket.emit('message',generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has join`))//thong bao nguoi dung truy cap,broadcast thong bao den tat ca
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInroom(user.room)
        })
        callback()
    })
   

 
    socket.on('sendMessage', (message, callback) => {    //lang nghe su kien,chuc nang goi lai
        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message',generateMessage(user.username, message))  //truyen lai cho cac may khach gia tri message
        callback()
    })

    socket.on('sendLocation' , (coords, callback) => { //server tiep nhan vi tri va gui den cac may clien khac
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => { //thong bao nguoi dung da out
        const user = removeUser(socket.id)
        //kiem tra nguoi dung con trong room
        if(user) {
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} out`))
            io.to(user.room).emit('roomData', {
                room : user.room,
                users : getUsersInroom(user.room)
            })
        } 
    })

    // socket.emit('Send Event',count)
    
    // socket.on('increment', () => {
    //     count++
    //     // socket.emit('Send Event', count)
    //     io.emit('Send Event', count)
    // })
})
server.listen(port,() =>{
    console.log('Server running ...')
})
