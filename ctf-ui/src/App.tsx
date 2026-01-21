import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ProjectProvider } from './context/ProjectContext';
import { DashboardDesignProvider } from './context/DashboardDesignContext';
import { ChatContextProvider } from './context/ChatContext';
import { antdThemeConfig } from './config/antdThemeConfig';
import AppRoutes from './routes/AppRoutes';
import './index.scss';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider theme={antdThemeConfig}>
        <DashboardDesignProvider>
          <ProjectProvider>
            <ChatContextProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ChatContextProvider>
          </ProjectProvider>
        </DashboardDesignProvider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
