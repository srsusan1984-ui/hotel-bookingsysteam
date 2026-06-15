import React from 'react';

const Badge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return { background: '#dbeafe', color: '#0369a1', text: 'Confirmed' };
      case 'pending':
        return { background: '#fef3c7', color: '#92400e', text: 'Pending' };
      case 'cancelled':
        return { background: '#fee2e2', color: '#991b1b', text: 'Cancelled' };
      case 'completed':
        return { background: '#dcfce7', color: '#15803d', text: 'Completed' };
      default:
        return { background: '#f3f4f6', color: '#6b7280', text: status };
    }
  };

  const style = getStatusStyle();

  return (
    <span style={{
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      background: style.background,
      color: style.color,
      textTransform: 'capitalize',
    }}>
      {style.text}
    </span>
  );
};

export default Badge;
