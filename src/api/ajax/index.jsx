import axios from 'axios';

// 定义接口
const dataProvider = {
    // 用户登录接口
    signIn: (data) => axios.post('/user/sign_in', data),
    // 用户注册接口
    signUp: (data) => axios.post('/user/sign_up', data),
    // 更新用户基本信息接口
    updateUserInfo: (data) => axios.put('/user/update', data),
    // 更新用户密码接口
    updateUserPassword: (data) => axios.put(`/user/change_password`, data),
    // 注销用户接口
    deleteUser: (data) => axios.put(`/user/logout`, data),
    // 根据id获取用户信息
    getUserById: (id) => axios.get(`/user/get/${id}`),
    // 获取用户验证码
    getVcode: (data) => axios.post(`/user/get_vcode`, data),
    // 验证用户的验证码
    verifyVcode: (data) => axios.post(`/user/verify`, data),
    // 重置密码
    resetPswd: (data) => axios.put(`/user/reset_password`, data),
    // 修改邮箱
    updateUserEmail: (data) => axios.put(`/user/change_email`, data),
    // 根据username获取用户的新密码
    getNewPasswordByUserName: (data) => axios.get(`/user/get_new_password/${data.userName}`),
    // 获取商品列表
    getGoods: (data) => axios.get('/good/get', {
        params: {
            cate: data.cate,
            keyword: '',
            pageNum: 1,
            pageSize: 30,
            userId: 1
        }
    })
};

export default dataProvider;