function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!value || typeof value !== 'object') return value;

  for (const key of Object.keys(value)) {
    if (key.includes('$') || key.includes('.')) {
      delete value[key];
      continue;
    }
    value[key] = sanitizeValue(value[key]);
  }
  return value;
}

export function sanitizeRequest(req, _res, next) {
  sanitizeValue(req.body);
  sanitizeValue(req.params);
  sanitizeValue(req.query);
  next();
}
