const { Vehicle, TrackingDevice, District } = require('@/models');

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

module.exports = {
  createVehicle,
  listVehicles,
};