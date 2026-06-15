import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ width = '100%', height = '20px', borderRadius = '4px', count = 3 }) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width,
            height,
            borderRadius,
            background: '#e5e7eb',
            marginBottom: count === 1 ? '0' : '12px',
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
