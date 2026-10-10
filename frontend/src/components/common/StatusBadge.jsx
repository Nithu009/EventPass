import React from 'react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || '').toUpperCase();

  switch (normalized) {
    case 'CONFIRMED':
    case 'SUCCESS':
    case 'PUBLISHED':
    case 'AVAILABLE':
      return <span className="badge badge-success">{normalized}</span>;

    case 'PENDING_PAYMENT':
    case 'LOCKED':
    case 'PENDING':
    case 'DRAFT':
      return <span className="badge badge-warning">{normalized.replace('_', ' ')}</span>;

    case 'BOOKED':
    case 'CANCELLED':
    case 'FAILED':
    case 'EXPIRED':
      return <span className="badge badge-danger">{normalized}</span>;

    case 'USER':
    case 'ADMIN':
    case 'VIP':
    case 'PREMIUM':
    case 'STANDARD':
    default:
      return <span className="badge badge-info">{normalized}</span>;
  }
};
