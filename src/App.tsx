import React from 'react';
import { ConfigProvider } from 'antd';

import './assets/global.css';
import { useRoutes } from 'react-router-dom';
import routers from './routes';

const themeColor = process.env.REACT_APP_MAIN_COLOR;

const App = () => {
  const elements = useRoutes(routers);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: themeColor } }}>
      {elements}
    </ConfigProvider>
  );
};

export default App;
