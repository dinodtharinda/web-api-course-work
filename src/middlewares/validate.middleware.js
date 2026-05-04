const sendValidationError = (res, errors) =>
  res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors,
  });

const validateRegistrationNoParam = (req, res, next) => {
  const registrationNo = String(req.params.registrationNo || '').trim().toUpperCase();

  if (!registrationNo) {
    return sendValidationError(res, {
      registrationNo: 'registrationNo is required',
    });
  }

  req.params.registrationNo = registrationNo;
  return next();
};

const validateTrackingPing = (req, res, next) => {
  const errors = {};

  const registrationNo = String(req.body.registrationNo || '').trim().toUpperCase();
  const latitude = Number(req.body.latitude);
  const longitude = Number(req.body.longitude);
  const sourceType = req.body.sourceType ? String(req.body.sourceType).trim().toLowerCase() : 'device';
  const recordedAt = req.body.recordedAt ? new Date(req.body.recordedAt) : new Date();

  if (!registrationNo) {
    errors.registrationNo = 'registrationNo is required';
  }

  if (!Number.isFinite(latitude)) {
    errors.latitude = 'latitude must be a valid number';
  }

  if (!Number.isFinite(longitude)) {
    errors.longitude = 'longitude must be a valid number';
  }

  if (req.body.recordedAt && Number.isNaN(recordedAt.getTime())) {
    errors.recordedAt = 'recordedAt must be a valid date-time value';
  }

  if (Object.keys(errors).length > 0) {
    return sendValidationError(res, errors);
  }

  req.body.registrationNo = registrationNo;
  req.body.latitude = latitude;
  req.body.longitude = longitude;
  req.body.sourceType = sourceType;
  req.body.recordedAt = recordedAt;

  return next();
};

const validateDateRangeQuery = (options = {}) => (req, res, next) => {
  const { required = false } = options;
  const errors = {};
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;

  if (required && (!req.query.from || !req.query.to)) {
    errors.from = 'from is required';
    errors.to = 'to is required';
  }

  if ((req.query.from && !req.query.to) || (!req.query.from && req.query.to)) {
    errors.from = 'from and to are required together';
    errors.to = 'from and to are required together';
  }

  if (req.query.from && Number.isNaN(from.getTime())) {
    errors.from = 'from must be a valid date-time value';
  }

  if (req.query.to && Number.isNaN(to.getTime())) {
    errors.to = 'to must be a valid date-time value';
  }

  if (from && to && !Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from > to) {
    errors.from = 'from must be earlier than or equal to to';
    errors.to = 'from must be earlier than or equal to to';
  }

  if (Object.keys(errors).length > 0) {
    return sendValidationError(res, errors);
  }

  if (from) {
    req.query.from = from;
  }

  if (to) {
    req.query.to = to;
  }

  return next();
};

const validateProvinceDistrictFilterQuery = (req, res, next) => {
  const errors = {};
  const provinceId = req.query.provinceId !== undefined ? Number.parseInt(req.query.provinceId, 10) : null;
  const districtId = req.query.districtId !== undefined ? Number.parseInt(req.query.districtId, 10) : null;

  if (provinceId === null && districtId === null) {
    errors.provinceId = 'provinceId or districtId is required';
    errors.districtId = 'provinceId or districtId is required';
  }

  if (provinceId !== null && (!Number.isInteger(provinceId) || provinceId <= 0)) {
    errors.provinceId = 'provinceId must be a positive integer';
  }

  if (districtId !== null && (!Number.isInteger(districtId) || districtId <= 0)) {
    errors.districtId = 'districtId must be a positive integer';
  }

  if (Object.keys(errors).length > 0) {
    return sendValidationError(res, errors);
  }

  if (provinceId !== null) {
    req.query.provinceId = provinceId;
  }

  if (districtId !== null) {
    req.query.districtId = districtId;
  }

  return next();
};

const validateStationIdParam = (req, res, next) => {
  const stationId = Number.parseInt(req.params.stationId, 10);

  if (!Number.isInteger(stationId) || stationId <= 0) {
    return sendValidationError(res, {
      stationId: 'stationId must be a positive integer',
    });
  }

  req.params.stationId = stationId;
  return next();
};

const validateIdParam = (paramName) => (req, res, next) => {
  const id = Number.parseInt(req.params[paramName], 10);

  if (!Number.isInteger(id) || id <= 0) {
    return sendValidationError(res, {
      [paramName]: `${paramName} must be a positive integer`,
    });
  }

  req.params[paramName] = id;
  return next();
};

const validateDeviceSerialParam = (req, res, next) => {
  const deviceSerial = String(req.params.deviceSerial || '').trim();

  if (!deviceSerial) {
    return sendValidationError(res, {
      deviceSerial: 'deviceSerial is required',
    });
  }

  req.params.deviceSerial = deviceSerial;
  return next();
};

module.exports = {
  validateIdParam,
  validateDeviceSerialParam,
  validateRegistrationNoParam,
  validateTrackingPing,
  validateDateRangeQuery,
  validateProvinceDistrictFilterQuery,
  validateStationIdParam,
};