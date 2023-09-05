import React, { useState, useEffect } from 'react';

import {
    Layout,
    Row,
    Spin,
} from 'antd';

import MyCol from '../../components/MyCol';
import dataProvider from '../../api';

const { Content } = Layout;

// 中间部分颜色
const mainBgColor = '#F7ECE4';
const OK = Number.parseInt(process.env.REACT_APP_OK);

const MyContent = ({ filter, changePageInfo }) => {
    // 中间关于商品部分的组件状态，一个对象类型，包含许多变量
    const [state, setState] = useState({
        isLoading: false,
        err: '',
        goods: []
    });

    // 生命周期钩子，根据条件获取商品
    useEffect(() => {
        // 发送请求之前，更新状态
        setState({
            ...state,
            isLoading: true
        });
        // 发送请求
        console.log('请求所带的参数为', filter);
        dataProvider.good.getGoods(filter).then(
            response => {
                const res = response.data;
                if (res.state && res.state === OK) {
                    // 请求成功，展示
                    console.log(res.data);
                    setState({
                        ...state,
                        isLoading: false,
                        goods: res.data.data
                    });
                    changePageInfo({
                        curPage: res.data.curPage,
                        pageSize: res.data.pageSize,
                        total: res.data.total
                    });
                } else {
                    // 请求未成功
                    console.log(res.message);
                    setState({
                        ...state,
                        err: res.message
                    });
                }
            }
        ).catch(
            err => {
                console.log(err);
                setState({
                    ...state,
                    err: err.message
                });
            }
        );
    }, [filter]);


    const { isLoading, err, goods } = state;

    return (
        <Content>
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
                            goods.length === 0 ?
                                <h2 style={{ color: 'gray' }}>暂时没有商品</h2> :
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
    );
};

export default MyContent;