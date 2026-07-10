import { Tooltip, TooltipProps } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';

interface Props extends Omit<TooltipProps, 'children'> {
  /**
   * Ограничение количества строк текста, после которого обрезается текст и появляется тултип.
   * @default 3
   */
  cellLineClamp: number;
}

/**
 * Тултип с отображением только после обрезки текста свойством line-clamp.
 *
 * @component
 * @param {Props} Свойства компонета.
 */
export default function ClampedTextTooltip({ title, cellLineClamp = 3, className }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const span = spanRef.current;

    if (!span) {
      return;
    }
    const container = span.parentElement;
    span.style.webkitLineClamp = cellLineClamp.toString();

    const checkClamping = () => {
      const currentStyle = getComputedStyle(span);
      const lineClamp = parseInt(currentStyle.getPropertyValue('-webkit-line-clamp'), 10);

      if (lineClamp > 0 && currentStyle.getPropertyValue('overflow') === 'hidden') {
        setIsClamped(span.scrollHeight > span.clientHeight);
      } else {
        setIsClamped(false);
      }
    };

    checkClamping();

    const observer = new ResizeObserver(checkClamping);
    if (container) {
      observer.observe(container);
    }

    window.addEventListener('resize', checkClamping);
    return () => window.removeEventListener('resize', checkClamping);
  }, [cellLineClamp]);

  return (
    <Tooltip title={isClamped ? title : ''}>
      <span
        className={className}
        ref={spanRef}
      >
        {title}
      </span>
    </Tooltip>
  );
}
