import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{
        fontSize: '64px',
        marginBottom: '16px',
        opacity: 0.5,
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '8px',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '24px',
        maxWidth: '400px',
      }}>
        {description}
      </p>
      {action && action}
    </motion.div>
  );
};

export default EmptyState;
