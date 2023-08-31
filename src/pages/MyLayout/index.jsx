import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    HeartOutlined,
    FireOutlined,
    AppstoreOutlined,
    SmileOutlined,
    EllipsisOutlined,
    UserOutlined,
    SettingOutlined,
    GoldOutlined,
    PoweroffOutlined,
    UserDeleteOutlined,
} from '@ant-design/icons';

import {
    Layout,
    Menu,
    Button,
    Row,
    Spin,
    Input,
    Pagination,
    Drawer,
    message,
    Dropdown,
    Modal,
} from 'antd';

import MyCol from '../../components/MyCol';
import UserInfo from '../../components/UserInfo';

import dataProvider from '../../api';
import storage from '../../utils/storage';

import './index.css';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

// 浏览器本地用户信息变量名
const USER_INFO = process.env.REACT_APP_USER_INFO;
const OK = Number.parseInt(process.env.REACT_APP_OK);

// 确认对话框的内容（有退出登录和注销用户两种）
const exitConfirmText = '退出登录';
const logoutConfirmText = '注销';

// 简化菜单栏选项的定义
const getMenuItem = (key, icon, label) => ({
    key: key,
    icon: icon,
    label: label
});

// 左边菜单栏目录
const items = [
    getMenuItem('all', <AppstoreOutlined />, '全部'),
    getMenuItem('meat', <FireOutlined />, '荤菜'),
    getMenuItem('vegetable', <HeartOutlined />, '素菜'),
    getMenuItem('drink', <SmileOutlined />, '酒水'),
    getMenuItem('other', <EllipsisOutlined />, '其它')
];

// 页头页脚所用背景色
const headFootBgColor = '#D2BDAE';
// 中间部分颜色
const mainBgColor = '#F7ECE4';
// 左边菜单栏的背景色
const leftMenuBgColor = '#D6B199';

