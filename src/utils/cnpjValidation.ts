
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
  
  // Ensure it has the correct length
  if (cnpj.length !== 14) return cnpj;
  
  // Apply formatting
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};
