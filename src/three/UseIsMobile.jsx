import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 1000; // bạn có thể chỉnh breakpoint phù hợp

function UseIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Thực hiện ngay để cập nhật status nếu có thay đổi khi mount
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return isMobile;
}

export default UseIsMobile;
