import React, { useEffect, useState } from "react";

import {
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    MailOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';

import {
    Avatar,
    Form,
    Input,
    Button,
    message,
    Upload,
} from 'antd';

import * as formValidator from '../../utils/validate';
import dataProvider from "../../api/ajax";

import './index.css';
import storage from "../../utils/storage";

const OK = Number.parseInt(process.env.REACT_APP_OK);
const INTERVAL = Number.parseInt(process.env.REACT_APP_VER_INTERVAL);
const VCODE_LENGTH = Number.parseInt(process.env.REACT_APP_VCODE_LENGTH);
const USER_INFO = process.env.REACT_APP_USER_INFO;

const userInfo = storage.get(USER_INFO);

const UserInfo = ({ info, curState, changeDrawerState }) => {
    const [form] = Form.useForm();
    // 提示框
    const [messageApi, contextHolder] = message.useMessage();
    const [readOnly, setReadOnly] = useState(true);
    const [hasEmail, setHasEmail] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
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

    // 修改用户基本信息的表单提交
    const handleFinish = async (values) => {
        console.log('接收到的数据为', values);
        const data = { ...values, id: info.id };
        // 直接使用接口修改即可
        try {
            const res = (await dataProvider.updateUserInfo(data)).data;
            if (!res.state) {
                messageApi.open({
                    type: 'error',
                    content: '修改失败！'
                });
            } else if (res.state === OK) {
                messageApi.open({
                    type: 'success',
                    content: '修改成功！'
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.message
                });
            }
        } catch (err) {
            console.log(err);
            messageApi.open({
                type: 'error',
                content: '修改用户信息时发生未知错误'
            });
        }
        setReadOnly(true);
    };

    // 修改用户密码的表单提交
    const handleSubmit = async (values) => {
        console.log('接收到的数据为', values);
        try {
            const { oldPassword, newPassword } = values;
            const res = (await dataProvider.updateUserPassword({
                id: info.id, oldPassword, newPassword
            })).data;
            console.log('修改之后得到的结果', res);
            if (!res.state) {
                messageApi.open({
                    type: 'error',
                    content: '修改失败！'
                });
            } else if (res.state === OK) {
                messageApi.open({
                    type: 'success',
                    content: '修改成功！'
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.message
                });
            }
        } catch (error) {
            console.log(error);
            messageApi.error('修改用户密码时发生未知错误');
        }
    };

    //////////////////////////////////////

    // 发送验证码的函数
    const handleClick = async (e) => {
        e.preventDefault();
        // 获取用户名和用户邮箱
        // 用户名直接在本地取即可
        const userName = userInfo.userName;
        const userEmail = form.getFieldValue("oldEmail");
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
        const userName = userInfo.userName;
        const userEmail = form.getFieldValue("oldEmail");
        const veriCode = form.getFieldValue("vcode");
        try {
            const data = { userName, userEmail, veriCode };
            const res = (await dataProvider.verifyVcode(data)).data;
            if (!res.state) {
                messageApi.error('验证时发生未知错误');
            } else if (res.state !== OK) {
                messageApi.error(res.message);
            } else {
                // 只有验证成功才会显示出输入新邮箱的输入框
                setShow(true);
            }
        } catch (error) {
            console.log(error);
            messageApi.error('验证时发生未知错误');
        }
    };

    // 修改邮箱的表单提交
    const handleEmailSubmit = async (values) => {
        const { oldEmail, newEmail } = values;
        const data = { id: userInfo.id, oldEmail, newEmail };

        console.log('组装好的数据', data);
        try {
            const res = (await dataProvider.updateUserEmail(data)).data;
            if (!res.state) {
                messageApi.error('修改邮箱时发生未知错误');
            } else if (res.state !== OK) {
                messageApi.error(res.message);
            } else {
                // 邮箱修改成功，提示信息并重置状态
                messageApi.success('邮箱修改成功！');
                // 重置表单数据
                form.resetFields();
                // 重置状态
                setCanSubmit(false);
                setCountdown(INTERVAL);
                setHasEmail(false);
                setIsLoading(false);
                setShow(false);
            }
        } catch (error) {
            console.log(error);
            messageApi.error('修改邮箱时发生未知错误');
        }
    };

    return (
        <>
            {contextHolder}
            {
                // 展示&修改用户信息
                curState === 0 ?
                    <>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <UploadAvatar readOnly={readOnly} uid={info.id} avatar={info.userAvatar} />
                        </div>
                        <div
                            style={{
                                marginTop: '15px'
                            }}
                        >
                            <Form
                                name="userInfo"
                                onFinish={handleFinish}
                                style={{
                                    maxWidth: 600,
                                }}
                            >
                                <Form.Item
                                    name="userName"
                                    label="用户名"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                if (formValidator.usernameValid(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('用户名必须是2-12位由中文、英文、数字、下划线(_)组成的字符串');
                                            }
                                        })
                                    ]}

                                    initialValue={info.userName}
                                >
                                    <Input readOnly={readOnly} />
                                </Form.Item>

                                <Form.Item
                                    name="userContact"
                                    label="联系方式"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                if (formValidator.userContactValid(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('联系方式在40个字内！');
                                            }
                                        })
                                    ]}
                                    initialValue={info.userContact ? info.userContact : '暂无'}
                                >
                                    <Input.TextArea autoSize={true} readOnly={readOnly} />
                                </Form.Item>

                                <Form.Item
                                    name="userRemark"
                                    label="用户简介"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                if (formValidator.userRemarkValid(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('用户简介在200个字内！');
                                            }
                                        })
                                    ]}
                                    initialValue={info.userRemark ? info.userRemark : '暂无'}
                                >
                                    <Input.TextArea autoSize={true} readOnly={readOnly} />
                                </Form.Item>

                                <Form.Item>
                                    {
                                        readOnly ?
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'end'
                                                }}
                                            >
                                                <Button
                                                    type="primary"
                                                    onClick={(e) => {
                                                        // 阻止表单自动提交
                                                        e.preventDefault();
                                                        setReadOnly(false);
                                                    }}
                                                    icon={<EditOutlined />}
                                                >编辑</Button>
                                            </div>
                                            :
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Button
                                                    htmlType="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setReadOnly(true);
                                                    }}
                                                    icon={<CloseOutlined />}
                                                >取消</Button>

                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    icon={<CheckOutlined />}
                                                >确认修改</Button>
                                            </div>
                                    }
                                </Form.Item>
                            </Form>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Button onClick={() => changeDrawerState(1)}>修改密码</Button>
                            <Button onClick={() => changeDrawerState(2)}>修改邮箱</Button>
                        </div>
                    </>
                    :
                    // 修改密码
                    curState === 1 ?
                        <>
                            <Form
                                name="changePassword"
                                onFinish={handleSubmit}
                                style={{
                                    maxWidth: 600,
                                }}
                            >
                                <Form.Item
                                    name="oldPassword"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入原密码!',
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
                                        placeholder="原密码"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>

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

                                <Form.Item>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Button
                                            icon={<CloseOutlined />}
                                            onClick={() => changeDrawerState(0)}
                                        >取消</Button>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<CheckOutlined />}
                                        >确认修改</Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </>
                        :
                        curState === 2 ?
                            // 修改邮箱
                            <>
                                <Form
                                    name="changeEmail"
                                    validateTrigger="onChange"
                                    onFinish={handleEmailSubmit}
                                    style={{
                                        maxWidth: 600,
                                    }}
                                    form={form}
                                >
                                    <Form.Item
                                        name="oldEmail"
                                        validateFirst={true}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入邮箱！',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(rule, value) {
                                                    if (formValidator.emailValid(value)) {
                                                        setHasEmail(true);
                                                        return Promise.resolve();
                                                    }
                                                    setHasEmail(false);
                                                    return Promise.reject('邮箱不合法，请重新输入！');
                                                }
                                            })
                                        ]}
                                    >
                                        <Input className="site-form-item-input"
                                            prefix={<MailOutlined className="site-form-item-icon" />}
                                            placeholder="原邮箱"
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
                                                    width: '52%'
                                                }}
                                                prefix={<CheckCircleOutlined className="site-form-item-icon" />}
                                                maxLength={VCODE_LENGTH}
                                                placeholder="验证码"
                                            />
                                            <Button
                                                style={{
                                                    width: '45%'
                                                }}
                                                type="primary"
                                                onClick={handleClick}
                                                disabled={!hasEmail || isLoading}
                                            >
                                                {isLoading ? `重新发送(${countdown})` : '发送验证码'}
                                            </Button>
                                        </div>
                                    </Form.Item>

                                    {
                                        show &&
                                        <Form.Item
                                            name="newEmail"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入新邮箱!',
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
                                                placeholder="新邮箱"
                                            />
                                        </Form.Item>
                                    }

                                    <Form.Item>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <Button
                                                icon={<CloseOutlined />}
                                                onClick={() => changeDrawerState(0)}
                                            >取消</Button>

                                            {
                                                show ?
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        disabled={!canSubmit}
                                                    >
                                                        确认修改
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
                                <a href="https://www.baidu.com">忘记了邮箱？</a>
                            </>
                            :
                            null
            }
        </>
    );
};

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('只能上传jpg/png格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

/**
 * 用户头像上传组件
 */
const UploadAvatar = ({ readOnly, uid, avatar }) => {
    const [imageUrl, setImageUrl] = useState(avatar);

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageUrl(img.src);
        };
        img.onerror = () => {
            setImageUrl('/images/user.jpg');
        };
        img.src = imageUrl;
    }, [imageUrl]);

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            const res = info.file.response;
            console.log(res);
            if (res.state && res.state === OK) {
                // 上传图片成功
                console.log('头像上传成功');
                message.success('修改头像成功');
            } else {
                console.log('头像上传失败');
                message.error('修改头像失败');
            }
            getBase64(info.file.originFileObj, (url) => {
                setImageUrl(url);
            });
        }
    };

    return (
        <Upload
            name="file"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action={`/user/upload/${uid}`}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            disabled={readOnly}
        >
            <Avatar size={100} src={imageUrl} />
        </Upload>
    );
};

export default UserInfo;