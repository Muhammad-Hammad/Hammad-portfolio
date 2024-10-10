import { useState, useEffect, useCallback } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const onMouseMove = useCallback(e => {
    setPosition({ x: e.clientX, y: e.clientY });
    const target = e.target;
    const isPointerNow = target.getAttribute('data-class') === 'cursor';
    setIsPointer(isPointerNow);
  }, []);

  const onMouseDown = useCallback(() => {
    setClicked(true);
  }, []);

  const onMouseUp = useCallback(() => {
    setClicked(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseDown, onMouseUp]);

  return (
    <>
      <div
        className={`custom-cursor ${clicked ? 'expand' : ''} ${
          isPointer ? 'pointer' : ''
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="cursor-dot"></div>
      </div>
    </>
  );
}