const MyLayout = () => {
    // 每一次加载组件时都将本地的用户信息缓存加到内存中
    const userInfo = storage.get(USER_INFO);
    // 提示框
    const [messageApi, contextHolder] = message.useMessage();
    // 编程式路由导航
    const navigate = useNavigate();
    // 用户信息抽屉
    const [open, setOpen] = useState(false);
    // 设置当前用户的信息
    const [info, setInfo] = useState({});
    // 刷新抽屉，以免数据一样
    const [key, setKey] = useState('1');
    // 当前抽屉处于什么状态（展示用户信息0，修改密码1，修改邮箱2）
    const [drawerState, setDrawerState] = useState(0);
    const changeDrawerState = (state) => setDrawerState(state);
    // 确认对话框的状态(有退出登录和注销两种，0代表对话框关闭，1代表以退出登录的状态打开，2代表以注销的状态打开)
    const [confirmOpen, setConfirmOpen] = useState(0);
    // 设置按钮下拉菜单菜单项的点击事件
    const handleMenuClick = (e) => {
        const key = e.key;
        console.log('hello', key);
        switch (key) {
            case 'user-sign':
                // 登录，直接跳转到登录页面即可
                navigate('/sign-in', { replace: true });
                break;
            case 'user-info':
                // 用户信息
                handleClick();
                break;
            case 'good-info':
                // 转到商品信息
                break;
            case 'exit':
                // 退出登录
                setConfirmOpen(1);
                break;
            case 'logout':
                // 注销
                setConfirmOpen(2);
                break;
            default:
                console.log('奇了怪了');
                break;
        }
    };

    // 设置菜单的菜单项
    const dropdownMenuItems = [
        userInfo && userInfo.userId ?
            getMenuItem('user-info', <UserOutlined />, '用户信息') :
            getMenuItem('user-sign', <UserOutlined />, '登录'),
        userInfo && userInfo.userId ? getMenuItem('good-info', <GoldOutlined />, '商品信息') : null,
        userInfo && userInfo.userId ? getMenuItem('exit', <PoweroffOutlined />, '退出登录') : null,
        userInfo && userInfo.userId ? getMenuItem('logout', <UserDeleteOutlined />, '注销用户') : null,
    ];
    // 设置右上角下拉菜单的
    const menuProps = {
        items: dropdownMenuItems,
        onClick: handleMenuClick,
    };
    // 显示抽屉
    const showDrawer = () => {
        setOpen(true);
        setKey('2');
        setDrawerState(0);
    };
    // 关闭抽屉
    const onClose = () => {
        setOpen(false);
        setKey('1');
        setDrawerState(0);
    };
    // 最左边的菜单栏
    const [collapsed, setCollapsed] = useState(false);
    // 中间关于商品部分的组件状态，一个对象类型，包含许多变量
    const [state, setState] = useState({
        isLoading: false,
        err: '',
        goods: []
    });

    // 用户信息抽屉按钮点击事件
    // 能点击到这个按钮，说明本地肯定是有用户信息的
    const handleClick = async () => {
        // 直接重新获取即可
        try {
            // 如果本地有用户信息，那么重新获取
            const res = (await dataProvider.user.getById(userInfo.userId)).data;
            if (!res.state) {
                messageApi.error('登录过期，请重新登录');
                // 清除本地缓存
                storage.remove(USER_INFO);
                setOpen(false);
                return;
            } else if (res.state !== OK) {
                messageApi.error(res.message);
                // 清除本地缓存
                storage.remove(USER_INFO);
                setOpen(false);
                return;
            } else if (res.data === null) {
                messageApi.error('用户不存在');
                // 清除本地缓存
                storage.remove(USER_INFO);
                setOpen(false);
                return;
            } else {
                // 成功获取到了用户数据
                const { userId, userName, userContact, userRemark, userAvatar } = res.data;
                const user = { userId, userName, userContact, userRemark, userAvatar };
                // 则更新本地用户信息
                storage.set(USER_INFO, user);
                // 并且设置组件状态
                // 目的是让用户信息组件获取到这个信息
                setInfo(user);
            }
        } catch (error) {
            console.log(error);
            messageApi.error('登录过期，请重新登录');
            // 清除本地缓存
            storage.remove(USER_INFO);
            setOpen(false);
            return;
        }
        // 然后打开抽屉
        showDrawer();
    };

    // 点击最左边商品类别菜单项的回调函数
    const callback = async (cate) => {
        // 发送请求之前，更新状态
        setState({
            ...state,
            isLoading: true
        });
        // 发送请求
        try {
            const res = (await dataProvider.good.getGoods({
                goodCate: 'all',
                pageNum: 1,
                pageSize: 10,
            })).data;
            if (res.state && res.state === OK) {
                // 请求成功，展示
                console.log(res.data);
                setState({
                    ...state,
                    isLoading: false,
                    goods: res.data.data
                });
            } else {
                // 请求未成功
                console.log(res.message);
                setState({
                    ...state,
                    err: res.message
                });
            }
        } catch (error) {
            console.log(error);
            setState({
                ...state,
                err: err.message
            });
        }
    };

    // 给菜单项添加回调函数
    for (let i in items) {
        items[i].onClick = () => callback(items[i].key === 'all' ? '' : items[i].key);
    }

    const { isLoading, err, goods } = state;

    return (
        <>
            {contextHolder}
            <Layout
                style={{
                    height: '100vh'
                }}
            >
                <Sider
                    collapsible collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    style={{
                        backgroundColor: leftMenuBgColor,
                    }}
                >
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={'all'}
                        mode="inline"
                        items={items}
                        style={{
                            backgroundColor: leftMenuBgColor,
                        }}
                    />
                </Sider>
                <Layout
                    style={{
                        minHeight: '100vh',
                        backgroundColor: mainBgColor
                    }}
                >
                    {/* 页头部分 */}
                    <Header
                        style={{
                            height: '5vh',
                            background: headFootBgColor,
                            display: 'flex',
                            justifyContent: 'right',
                            alignItems: 'center',
                            padding: '0px 30px 0px 0px'
                        }}
                    >

                        <div
                            style={{
                                width: '80px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Dropdown
                                menu={menuProps}
                                arrow
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<SettingOutlined />}
                                    size="middle"
                                />
                            </Dropdown>
                        </div>

                    </Header>
                    {/* 中间展示区主体部分 */}
                    <Content
                        style={{
                            margin: '10px 7px 0px 0px'
                        }}
                    >
                        <div
                            style={{
                                width: '30%',
                                margin: '0 auto',
                                padding: '0 0 8px 0'
                            }}
                        >
                            <Search
                                placeholder="输入商品名搜索"
                                allowClear
                                enterButton
                                size="middle"
                            // onSearch={onSearch}
                            />
                        </div>

                        <div
                            style={{
                                padding: '10px',
                                height: '80vh',
                                backgroundColor: mainBgColor,
                                fontSize: '16px',
                                overflowY: 'scroll'
                            }}
                        >
                            {/* 这里是商品展示区，放置商品卡片列表 */}
                            {
                                isLoading ?
                                    <Spin size="large" /> :
                                    err !== '' ?
                                        <h2 style={{ color: 'red' }}>{err}</h2> :
                                        <Row gutter={[16, 8]}>
                                            {goods.map(goodItem => {
                                                return (
                                                    <MyCol
                                                        good={goodItem}
                                                        key={goodItem.goodId}
                                                    />
                                                );
                                            })}
                                        </Row>
                            }
                        </div>
                    </Content>

                    {/* 页脚部分 */}
                    <Footer
                        style={{
                            height: '48px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            backgroundColor: headFootBgColor,
                            padding: '0 30px 0 0'
                        }}
                    >

                        <Pagination
                            total={100522}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total) => `共 ${total} 条`}
                            size="small"
                        />
                    </Footer>
                </Layout>
            </Layout>

            {/* 抽屉，用于展示和修改用户信息 */}
            <Drawer
                key={key}
                title={drawerState === 0 ? "用户信息" : drawerState === 1 ? "修改密码" : drawerState === 2 ? "修改邮箱" : "错误状态"}
                width={300}
                onClose={onClose}
                open={open}
                bodyStyle={{
                    paddingBottom: 80,
                }}
            >
                {
                    // 抽屉直接显示用户信息
                    <UserInfo
                        info={info}
                        curState={drawerState}
                        changeDrawerState={changeDrawerState}
                    />
                }
            </Drawer>
            {/* 确认对话框 */}
            <ConfirmModal
                key={(confirmOpen > 0 && confirmOpen === 1) ? 'exit' : 'logout'}
                open={confirmOpen}
                setOpen={setConfirmOpen}
            />
        </>
    );
};

