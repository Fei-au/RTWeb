
export function formatNumber(value) {
    // Convert the input value to a string and split it at the decimal point
    const parts = value.toString().split(".");
    // Format the integer part with commas as thousands separators
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // If there's a fractional part, round it to two decimal places; otherwise, add ".00"
    const decimalPart = parts[1] ? parseFloat("0." + parts[1]).toFixed(2).substring(2) : "00";
    // Combine the integer and decimal parts
    return `${integerPart}.${decimalPart}`;
  }