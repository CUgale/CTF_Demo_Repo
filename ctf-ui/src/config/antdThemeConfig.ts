import { ThemeConfig } from 'antd';

/**
 * Ant Design Theme Configuration
 * Centralized theme config for uniform component styling across the application
 */
export const antdThemeConfig: ThemeConfig = {
  token: {
    // Primary Colors
    colorPrimary: '#10b981', // accent-color (green)
    colorSuccess: '#10b981',
    colorInfo: '#3b82f6', // accent-secondary (blue)
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    
    // Border & Background
    colorBorder: '#e5e7eb',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f8fafc',
    
    // Text Colors
    colorText: '#111827', // text-primary
    colorTextSecondary: '#6b7280', // text-secondary
    colorTextTertiary: '#9ca3af', // text-muted
    
    // Border Radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    
    // Font Sizes
    fontSize: 14, // base body text
    fontSizeLG: 15,
    fontSizeSM: 13,
    fontSizeXL: 18,
    
    // Font Weights
    fontWeightStrong: 600,
    
    // Line Heights
    lineHeight: 1.5,
    
    // Control Heights
    controlHeight: 38,
    controlHeightLG: 40,
    controlHeightSM: 32,
    
    // Padding
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Margin
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
  },
  components: {
    // Button Component Styles
    Button: {
      borderRadius: 6,
      fontWeight: 500,
      controlHeight: 36,
      paddingInline: 20,
      primaryColor: '#ffffff',
      primaryShadow: 'none',
    },
    
    // Input Component Styles
    Input: {
      borderRadius: 6,
      controlHeight: 38,
      paddingInline: 12,
      activeBorderColor: '#10b981',
      hoverBorderColor: '#10b981',
      activeShadow: '0 0 0 2px rgba(16, 185, 129, 0.1)',
    },
    
    // Select Component Styles
    Select: {
      borderRadius: 6,
      controlHeight: 40,
     
      optionSelectedBg: 'rgba(16, 185, 129, 0.1)',
      optionActiveBg: 'rgba(16, 185, 129, 0.05)',
    },
    
    // Form Component Styles
    Form: {
      labelFontSize: 13,
      labelColor: '#111827',
      labelHeight: 32,
      itemMarginBottom: 20,
      verticalLabelPadding: '0 0 8px',
      labelRequiredMarkColor: '#ef4444',
    },
    
    // Card Component Styles
    Card: {
      borderRadius: 8,
      paddingLG: 16,
      headerBg: '#ffffff',
      actionsBg: '#f8fafc',
    },
    
    // Typography Component Styles
    Typography: {
      titleMarginBottom: 8,
      titleMarginTop: 0,
    },
  },
};

