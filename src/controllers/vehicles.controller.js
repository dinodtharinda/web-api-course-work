const { Op } = require('sequelize');
const { Vehicle, TrackingDevice, District, LocationPing } = require('@/models');
const { parseListQuery } = require('@/utils/list-query.util');

const listVehicles = async (req, res, next) => {
  try {
    const { page, pageSize, limit, offset, sortBy, sortOrder, search } = parseListQuery(req.query, {
      defaultSortBy: 'registrationNo',
      defaultSortOrder: 'ASC',
      allowedSortBy: ['registrationNo', 'ownerName', 'isActive', 'createdAt', 'updatedAt'],
    });

    const where = search
      ? {
          [Op.or]: [
            { registrationNo: { [Op.like]: `%${search}%` } },
            { ownerName: { [Op.like]: `%${search}%` } },
          ],
        }
      : undefined;

    const { rows: vehicles, count: total } = await Vehicle.findAndCountAll({
      where,
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
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: 'Vehicles retrieved',
      data: vehicles,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
        sortBy,
        sortOrder,
        search: search || null,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const vehicleInclude = [
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
];

const findVehicleByRegistration = (registrationNo) =>
  Vehicle.findOne({ where: { registrationNo }, include: vehicleInclude });

const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await findVehicleByRegistration(req.params.registrationNo);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    return res.status(200).json({ success: true, message: 'Vehicle retrieved', data: vehicle });
  } catch (err) {
    return next(err);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { registrationNo: req.params.registrationNo } });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const { ownerName, districtId, isActive } = req.body;
    const updates = {};

    if (ownerName !== undefined) {
      if (!String(ownerName).trim()) {
        return res.status(422).json({ success: false, message: 'ownerName must not be empty' });
      }
      updates.ownerName = String(ownerName).trim();
    }

    if (districtId !== undefined) {
      const district = await District.findByPk(districtId);
      if (!district) {
        return res.status(422).json({ success: false, message: 'Invalid districtId' });
      }
      updates.districtId = district.id;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return res.status(422).json({ success: false, message: 'isActive must be a boolean' });
      }
      updates.isActive = isActive;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one of ownerName, districtId, isActive',
      });
    }

    await vehicle.update(updates);

    return res.status(200).json({
      success: true,
      message: 'Vehicle updated',
      data: await findVehicleByRegistration(vehicle.registrationNo),
    });
  } catch (err) {
    return next(err);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { registrationNo: req.params.registrationNo } });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await vehicle.update({ isActive: false });

    return res.status(200).json({ success: true, message: 'Vehicle deactivated' });
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
  getVehicle,
  updateVehicle,
  deleteVehicle,
  listVehicles,
  listVehiclePings,
};