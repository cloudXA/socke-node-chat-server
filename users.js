const users = [];

// 新增用户
const addUser = ({ id, name, room }) => {
  // 首末去除空隙，转小写 
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // 鉴别存储的的用户中是否已经存在相同的name、room 
  const existingUser = users.find((user) => user.room === room && user.name === name);

  // 如果存储的用户、房间已经存在，那么返回报错 
  if(existingUser) {
    return { error: 'Username is taken'};
  }

  // 整理信息，添加到数组中存储，并返回存储到数组中的对象信息 
  const user = { id, name, room };

  users.push(user);

  return { user }
}


// 删除用户
const removeUser = (id) => {
  // 鉴别id身份的user的位置信息 
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) {
    // 从users删除数据的同时返回被删除者的信息 
    return users.splice(index, 1)[0]
  }
}

// 依据id断言正确时返回对应的用户信息 
const getUser = (id) => users.find((user) => user.id === id);

// 依据room从users信息表中筛选出符合room的全部用户
const getUsersInRoom = (room) => users.filter((user) => user.room === room)

console.log(users, 'users之情况')

module.exports = { addUser, removeUser, getUser, getUsersInRoom }
