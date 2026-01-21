import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Popover, Tooltip } from 'antd';
import {
  DashboardOutlined,
  ScheduleOutlined,
  ExperimentOutlined,
  DatabaseOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BranchesOutlined,
  CheckOutlined,
  CaretDownOutlined,
  FolderOutlined,
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/hooks';
import { authActions } from '../../pages/login/Login.reducer';
import { useProject } from '../../context/ProjectContext';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed: controlledCollapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const { selectedProject, setSelectedProject, projects } = useProject();
  const userData = useAppSelector(state => state.auth.currentUser.data);
  const [projectDropdownVisible, setProjectDropdownVisible] = useState(false);
  
  // Track which submenu is expanded (only one can be open at a time)
  // Jobs submenu is expanded by default
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>('jobs');

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    if (onCollapse) {
      onCollapse(newCollapsed);
    } else {
      setInternalCollapsed(newCollapsed);
    }
  };

  const handleLogout = () => {
    dispatch(authActions.requestLogout());
    navigate('/login', { replace: true });
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setProjectDropdownVisible(false);
  };

  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/jobs' || path === '/create-job' || path.startsWith('/jobs/')) return 'jobs';
    if (path === '/tests' || path.includes('test-review') || path.includes('test-generation')) return 'tests';
    if (path === '/data' || path.includes('/data/')) return 'data';
    if (path.startsWith('/admin/users')) return 'users';
    if (path.startsWith('/admin/settings')) return 'settings';
    if (path.startsWith('/admin/security')) return 'security';
    return 'dashboard';
  };

  const isJobsSubmenuActive = () => {
    const path = location.pathname;
    return path === '/tests' || path.includes('test-review') || path.includes('test-generation') || 
           path === '/data' || path.includes('/data/');
  };

  const activeSection = getActiveSection();
  const username = userData?.user?.username || 'User';
  const userInitial = username.charAt(0).toUpperCase();

  // Auto-expand Jobs submenu when a submenu item becomes active
  useEffect(() => {
    if (isJobsSubmenuActive()) {
      setExpandedSubmenu('jobs');
    }
  }, [location.pathname]);

  // Main navigation items
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <DashboardOutlined />, 
      path: '/dashboard',
      description: 'Overview & Analytics'
    },
    { 
      id: 'jobs', 
      label: 'Jobs', 
      icon: <ScheduleOutlined />, 
      path: '/jobs', 
      badge: 3,
      description: 'Job executions',
      hasSubmenu: true,
      submenu: [
        {
          id: 'tests',
          label: 'Tests',
          icon: <ExperimentOutlined />,
          path: '/tests',
          description: 'Test management',
          disabled: true
        },
        {
          id: 'data',
          label: 'Data',
          icon: <DatabaseOutlined />,
          path: '/data',
          description: 'Data & Models',
          disabled: true
        }
      ]
    },
  ];

  // Admin navigation items
  const adminNavItems = [
    { 
      id: 'users', 
      label: 'Users', 
      icon: <TeamOutlined />, 
      path: '/admin/users',
      description: 'User management'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <SettingOutlined />, 
      path: '/admin/settings',
      description: 'System settings'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: <SafetyCertificateOutlined />, 
      path: '/admin/security',
      description: 'Access control'
    },
  ];

  const projectDropdownContent = (
    <>
      <div className={styles.projectDropdownHeader}>
        <span className={styles.dropdownTitle}>Select Project</span>
      </div>
      <div className={styles.projectDropdownList}>
        {projects.map((project) => (
          <div
            key={project.id}
            className={`${styles.projectDropdownItem} ${selectedProject?.id === project.id ? styles.activeProject : ''}`}
            onClick={() => handleProjectSelect(project.id)}
          >
            <div className={styles.projectDropdownIcon}>
              <AppstoreOutlined />
            </div>
            <div className={styles.projectDropdownDetails}>
              <div className={styles.projectDropdownName}>{project.name}</div>
              <div className={styles.projectDropdownBranch}>
                <BranchesOutlined />
                {project.branch || 'main'}
              </div>
            </div>
            {selectedProject?.id === project.id && (
              <CheckOutlined className={styles.checkIcon} />
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <img
          src={`${import.meta.env.BASE_URL}resources/images/product_logo.png`}
          alt="CTF Logo"
          className={styles.logoImage}
        />
        <span className={styles.logoText}>CTF</span>
      </div>

      {/* Project Selector */}
      <div className={styles.projectSelectorWrapper}>
        <div className={styles.projectLabel}>
          <FolderOutlined className={styles.labelIcon} />
          <span>Project</span>
        </div>
        <Popover
          content={projectDropdownContent}
          trigger="click"
          placement="rightTop"
          open={projectDropdownVisible && !collapsed}
          onOpenChange={(visible) => setProjectDropdownVisible(visible)}
          overlayClassName={styles.projectDropdownOverlay}
        >
          <div 
            className={`${styles.projectSelector} ${projectDropdownVisible ? styles.projectSelectorOpen : ''}`} 
            onClick={() => !collapsed && setProjectDropdownVisible(!projectDropdownVisible)}
          >
            <div className={styles.projectSelectorContent}>
              <div className={styles.projectIcon}>
                <AppstoreOutlined />
              </div>
              <div className={styles.projectDetails}>
                <div className={styles.projectName}>{selectedProject?.name || 'Select Project'}</div>
                <div className={styles.projectBranch}>
                  <BranchesOutlined className={styles.branchIcon} />
                  {selectedProject?.branch || 'main'}
                </div>
              </div>
              <CaretDownOutlined className={styles.projectArrow} />
            </div>
          </div>
        </Popover>
      </div>

      {/* Navigation Section */}
      <nav className={styles.navSection}>
        <div className={styles.sectionTitle}>Menu</div>
        {navItems.map((item) => (
          <React.Fragment key={item.id}>
            <Tooltip
              title={collapsed ? item.label : ''}
              placement="right"
            >
              <div
                className={`${styles.navItem} ${activeSection === item.id || (item.hasSubmenu && isJobsSubmenuActive()) ? styles.active : ''}`}
                onClick={() => {
                  // Always navigate to the path when clicking the menu item
                  handleNavClick(item.path);
                }}
              >
                <span className={styles.navItemIcon}>{item.icon}</span>
                <span className={styles.navItemLabel}>{item.label}</span>
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
                {item.hasSubmenu && !collapsed && (
                  <CaretDownOutlined 
                    className={`${styles.submenuArrow} ${expandedSubmenu === item.id ? styles.submenuArrowExpanded : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle submenu when clicking the arrow
                      if (expandedSubmenu === item.id) {
                        setExpandedSubmenu(null);
                      } else {
                        setExpandedSubmenu(item.id);
                      }
                    }}
                  />
                )}
              </div>
            </Tooltip>
            {item.hasSubmenu && !collapsed && expandedSubmenu === item.id && (
              <div className={styles.submenu}>
                {item.submenu?.map((subItem) => (
                  <Tooltip
                    key={subItem.id}
                    title={collapsed ? subItem.label : subItem.disabled ? 'Coming soon' : subItem.label}
                    placement="right"
                  >
                    <div
                      className={`${styles.submenuItem} ${activeSection === subItem.id ? styles.active : ''} ${subItem.disabled ? styles.disabled : ''}`}
                      onClick={() => {
                        if (!subItem.disabled) {
                          handleNavClick(subItem.path);
                        }
                      }}
                    >
                      <span className={styles.submenuItemIcon}>{subItem.icon}</span>
                      <span className={styles.submenuItemLabel}>{subItem.label}</span>
                    </div>
                  </Tooltip>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

        <div className={styles.sectionTitle}>Admin</div>
        {adminNavItems.map((item) => (
          <Tooltip
            key={item.id}
            title={collapsed ? item.label : ''}
            placement="right"
          >
            <div
              className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <span className={styles.navItemIcon}>{item.icon}</span>
              <span className={styles.navItemLabel}>{item.label}</span>
            </div>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        {/* User Info */}
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>{userInitial}</div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{username}</div>
            <div className={styles.userRole}>Administrator</div>
          </div>
          <Tooltip title="Logout" placement="right">
            <button className={styles.logoutButton} onClick={handleLogout}>
              <LogoutOutlined />
            </button>
          </Tooltip>
        </div>

        {/* Collapse Button */}
        <button className={styles.collapseButton} onClick={handleCollapse}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

