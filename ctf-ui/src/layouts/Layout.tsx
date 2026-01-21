import React, { useState, ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { SearchOutlined, BellOutlined } from '@ant-design/icons';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatInterface from '../components/ChatInterface/ChatInterface';
import { useChatContext } from '../context/ChatContext';
import styles from './Layout.module.scss';

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { chatContext, onGenerateTests } = useChatContext();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs: { label: string; path: string }[] = [
      { label: 'Home', path: '/dashboard' },
    ];

    if (path === '/dashboard') {
      breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });
    } else if (path === '/create-job') {
      breadcrumbs.push({ label: 'Create Job', path: '/create-job' });
    } else if (path === '/jobs') {
      breadcrumbs.push({ label: 'Jobs', path: '/jobs' });
    } else if (path.startsWith('/jobs/') && path.includes('test-review')) {
      breadcrumbs.push({ label: 'Jobs', path: '/jobs' });
      const jobId = segments[1];
      breadcrumbs.push({ label: jobId, path: `/jobs/${jobId}` });
      breadcrumbs.push({ label: 'Test Review', path: path });
    } else if (path.startsWith('/jobs/')) {
      breadcrumbs.push({ label: 'Jobs', path: '/jobs' });
      const jobId = segments[1];
      breadcrumbs.push({ label: `Job Details`, path: path });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className={styles.layoutWrapper}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      
      <main className={`${styles.mainArea} ${collapsed ? styles.collapsed : ''}`}>
        <header className={styles.topBar}>
          <nav className={styles.breadcrumbs}>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <span className={styles.separator}>/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className={styles.current}>{crumb.label}</span>
                ) : (
                  <Link to={crumb.path}>{crumb.label}</Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className={styles.topBarActions}>
            <div className={styles.searchBar}>
              <SearchOutlined className={styles.searchIcon} />
              <input type="text" placeholder="Search tests, models, jobs..." />
            </div>
            <button className={styles.notificationBtn}>
              <BellOutlined />
              <span className={styles.notificationDot} />
            </button>
          </div>
        </header>

        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
      
      {/* Floating Chat Assistant - Available for entire project */}
      <ChatInterface 
        context={chatContext} 
        onGenerateTests={onGenerateTests}
      />
    </div>
  );
};

export default SidebarLayout;

