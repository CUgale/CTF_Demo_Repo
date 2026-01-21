import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Button, Dropdown, Space, Avatar, Select, Tooltip } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  CaretDownFilled,
  MoreOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/hooks';
import { authActions } from '../../pages/login/Login.reducer';
import { useProject } from '../../context/ProjectContext';
import { NAV_ITEMS, getActiveSection, getVisibleAndOverflowItems, ROUTE_MAP } from './Header.mockdata';
import styles from './Header.module.scss';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useAppSelector(state => state.auth.currentUser.data);
  const { selectedProject, setSelectedProject, projects } = useProject();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = useCallback(() => {
    try {
      dispatch(authActions.requestLogout());
      navigate('/login', { replace: true });
    } catch (error) {
    }
  }, [dispatch, navigate]);

  const handleMenuClick = useCallback((key: string) => {
    const route = ROUTE_MAP[key];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  const handleSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      try {
        navigate('/jobs');
        setSearchQuery('');
        setShowSearch(false);
      } catch (error) {
      }
    } else {
      setShowSearch(!showSearch);
    }
  }, [searchQuery, showSearch, navigate]);

  const handleProjectChange = useCallback((projectId: string) => {
    try {
      setSelectedProject(projectId);
    } catch (error) {
    }
  }, [setSelectedProject]);

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const activeSection = useMemo(() => getActiveSection(location.pathname), [location.pathname]);

  const { visible, overflow } = useMemo(
    () => getVisibleAndOverflowItems(windowWidth, NAV_ITEMS),
    [windowWidth]
  );

  const username = userData?.user?.username || 'A';
  const userInitial = username.charAt(0).toUpperCase();

  const profileMenu = useMemo(() => ({
    className: styles.profileDropdownMenu,
    items: [
      {
        key: 'user-info',
        label: (
          <div className="p-2">
            <div className="d-flex align-items-center gap-2 mb-3">
              <UserOutlined /> <strong>User:</strong> {userData?.user?.username || 'N/A'}
            </div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <MailOutlined /> <strong>Email:</strong> {userData?.user?.email || 'N/A'}
            </div>
            <div className="d-flex align-items-center gap-2 mb-0">
              <SafetyCertificateOutlined /> <strong>Roles:</strong> {userData?.user?.roles?.join(', ') || 'N/A'}
            </div>
          </div>
        ),
        disabled: true,
      },
    ],
  }), [userData]);

  const overflowMenuItems = useMemo(() => {
    return overflow.map(id => {
      const item = NAV_ITEMS.find(nav => nav.id === id);
      return {
        key: id,
        label: item?.label || id,
        onClick: () => handleMenuClick(id),
      };
    });
  }, [overflow, handleMenuClick]);

  const overflowMenu = useMemo(() => ({
    items: overflowMenuItems,
  }), [overflowMenuItems]);

  return (
    <AntHeader className={`${styles.header} d-flex align-items-center justify-content-between`}>
      <div className="d-flex align-items-center flex-wrap w-100 gap-3">
        {/* Logo Section */}
        <div className="d-flex align-items-center gap-3 flex-shrink-0" style={{ minWidth: '200px' }}>
          <img
            src={`${import.meta.env.BASE_URL}resources/images/product_logo.png`}
            alt="CTF Logo"
            className="object-fit-contain"
            style={{ width: '42px', height: '42px' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h2 className="mb-0 fw-semibold text-dark" style={{ letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
            Continuous Testing Framework
          </h2>
        </div>

        {/* Project Selector */}
        <div className="d-flex align-items-center flex-shrink-0 ms-3">
          <Select
            value={selectedProject?.id}
            onChange={handleProjectChange}
            className={styles.projectSelect}
            dropdownClassName={styles.projectDropdown}
            suffixIcon={<CaretDownFilled />}
            placeholder="Select dbt Project"
            notFoundContent={null}
            optionLabelProp="label"
            style={{ minWidth: '240px', maxWidth: '320px', width: '100%' }}
          >
            {projects.map((project) => (
              <Select.Option
                key={project.id}
                value={project.id}
                label={project.name}
              >
                <div className="d-flex align-items-center gap-2">
                  <CodeOutlined className="me-2"/>
                  <span className="text-truncate" style={{ fontFamily: 'monospace' }}>{project.name}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Navigation Menu */}
        <nav className="d-flex align-items-center flex-wrap flex-fill justify-content-center gap-2 px-3">
          {NAV_ITEMS.map((item) => {
            const isOverflow = overflow.includes(item.id);
            
            if (isOverflow) {
              return null;
            }

            return (
              <button
                key={item.id}
                className={`btn btn-link text-decoration-none text-uppercase ${activeSection === item.id ? 'text-primary fw-semibold' : 'text-secondary'}`}
                style={{ 
                  padding: '8px 16px',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  background: 'none'
                }}
                onClick={() => handleMenuClick(item.id)}
              >
                {item.label}
              </button>
            );
          })}
          {overflow.length > 0 && (
            <Dropdown menu={overflowMenu} trigger={['click']} placement="bottomRight">
              <button 
                className="btn btn-link text-secondary border-0"
                style={{ padding: '8px 12px' }}
                aria-label="More navigation options"
              >
                <MoreOutlined />
              </button>
            </Dropdown>
          )}
        </nav>

        {/* Right Section */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          {showSearch ? (
            <div className="d-flex align-items-center gap-2 bg-white border rounded px-3" style={{ minWidth: '280px', maxWidth: '400px', height: '36px' }}>
              <input
                type="text"
                className="border-0 outline-0 flex-fill"
                placeholder="Search tests, models, logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                autoFocus
                style={{ background: 'transparent', fontSize: '14px' }}
              />
              <button
                className="btn btn-link border-0 p-0 text-secondary"
                style={{ width: '18px', height: '18px', lineHeight: '1' }}
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                aria-label="Close search"
              >
                ×
              </button>
            </div>
          ) : (
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Search
            </Button>
          )}

          <Tooltip title="Notifications">
            <Button
              type="text"
              icon={<BellOutlined />}
              onClick={() => {
                // TODO: Implement notifications
              }}
              aria-label="Notifications"
            />
          </Tooltip>

          <Dropdown menu={profileMenu} trigger={['click']} placement="bottomRight">
            <Space className="d-flex align-items-center gap-1 px-2 rounded" style={{ cursor: 'pointer', height: '36px' }}>
              <Avatar style={{ backgroundColor: '#3b82f6' }}>{userInitial}</Avatar>
              <CaretDownFilled className="text-secondary" style={{ fontSize: '12px' }} />
            </Space>
          </Dropdown>

          <Button
            type="default"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
