import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    LockOutlined,
    UserOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    MailOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

import {
    Button,
    Form,
    Input,
    message
} from 'antd';

import dataProvider from '../../api';
import * as formValidator from '../../utils/validate';

const OK = Number.parseInt(process.env.REACT_APP_OK);
const INTERVAL = Number.parseInt(process.env.REACT_APP_VER_INTERVAL);
const VCODE_LENGTH = Number.parseInt(process.env.REACT_APP_VCODE_LENGTH);

const FindPasswordForm = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [canSubmit, setCanSubmit] = useState(false);
    const [hasUserName, setHasUserName] = useState(false);
    const [hasUserEmail, setHasUserEmail] = useState(false);
    const [show, setShow] = useState(false);
    // 加载验证码
    const [isLoading, setIsLoading] = useState(false);
    // 按钮上显示的秒数
    const [countdown, setCountdown] = useState(INTERVAL);
    // 利用生命周期钩子做倒计时
    useEffect(() => {
        let timer = null;
        if (isLoading && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (isLoading && countdown === 0) {
            setIsLoading(false);
            setCountdown(INTERVAL);
        }
        return () => clearTimeout(timer);
    }, [isLoading, countdown]);

    // 返回登录页面的函数
    const backToSignIn = () => {
        navigate('/sign-in', { replace: true });
    };

    // 发送验证码的函数
    const handleClick = async (e) => {
        e.preventDefault();
        // 仅获取用户名和用户邮箱
        const userName = form.getFieldValue("userName");
        const userEmail = form.getFieldValue("userEmail");
        try {
            const data = { userName, userEmail };
            const res = (await dataProvider.getVcode(data)).data;
            if (!res.state) {
                messageApi.error('发送验证码时发生未知错误');
            } else if (res.state !== OK) {
                messageApi.error(res.message);
            } else {
                // 仅有发送验证码成功时才会加载
                setIsLoading(true);
            }
        } catch (error) {
            console.log(error);
            messageApi.error('发送验证码时发生未知错误');
        }
    };

    // 确定按钮的函数，内含验证码的验证
    const handleConfirm = async (e) => {
        e.preventDefault();
        // 获取用户名和用户邮箱以及验证码
        const userName = form.getFieldValue("userName");
        const userEmail = form.getFieldValue("userEmail");
        const veriCode = form.getFieldValue("vcode");
        try {
            const data = { userName, userEmail, veriCode };
            const res = (await dataProvider.verifyVcode(data)).data;
            if (!res.state) {
                messageApi.error('验证时发生未知错误');
            } else if (res.state !== OK) {
                messageApi.error(res.message);
            } else {
                // 只有验证成功才会显示出重置密码的输入框
                setShow(true);
            }
        } catch (error) {
            console.log(error);
            messageApi.error('验证时发生未知错误');
        }
    };

    // 表单提交的函数
    const onFinish = async (values) => {
        const { userName, userEmail, newPassword } = values;
        const data = { userName, userEmail, userPswd: newPassword };

        console.log('组装好的数据', data);
        try {
            const res = (await dataProvider.resetPswd(data)).data;
            if (!res.state) {
                messageApi.error('重置密码时发生未知错误');
            } else if (res.state !== OK) {
                messageApi.error(res.message);
            } else {
                // 重置密码成功，提示并跳转
                messageApi.success('密码重置成功，即将返回登录页面...', 2, backToSignIn);
            }
        } catch (error) {
            console.log(error);
            messageApi.error('重置密码时发生未知错误');
        }
    };

    return (
        <>
            {/* 这个东西的位置是有讲究的，不能乱放 */}
            {contextHolder}
            <Form
                name="find-password"
                style={{
                    backgroundColor: '#F2F6F435'
                }}
                validateTrigger="onChange"
                onFinish={onFinish}
                form={form}
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
                            validator(rule, value) {
                                if (formValidator.usernameValid(value)) {
                                    setHasUserName(true);
                                    return Promise.resolve();
                                }
                                setHasUserName(false);
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
                    name="userEmail"
                    validateFirst={true}
                    rules={[
                        {
                            required: true,
                            message: '请输入邮箱！',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (formValidator.emailValid(value)) {
                                    setHasUserEmail(true);
                                    return Promise.resolve();
                                }
                                setHasUserEmail(false);
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

                <Form.Item
                    name="vcode"
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (formValidator.vcodeValid(value)) {
                                    setCanSubmit(true);
                                    return Promise.resolve();
                                }
                                setCanSubmit(false);
                                return Promise.reject('验证码是由6位数字和大小写英文字母组成的字符串');
                            }
                        }),
                    ]}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Input
                            style={{
                                width: '60%'
                            }}
                            prefix={<CheckCircleOutlined className="site-form-item-icon" />}
                            placeholder="验证码"
                            maxLength={VCODE_LENGTH}
                        />
                        <Button
                            style={{
                                width: '35%'
                            }}
                            type="primary"
                            onClick={handleClick}
                            disabled={(!hasUserEmail || !hasUserName) || isLoading}
                        >
                            {isLoading ? `重新发送(${countdown})` : '发送验证码'}
                        </Button>
                    </div>
                </Form.Item>

                {
                    show &&
                    <>
                        <Form.Item
                            name="newPassword"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入新密码!',
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
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="新密码"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['newPassword']}
                            rules={[
                                {
                                    required: true,
                                    message: '请确认新密码!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('与新密码不匹配!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="确认新密码"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                    </>
                }

                <Form.Item>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Button onClick={backToSignIn}>返回</Button>
                        {
                            show ?
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={!canSubmit}
                                >
                                    重置密码
                                </Button>
                                :
                                <Button
                                    type="primary"
                                    htmlType="button"
                                    disabled={!canSubmit}
                                    onClick={handleConfirm}
                                >
                                    确定
                                </Button>
                        }
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};

export default FindPasswordForm;