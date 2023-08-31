import React from 'react';

import FindPasswordForm from '../../components/FindPasswordForm';

import './index.css';

const FindPassword = () => {
    return (
        <div className="fp-bg-container">
            <div className="fp-container">
                <header className="fp-header">
                    <div className="fp-title">找回密码</div>
                </header>
                <section className="fp-section">
                    <FindPasswordForm />
                </section>
            </div>
        </div>
    );
};

export default FindPassword;