export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateMatricNo = (matricNo) => {
  // Format check e.g. FCP/CSC/19/2045 or CSC/2019/1234 or ADMIN/001
  return typeof matricNo === 'string' && matricNo.trim().length >= 4;
};

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{11}$/;
  return re.test(String(phone).trim());
};
