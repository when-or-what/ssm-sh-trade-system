import axios from 'axios';

// 定义用户和商品的接口
const dataProvider = {
    // 用户相关
    user: {
        // 验证用户名是否可用
        verifyName: (userName) => axios.get(`/user/check_name`, { params: { userName } }),
        // 用户注册
        signUp: (data) => axios.post(`/user/sign_up`, data),
        // 用户登录
        signIn: (data) => axios.post(`/user/sign_in`, data),
        // 更新用户信息
        updateInfo: (data) => axios.put(`/user`, data),
        // 更新用户密码
        updatePswd: (data) => axios.put(`/user/change_password`, data),
        // 注销用户
        delete: (id) => axios.delete(`/user/${id}`),
        // 根据id获取用户信息
        getById: (id) => axios.get(`/user/${id}`),
        // 获取用户验证码
        getVcode: (data) => axios.post(`/user/get_vcode`, data),
        // 验证用户的验证码
        verifyVcode: (data) => axios.post(`/user/verify`, data),
        // 重置密码
        resetPswd: (data) => axios.put(`/user/reset_password`, data),
        // 修改邮箱
        updateEmail: (data) => axios.put(`/user/change_email`, data),
        // 上传用户头像: POST `/user/upload`，用于Antd组件上
    },
    // 商品相关
    good: {
        // 验证商品名是否可用
        verifyName: (data) => axios.post(`/good/check_name`, data),
        // 获取商品列表
        getGoods: (data) => axios.post(`/good/s`, data),
        // 获取商品详情
        getById: (id) => axios.get(`/good/${id}`),
        // 添加商品
        add: (data) => axios.post(`/good`, data),
        // 更新商品
        update: (data) => axios.put(`/good`, data),
        // 删除商品
        delete: (ids) => axios.delete(`/good`, { params: { id: ids } }),
        // 上传商品图片: POST `/good/upload`，用于Antd组件上
    },
};

export default dataProvider;