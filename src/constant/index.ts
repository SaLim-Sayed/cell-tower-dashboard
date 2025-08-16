  
  export const COLORS = {
    primary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    neutral: '#6b7280',
    background: '#f8fafc',
    surface: '#ffffff',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      inverse: '#ffffff'
    },
    chart: {
      cairo: '#3b82f6',
      alexandria: '#10b981',
      hurghada: '#f59e0b',
      luxor: '#ef4444',
      active: '#10b981',
      offline: '#ef4444'
    }
  } as const;
  
  export const BREAKPOINTS = {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  } as const;