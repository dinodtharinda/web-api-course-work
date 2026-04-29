const { Province, District, Vehicle, LocationPing } = require('@/models');

const listProvinces = async (req, res, next) => {
  try {
    const includeDistricts = String(req.query.includeDistricts || '').toLowerCase() === 'true';

    const provinces = await Province.findAll({
      order: [['name', 'ASC']],
      include: includeDistricts
        ? [
            {
              model: District,
              as: 'districts',
              attributes: ['id', 'name', 'code', 'provinceId', 'createdAt', 'updatedAt'],
              order: [['name', 'ASC']],
              required: false,
            },
          ]
        : [],
    });

    return res.status(200).json({
      success: true,
      message: 'Provinces retrieved',
      data: provinces,
    });
  } catch (err) {
    return next(err);
  }
};

const ingestLocationPing = async (req, res, next) => {
  try {
    const { registrationNo, latitude, longitude, recordedAt, sourceType } = req.body;

    if (!registrationNo || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'registrationNo, latitude and longitude are required',
      });
    }

    const vehicle = await Vehicle.findOne({
      where: { registrationNo: String(registrationNo).trim().toUpperCase() },
    });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    const locationPing = await LocationPing.create({
      vehicleId: vehicle.id,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      sourceType: sourceType ? String(sourceType).trim().toLowerCase() : 'device',
    });

    return res.status(201).json({
      success: true,
      message: 'Location ping ingested',
      data: locationPing,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listProvinces,
  ingestLocationPing,
};
