// Application Constants

export const INSURANCE_CATEGORIES = {
  TRAVEL: 'passenger_accident',
  AUTO: 'vehicle_liability',
  PROPERTY: 'property_insurance',
  HEALTH: 'employer_liability',
  LIFE: 'hazardous_liability',
};

export const ORDER_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PRICED: 'priced',
  APPROVED: 'approved',
  PAID: 'paid',
  REJECTED: 'rejected',
  CANCELED: 'canceled',
};

export const ORDER_STATUS_COLORS = {
  draft: '#6c757d',
  pending: '#ffc107',
  priced: '#17a2b8',
  approved: '#28a745',
  paid: '#20c997',
  rejected: '#dc3545',
  canceled: '#6c757d',
};

export const ORDER_STATUS_TEXTS = {
  draft: 'Qaralama',
  pending: 'Gözləyir',
  priced: 'Qiymətləndirilib',
  approved: 'Təsdiqlənib',
  paid: 'Ödənilib',
  rejected: 'Rədd edilib',
  canceled: 'Ləğv edilib',
};

export const CAROUSEL_AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

export const DATE_FORMAT_OPTIONS = {
  day: 'numeric',
  month: 'long',
};

export const CURRENCY_FORMAT_OPTIONS = {
  style: 'currency',
  currency: 'AZN',
  locale: 'az-AZ',
};

