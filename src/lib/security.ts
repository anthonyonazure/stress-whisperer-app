// Text sanitization utilities for security
export const sanitizeText = (text: string): string => {
  // Remove HTML tags and escape special characters
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, (char) => { // Escape HTML entities
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return entities[char] || char;
    })
    .trim();
};

export const validateTextLength = (text: string, maxLength: number = 200): boolean => {
  const sanitized = sanitizeText(text);
  return sanitized.length > 0 && sanitized.length <= maxLength;
};

export const sanitizeAndValidateText = (text: string, maxLength: number = 200): { 
  isValid: boolean; 
  sanitized: string; 
  error?: string; 
} => {
  const sanitized = sanitizeText(text);
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized, error: 'Text cannot be empty' };
  }
  
  if (sanitized.length > maxLength) {
    return { 
      isValid: false, 
      sanitized, 
      error: `Text must be ${maxLength} characters or less` 
    };
  }
  
  return { isValid: true, sanitized };
};

// Rate limiting helper
export const createRateLimiter = (maxCalls: number, windowMs: number) => {
  const calls: number[] = [];
  
  return () => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Remove old calls outside the window
    while (calls.length > 0 && calls[0] < windowStart) {
      calls.shift();
    }
    
    if (calls.length >= maxCalls) {
      return false; // Rate limit exceeded
    }
    
    calls.push(now);
    return true; // Call allowed
  };
};