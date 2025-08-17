import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../constant';
 
interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop' | 'wide';
}

export const useResponsive = (): UseResponsiveReturn => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop' | 'wide'>('desktop');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      
      if (width < parseInt(BREAKPOINTS.tablet)) {
        setScreenSize('mobile');
      } else if (width < parseInt(BREAKPOINTS.desktop)) {
        setScreenSize('tablet');
      } else if (width < parseInt(BREAKPOINTS.wide)) {
        setScreenSize('desktop');
      } else {
        setScreenSize('wide');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return {
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    isWide: screenSize === 'wide',
    screenSize
  };
};
