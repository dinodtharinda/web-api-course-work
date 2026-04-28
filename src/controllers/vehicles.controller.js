const { Vehicle, TrackingDevice, District, LocationPing } = require('@/models');

const listVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.findAll({
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code', 'provinceId', 'createdAt', 'updatedAt'],
          required: true,
        },
        {
          model: TrackingDevice,
          as: 'trackingDevice',
          attributes: ['id', 'deviceSerial', 'isActive', 'createdAt', 'updatedAt'],
          required: false,
        },
      ],
      order: [['registrationNo', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      message: 'Vehicles retrieved',
      data: vehicles,
    });
  } catch (err) {
    return next(err);
  }
};

const createVehicle = async (req, res, next) => {
  try {
    const { registrationNo, ownerName, districtId, deviceSerial } = req.body;

    const district = await District.findByPk(districtId);

    if (!district) {
      return res.status(422).json({
        success: false,
        message: 'Invalid districtId',
      });
    }

    const vehicle = await Vehicle.create({
      registrationNo,
      ownerName,
      districtId,
    });

    const trackingDevice = await TrackingDevice.create({
      vehicleId: vehicle.id,
      deviceSerial,
    });

    const createdVehicle = await Vehicle.findByPk(vehicle.id, {
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code', 'provinceId', 'createdAt', 'updatedAt'],
          required: true,
        },
        {
          model: TrackingDevice,
          as: 'trackingDevice',
          attributes: ['id', 'deviceSerial', 'isActive', 'createdAt', 'updatedAt'],
          required: false,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Vehicle created',
      data: {
        ...createdVehicle.toJSON(),
        trackingDevice,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const listVehiclePings = async (req, res, next) => {
  try {
    const { registrationNo } = req.params;

    const vehicle = await Vehicle.findOne({
      where: { registrationNo },
      attributes: ['id', 'registrationNo', 'ownerName', 'districtId', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    const locationPings = await LocationPing.findAll({
      where: { vehicleId: vehicle.id },
      attributes: ['id', 'latitude', 'longitude', 'recordedAt', 'sourceType', 'createdAt', 'updatedAt'],
      order: [
        ['recordedAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Vehicle pings retrieved',
      data: locationPings.map((ping) => ({
        id: ping.id,
        latitude: ping.latitude,
        longitude: ping.longitude,
        timestamp: ping.recordedAt,
        sourceType: ping.sourceType,
        createdAt: ping.createdAt,
        updatedAt: ping.updatedAt,
      })),
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createVehicle,
  listVehicles,
  listVehiclePings,
};