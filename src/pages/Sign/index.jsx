import React from 'react';
import { NavLink } from 'react-router-dom';

import SignForm from '../../components/SignForm';

import './index.css';

const Sign = ({ flag }) => {
    return (
        <div className="sign-bg-container">
            <div className="sign-container">
                <header className="sign-header">
                    <NavLink className="sign-link left-nav" to="/sign-in" replace>登录</NavLink>
                    <NavLink className="sign-link right-nav" to="/sign-up" replace>注册</NavLink>
                </header>
                <section className="sign-section">
                    <SignForm flag={flag} />
                </section>
            </div>
        </div>
    );
};

export default Sign;