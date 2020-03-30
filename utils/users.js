const users = [];

//Join user to chat
function userJoin(id, username, room){
  const user = {id, username, room};
  users.push(user);

  return user;
}

//Get current user 
function getUser(id){
  return users.find(item => item.id === id);
}

//user leaves chat
function userLeave(id){
  const index = users.findIndex(user => user.id === id);

  if (index !== -1){
    return users.splice(index, 1)[0];
  }
}

//get room users
function getRoom(room){
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getUser,
  userLeave,
  getRoom
}