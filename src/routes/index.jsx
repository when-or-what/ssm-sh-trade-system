import { Navigate } from 'react-router-dom';
import Sign from '../pages/Sign';
import MyLayout from '../pages/MyLayout';
import FindPassword from '../pages/FindPassword';
import AddGood from '../components/AddGood';
import MyGoods from '../pages/MyGoods';

const routers = [
    {
        path: '/sign-in',
        element: <Sign flag={true} />
    },
    {
        path: '/sign-up',
        element: <Sign flag={false} />
    },
    {
        path: '/find-password',
        element: <FindPassword />
    },
    {
        path: '/',
        element: <Navigate to="/all" />
    },
    // 商品种类的路由
    {
        path: '/:cate',
        element: <MyLayout />
    },
    // 我的商品
    {
        path: '/my-good',
        element: <MyGoods />,
        children: [
            // 添加商品
            {
                path: './add',
                element: <AddGood />,
            }
        ]
    },
];

export default routers;