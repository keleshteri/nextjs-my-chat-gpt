import { ApiError } from './error-handler';

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]) {
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });
  
  if (missingFields.length > 0) {
    throw new ApiError(`Missing required fields: ${missingFields.join(', ')}`, 400);
  }
  
  return true;
}

export function validateFieldType(data: Record<string, any>, field: string, type: string) {
  const value = data[field];
  
  if (value === undefined || value === null) {
    return true; // Skip validation if field is not provided
  }
  
  let isValid = false;
  
  switch (type) {
    case 'string':
      isValid = typeof value === 'string';
      break;
    case 'number':
      isValid = typeof value === 'number' && !isNaN(value);
      break;
    case 'boolean':
      isValid = typeof value === 'boolean';
      break;
    case 'array':
      isValid = Array.isArray(value);
      break;
    case 'object':
      isValid = typeof value === 'object' && !Array.isArray(value);
      break;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
  
  if (!isValid) {
    throw new ApiError(`Field '${field}' must be of type ${type}`, 400);
  }
  
  return true;
}

export function validateFieldLength(data: Record<string, any>, field: string, min: number, max: number) {
  const value = data[field];
  
  if (value === undefined || value === null) {
    return true; // Skip validation if field is not provided
  }
  
  if (typeof value !== 'string' && !Array.isArray(value)) {
    throw new ApiError(`Field '${field}' must be a string or array to check length`, 400);
  }
  
  const length = value.length;
  
  if (length < min) {
    throw new ApiError(`Field '${field}' must be at least ${min} characters long`, 400);
  }
  
  if (length > max) {
    throw new ApiError(`Field '${field}' must be at most ${max} characters long`, 400);
  }
  
  return true;
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new ApiError('Invalid email format', 400);
  }
  
  return true;
}

export function validateUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(uuid)) {
    throw new ApiError('Invalid UUID format', 400);
  }
  
  return true;
} 