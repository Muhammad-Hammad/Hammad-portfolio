import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    const updateCursorPosition = e => {
      setCursorPosition({ x: e.pageX - 10, y: e.pageY - 10 }); // Center the cursor
    };

    const handleClick = () => {
      setIsExpanding(true);
      setTimeout(() => {
        setIsExpanding(false); // Reset the expanding effect after 500ms
      }, 500);
    };

    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${isExpanding ? 'expand' : ''}`}
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
      }}
    />
  );
};

export default CustomCursor;
