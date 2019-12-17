const users = []

//add,remove,getuser,getuserinroom
const addUser = ({ id, username, room}) => {
    //clear data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()


    //vilator data

    if(!username || !room){
        return {
            error : 'Username and room not required'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    }) 

    //validate username
    if(existingUser) {
        return {
            error : 'Username is in user'
        }
    }

    //store user

    const user = { id, username, room}
    users.push(user)
    return {user}
}
    //romove user
    const removeUser = (id) => {
        const index = users.findIndex((user) => user.id === id)
        if(index !== -1) {
            return users.splice(index, 1)[0]
        }
    }

    const getUser = (id) => {
        return users.find((user) => user.id === id)
    }
//add user VD
// addUser({
//     id: 1, 
//     username: 'sonlucky',
//     room : 'room'

// })

//loc ds nguoi dung
const getUsersInroom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)

}
//pack action
module.exports = {
     addUser,
     removeUser,
     getUser,
     getUsersInroom
}
// addUser({
//     id: 2, 
//     username: 'sonlucky123',
//     room : 'room'

// })
// addUser({
//     id: 3, 
//     username: 'sonlucky12345',
//     room : 'ram'

// })

// const user = getUser(21)
// console.log(user)

// //hien thi ds user trong room
// const userList = getUsersInroom('ram')
// console.log(userList)
// console.log(users)

// // const res = addUser({
// //     id : 55,
// //     username : 'toancho',
// //     room : 'aloalo'
// // })

// // console.log(res)
// const removeUser = removeUser(1)
//  console.log(removeUser)
//  console.log(users)