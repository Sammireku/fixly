/**
 * Fixly Ghana Currency & Exchange Rate Utility
 * Provides standard price formatting in GHS ('GHS 0.00') and live USD to GHS conversion.
 */

// Default FX Rate: 1 USD = 15.50 GHS (Ghana Cedi)
export const USD_TO_GHS_RATE = 15.50;

/**
 * Global formatCurrency helper
 * Formats numeric values as 'GHS 0.00' (e.g., 180 -> 'GHS 180.00', 1430 -> 'GHS 1,430.00')
 */
export function formatCurrency(amount: number | undefined | null, currencyCode: string = 'GHS'): string {
  const numericVal = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  
  // Format formatted number string with commas and 2 decimals
  const formattedNumber = numericVal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (currencyCode === 'GHS' || currencyCode === 'GH₵') {
    return `GHS ${formattedNumber}`;
  }

  return `${currencyCode} ${formattedNumber}`;
}

/**
 * Converts USD amount to GHS equivalent
 */
export function convertUsdToGhs(usdAmount: number): number {
  return usdAmount * USD_TO_GHS_RATE;
}

/**
 * Converts GHS amount to USD equivalent
 */
export function convertGhsToUsd(ghsAmount: number): number {
  return ghsAmount / USD_TO_GHS_RATE;
}
