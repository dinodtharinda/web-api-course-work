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

const getLatestLocation = async (req, res, next) => {
  try {
    const { registrationNo } = req.params;

    if (!registrationNo) {
      return res.status(400).json({
        success: false,
        message: 'registrationNo is required',
      });
    }

    const vehicle = await Vehicle.findOne({
      where: { registrationNo: String(registrationNo).trim() },
      attributes: ['id', 'registrationNo'],
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    const latestPing = await LocationPing.findOne({
      where: { vehicleId: vehicle.id },
      attributes: ['id', 'latitude', 'longitude', 'recordedAt', 'sourceType', 'createdAt', 'updatedAt'],
      order: [
        ['recordedAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    if (!latestPing) {
      return res.status(404).json({
        success: false,
        message: 'No location pings for this vehicle',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Latest location retrieved',
      data: {
        id: latestPing.id,
        vehicleId: vehicle.id,
        registrationNo: vehicle.registrationNo,
        latitude: latestPing.latitude,
        longitude: latestPing.longitude,
        recordedAt: latestPing.recordedAt,
        sourceType: latestPing.sourceType,
        createdAt: latestPing.createdAt,
        updatedAt: latestPing.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
};
module.exports = {
  listProvinces,
  ingestLocationPing,
};
