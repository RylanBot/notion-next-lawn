import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, container }) => {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (!container) {
      setTarget(document.body);
      return;
    }

    const el = typeof container === 'function' ? container() : container;
    setTarget(el);
  }, [container]);

  if (!target) return null;

  return createPortal(children, target);
};

export default Portal;