// 确认对话框
// 这里的open参数是0 1 2：关闭，登录开，注销开
const ConfirmModal = ({ open, setOpen }) => {
    // 对话框显示的文字
    const text = (open > 0 && open === 1) ? exitConfirmText : logoutConfirmText;
    // 具体的开闭状态
    const openState = (open !== 0);
    // states
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(`确定要${text}吗？`);

    const handleOk = async () => {
        setModalText(`正在${text}...`);
        setConfirmLoading(true);
        if (open > 0) {
            // 先获得本地存储的用户信息
            const user = storage.get(USER_INFO);

            if (open === 2) {
                try {
                    // 如果是注销的话还要请求接口
                    const res = (await dataProvider.deleteUser({ id: user.userId })).data;

                    if (!res.state) {
                        message.error('注销用户时发生未知错误');
                        setOpen(0);
                        setConfirmLoading(false);
                        return;
                    } else if (res.state !== OK) {
                        message.error(res.message);
                        setOpen(0);
                        setConfirmLoading(false);
                        return;
                    }
                } catch (error) {
                    console.log(error);
                    message.error('注销用户时发生未知错误');
                    setOpen(0);
                    setConfirmLoading(false);
                    return;
                }
            }
            // 退出登录或者注销，二者共同的操作是将本地缓存清除掉
            storage.remove(USER_INFO);
        }
        // 不管怎么都等1.5秒
        setTimeout(() => {
            setOpen(0);
            setConfirmLoading(false);
        }, 1500);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(0);
    };
    return (
        <Modal
            title="提示"
            open={openState}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            cancelText="取消"
            okText="确定"
        >
            <p>{modalText}</p>
        </Modal>
    );
};

export default MyLayout;