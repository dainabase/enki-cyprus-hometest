export const formatPrice = (price: number, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatArea = (area: number) => {
  return `${formatNumber(area)} m²`;
};

export const formatDistance = (distance: number, unit = 'km') => {
  if (distance < 1 && unit === 'km') {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance} ${unit}`;
};

export const formatPercentage = (percentage: number) => {
  return `${percentage}%`;
};

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const getWhatsAppUrl = (phone: string, message: string) => {
  const formattedPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};