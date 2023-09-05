import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    Input,
    Pagination,
    Drawer,
    message,
    Dropdown,
    Modal,
} from 'antd';


import UserInfo from '../../components/UserInfo';

import dataProvider from '../../api';
import storage from '../../utils/storage';

import './index.css';
import MyContent from '../../components/MyContent';

const { Header, Footer, Sider } = Layout;
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
    getMenuItem('book', <FireOutlined />, '书本资料'),
    getMenuItem('device', <HeartOutlined />, '电子设备'),
    getMenuItem('sport', <SmileOutlined />, '运动器材'),
    getMenuItem('food', <FireOutlined />, '食物'),
    getMenuItem('cloth', <HeartOutlined />, '衣服'),
    getMenuItem('other', <EllipsisOutlined />, '其他'),
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
    // 刷新整个界面，以免数据一样
    const [layoutKey, setLayoutKey] = useState('1');
    // 刷新抽屉，以免数据一样
    const [key, setKey] = useState('1');
    // 当前抽屉处于什么状态（展示用户信息0，修改密码1，修改邮箱2）
    const [drawerState, setDrawerState] = useState(0);
    const changeDrawerState = (state) => setDrawerState(state);
    // 确认对话框的状态(有退出登录和注销两种，0代表对话框关闭，1代表以退出登录的状态打开，2代表以注销的状态打开)
    const [confirmOpen, setConfirmOpen] = useState(0);
    // 获得当前路径参数
    const { cate } = useParams();
    // 商品分页相关
    const [pageInfo, setPageInfo] = useState({
        curPage: 1, // 当前页码
        pageSize: 10, // 每页大小
        total: 100, // 总条数
    });
    // 伸到内容组件里的手
    const changePageInfo = (pageInfo) => setPageInfo(pageInfo);

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
                // 用户的商品信息
                navigate('/my-good');
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
            getMenuItem('user-info', <UserOutlined />, '我的信息') :
            getMenuItem('user-sign', <UserOutlined />, '登录'),
        userInfo && userInfo.userId ? getMenuItem('good-info', <GoldOutlined />, '我的商品') : null,
        userInfo && userInfo.userId ? getMenuItem('exit', <PoweroffOutlined />, '退出登录') : null,
        userInfo && userInfo.userId ? getMenuItem('logout', <UserDeleteOutlined />, '注销') : null,
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
    // 设置获取商品的条件，固定的种类、当前页码、每页大小、搜索关键词
    const [conds, setConds] = useState({});

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
                // 刷新页面
                setLayoutKey(Math.random().toString());
                return;
            } else if (res.state !== OK) {
                messageApi.error(res.message);
                // 清除本地缓存
                storage.remove(USER_INFO);
                // 刷新页面
                setLayoutKey(Math.random().toString());
                return;
            } else if (res.data === null) {
                messageApi.error('用户不存在');
                // 清除本地缓存
                storage.remove(USER_INFO);
                // 刷新页面
                setLayoutKey(Math.random().toString());
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
            // 刷新页面
            setLayoutKey(Math.random().toString());
            return;
        }
        // 然后打开抽屉
        showDrawer();
    };

    useEffect(() => {
        setConds({
            goodCate: cate === 'all' ? null : cate, // 商品种类，默认不传
            keyword: null,// 关键词，默认不传,
            pageNum: 1,// 当前页码，默认为1
            pageSize: 10,// 每页大小，默认为10
        });
    }, [cate]);

    // 给最左边的商品种类菜单项添加回调函数
    // 只需要改变获取条件即可
    // 注意，当选项为全部时，要将选择条件的种类改为null
    for (let i in items) {
        items[i].onClick = () => {
            navigate(`/${items[i].key}`, { replace: true });
        }
    }

    return (
        <Fragment key={layoutKey}>
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
                        defaultSelectedKeys={cate}
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

                    {/* 搜索框 */}
                    <div
                        style={{
                            width: '30%',
                            margin: '14px auto'
                        }}
                    >
                        <Search
                            placeholder="输入商品名搜索"
                            allowClear
                            enterButton
                            size="middle"
                            onSearch={(value) => setConds({ ...conds, keyword: value })}
                        />
                    </div>

                    {/* 中间展示区主体部分 */}
                    <MyContent filter={conds} changePageInfo={changePageInfo} />

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
                            total={pageInfo.total}
                            pageSize={pageInfo.pageSize}
                            current={pageInfo.curPage}
                            onChange={(pageNum, pageSize) => setConds({ ...conds, pageNum, pageSize })}
                            showSizeChanger
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
        </Fragment>
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
                    const res = (await dataProvider.user.delete(user.userId)).data;

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