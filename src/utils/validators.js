export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateMatricNo = (matricNo) => {
  return typeof matricNo === 'string' && /^\d{9}$/.test(matricNo.trim());
};

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{11}$/;
  return re.test(String(phone).trim());
};
