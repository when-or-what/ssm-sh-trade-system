// 封装对浏览器storage的操作
const storage = {
    // 对localStorage的封装
    // 取出数据
    get: (key) => JSON.parse(localStorage.getItem(key)),
    // 存入数据
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    // 删除数据
    remove: (key) => localStorage.removeItem(key),
    // 清空数据
    clear: () => localStorage.clear(),

    // 对sessionStorage的封装
    // 取出数据
    ssGet: (key) => JSON.parse(sessionStorage.getItem(key)),
    // 存入数据
    ssSet: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
    // 删除数据
    ssRemove: (key) => sessionStorage.removeItem(key),
    // 清空数据
    ssClear: () => sessionStorage.clear(),
};

export default storage;