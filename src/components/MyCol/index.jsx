import React, { useState, useContext } from 'react';

import {
    Card,
    Col,
    Button,
    Tag, Tooltip,
    // Collapse
} from 'antd';

import './index.css';

const MyCol = ({ good }) => {
    const { images, goodName, goodPrice, remark, goodId } = good;

    return (
        <Col span={4}>
            <Card
                style={{
                    width: '200px',
                    height: '270px'
                }}
                cover={
                    <img
                        alt={'good' + goodId}
                        src={'./images/good.jpg'}
                        style={{
                            width: '200px',
                            height: '180px'
                        }}
                    />
                }
            >
                <div
                    style={{
                        fontSize: '12px',
                        height: '58px',
                        padding: '5px 10px'
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {goodName}
                    </div>
                    <div
                        style={{
                            padding: '5px 0'
                        }}
                    >
                        <Tag bordered={false} color="blue">
                            {remark}
                            {/* 测试一下多少个字符多少字符多 */}
                        </Tag>
                    </div>
                </div>
                <div
                    style={{
                        color: 'red',
                        fontSize: '18px',
                        padding: '0 10px',
                        borderTop: '1px solid #F0F0F0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    ￥{goodPrice}
                </div>
            </Card>
        </Col>
    );
};

export default MyCol;