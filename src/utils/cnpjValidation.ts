
/**
 * Validates if a CNPJ is correctly formatted according to Brazilian rules
 * @param cnpj CNPJ string (with or without formatting)
 * @returns boolean indicating if the CNPJ is valid
 */
export const validateCNPJ = (cnpj: string): boolean => {
  // Remove any non-numeric characters
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Check if it has the correct length
  if (cnpj.length !== 14) return false;

  // Check for obvious invalid patterns
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Calculate first check digit
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  let digit = 11 - (sum % 11);
  const firstCheckDigit = digit >= 10 ? 0 : digit;

  // Calculate second check digit
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  digit = 11 - (sum % 11);
  const secondCheckDigit = digit >= 10 ? 0 : digit;

  // Compare calculated check digits with the actual ones
  return (
    parseInt(cnpj.charAt(12)) === firstCheckDigit &&
    parseInt(cnpj.charAt(13)) === secondCheckDigit
  );
};

/**
 * Formats a CNPJ string with the standard Brazilian notation (XX.XXX.XXX/XXXX-XX)
 * @param cnpj CNPJ string without formatting
 * @returns formatted CNPJ string
 */
export const formatCNPJ = (cnpj: string): string => {
  // Remove any non-numeric characters
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  // Limit to 14 digits
  cnpj = cnpj.slice(0, 14);
  
  // If empty or too short, return as is
  if (cnpj.length < 3) return cnpj;
  
  // Apply formatting based on how many digits we have
  if (cnpj.length <= 2) {
    return cnpj;
  } else if (cnpj.length <= 5) {
    return cnpj.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
  } else if (cnpj.length <= 8) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (cnpj.length <= 12) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
  } else {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
  }
};

/**
 * Removes all formatting from a CNPJ string, keeping only the digits
 * @param cnpj The formatted CNPJ string
 * @returns The CNPJ with only digits
 */
export const cleanCNPJ = (cnpj: string): string => {
  return cnpj.replace(/[^\d]/g, '');
};
