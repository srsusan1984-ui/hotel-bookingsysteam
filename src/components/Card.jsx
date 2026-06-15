import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, hoverable = true, style = {}, onClick }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4 } : {}}
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        ...style,
      }}
      onHoverStart={(hoverable && !onClick) ? undefined : undefined}
    >
      {children}
    </motion.div>
  );
};

export default Card;
