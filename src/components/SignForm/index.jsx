import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
    LockOutlined,
    UserOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    MailOutlined
} from '@ant-design/icons';

import {
    Button,
    Checkbox,
    Form,
    Input,
    message
} from 'antd';

import dataProvider from '../../api';
import * as formValidator from '../../utils/validate';
import storage from '../../utils/storage';

import './index.css';

// 浏览器本地用户信息变量名
const userInfo = process.env.REACT_APP_USER_INFO;
const OK = Number.parseInt(process.env.REACT_APP_OK);

/**
 * 
 * @param {flag} 表示是登录表单还是注册表单，true为登录表单，false是注册表单 
 * @returns 登录/注册表单组件
 */
const SignForm = ({ flag }) => {
    // 提示框
    const [messageApi, contextHolder] = message.useMessage();
    // 路由导航
    const navigate = useNavigate();

    // 点击登录或者注册按钮
    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        // 先判断是登录表单还是注册表单
        if (flag) {
            // 解构登录表单数据
            const { userName, userPswd } = values;
            // 登录，提交数据即可
            try {
                const response = (await dataProvider.user.signIn({ userName, userPswd })).data;
                if (response.state !== OK) {
                    // 登录不成功，显示错误信息
                    messageApi.open({
                        type: 'error',
                        content: response.message
                    });
                } else {
                    // 登录成功，保存个人信息在本地，然后跳到主页
                    // 保存的用户信息只需要可公开的字段即可
                    console.log('response data', response.data);
                    const { userId, userName, userContact, userRemark, userAvatar } = response.data;
                    const user = { userId, userName, userContact, userRemark, userAvatar };
                    console.log('user', user);
                    storage.set(userInfo, user);
                    navigate('/', { replace: true });
                }
            } catch (err) {
                console.log(err);
                // 发生错误
                messageApi.open({
                    type: 'error',
                    content: '登录时发生未知错误'
                });
            }
        } else {
            // 注册，先让用户勾选同意协议
            if (!values.protocol) {
                // 如果没勾选，则出现弹窗提示
                messageApi.open({
                    type: 'warning',
                    content: '请勾选同意协议按钮'
                });
            } else {
                // 解构注册表单数据
                const { userName, userPswd, userEmail } = values;
                // 提交数据
                try {
                    const response = (await dataProvider.user.signUp({
                        userName, userPswd, userEmail
                    })).data;
                    if (response.state !== OK) {
                        // 注册未成功
                        messageApi.open({
                            type: 'error',
                            content: response.message
                        });
                    } else {
                        // 提示注册成功即可
                        messageApi.open({
                            type: 'success',
                            content: '注册成功，请切换至登录页面登录！'
                        });
                    }
                } catch (err) {
                    console.log(err);
                    // 发生错误
                    messageApi.open({
                        type: 'error',
                        content: '注册时发生未知错误'
                    });
                }
            }
        }
    };

    return (
        <>
            {/* 这个东西的位置是有讲究的，不能乱放 */}
            {contextHolder}

            <Form
                // key属性用于组件的重新渲染，防止登录中输入框的内容在注册中还在
                key={flag ? 'sign_in' : 'sign_up'}
                name="sign"
                style={{
                    backgroundColor: '#F2F6F435'
                }}
                initialValues={{
                    remember: true,
                    protocol: false
                }}
                validateTrigger="onChange"
                onFinish={onFinish}
            >
                <Form.Item
                    name="userName"
                    validateFirst={true}
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名！',
                        },
                        ({ getFieldValue }) => ({
                            async validator(rule, value) {
                                if (formValidator.usernameValid(value)) {
                                    if (!flag) {
                                        // 仅在注册的时候才提示
                                        const res = (await dataProvider.user.verifyName(value)).data;
                                        if (!res.data) {
                                            return Promise.reject('用户名已被占用');
                                        }
                                    }
                                    return Promise.resolve();
                                }
                                return Promise.reject('用户名必须是2-12位由中文、英文、数字、下划线(_)组成的字符串');
                            }
                        })
                    ]}
                >
                    <Input
                        className="site-form-item-input"
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="用户名" />
                </Form.Item>

                <Form.Item
                    name="userPswd"
                    validateFirst={true}
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (formValidator.passwordValid(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('密码必须是4-15位由英文、数字、下划线(_)和特殊字符(@#$%.)组成的字符串');
                            }
                        })
                    ]}
                >
                    <Input.Password
                        className="site-form-item-input"
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="密码"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                {
                    flag ?
                        <>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>记住我</Checkbox>
                                </Form.Item>

                                <NavLink to="/find-password" replace >找回密码</NavLink>
                            </Form.Item>
                        </>
                        :
                        <>
                            <Form.Item
                                name="userEmail"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入邮箱！',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (formValidator.emailValid(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('邮箱不合法，请重新输入！');
                                        }
                                    })
                                ]}
                            >
                                <Input className="site-form-item-input"
                                    prefix={<MailOutlined className="site-form-item-icon" />}
                                    placeholder="邮箱"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Form.Item
                                    name="protocol"
                                    valuePropName="checked"
                                    noStyle
                                >
                                    <Checkbox>我已阅读<a href="/#">相关协议</a></Checkbox>
                                </Form.Item>
                            </Form.Item>
                        </>
                }

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="sign-form-button">
                        {flag ? '登录' : '注册'}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default SignForm;