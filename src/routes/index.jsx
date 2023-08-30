import { Navigate } from 'react-router-dom';
import Sign from '../pages/Sign';
import MyLayout from '../pages/MyLayout';
import FindPassword from '../pages/FindPassword';

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
    // {
    //     path: '/',
    //     element: <Navigate to="/sign-in" />
    // },
    {
        path: '/',
        element: <MyLayout />
    },
];

export default routers;