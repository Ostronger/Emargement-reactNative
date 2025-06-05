export const validateEmail = (email: string): boolean => {
  const regex = /@/;
  return regex.test(email);
};