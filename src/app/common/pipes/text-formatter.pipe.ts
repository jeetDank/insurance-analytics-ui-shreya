import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFormatter'
})
export class TextFormatterPipe implements PipeTransform {

  transform(value: any, maxLength?: number, decimalPlaces: number = 4): string {
    // Handle null or undefined
    if (value === null || value === undefined) {
      return '';
    }

    // Convert to string
    const stringValue = String(value);

    // Check if it's a number (integer or decimal)
    const numericValue = parseFloat(stringValue);
    
    if (!isNaN(numericValue) && stringValue.includes('.')) {
      // It's a decimal number - format with specified decimal places
      const formatted = numericValue.toFixed(decimalPlaces);
      
      // If maxLength is provided, check if formatted string exceeds it
      if (maxLength && formatted.length > maxLength) {
        return formatted.substring(0, maxLength) + '';
      }
      
      return formatted;
    }

    // It's regular text - apply truncation if maxLength is provided
    if (maxLength && stringValue.length > maxLength) {
      return stringValue.substring(0, maxLength) + '';
    }

    return stringValue;
  }

}
