export const formatDate = (isoString) => {
  if (!isoString) return 'Not Available';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Action Required';
    case 'PENDING':
      return 'Pending Review';
    case 'IN_PROGRESS':
      return 'In Progress';
    default:
      return status;
  }
};
