const { Op } = require('sequelize');
const { TrackingDevice, Vehicle } = require('@/models');
const { parseListQuery, buildListMeta } = require('@/utils/list-query.util');

const deviceInclude = [
  {
    model: Vehicle,
    as: 'vehicle',
    attributes: ['id', 'registrationNo', 'ownerName', 'districtId', 'isActive'],
    required: true,
  },
];

const findDeviceBySerial = (deviceSerial) =>
  TrackingDevice.findOne({ where: { deviceSerial }, include: deviceInclude });

const listDevices = async (req, res, next) => {
  try {
    const query = parseListQuery(req.query, {
      defaultSortBy: 'deviceSerial',
      defaultSortOrder: 'ASC',
      allowedSortBy: ['deviceSerial', 'isActive', 'createdAt', 'updatedAt'],
    });

    const where = {};

    if (query.search) {
      where.deviceSerial = { [Op.like]: `%${query.search}%` };
    }

    if (req.query.isActive !== undefined) {
      where.isActive = String(req.query.isActive).toLowerCase() === 'true';
    }

    const { rows, count } = await TrackingDevice.findAndCountAll({
      where,
      include: deviceInclude,
      order: [[query.sortBy, query.sortOrder]],
      limit: query.limit,
      offset: query.offset,
    });

    return res.status(200).json({
      success: true,
      message: 'Tracking devices retrieved',
      data: rows,
      meta: buildListMeta(query, count),
    });
  } catch (err) {
    return next(err);
  }
};

const getDevice = async (req, res, next) => {
  try {
    const device = await findDeviceBySerial(req.params.deviceSerial);

    if (!device) {
      return res.status(404).json({ success: false, message: 'Tracking device not found' });
    }

    return res.status(200).json({ success: true, message: 'Tracking device retrieved', data: device });
  } catch (err) {
    return next(err);
  }
};

const createDevice = async (req, res, next) => {
  try {
    const deviceSerial = String(req.body.deviceSerial || '').trim();
    const registrationNo = String(req.body.registrationNo || '').trim().toUpperCase();
    const errors = {};

    if (!deviceSerial) errors.deviceSerial = 'deviceSerial is required';
    if (!registrationNo) errors.registrationNo = 'registrationNo is required';

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors });
    }

    const vehicle = await Vehicle.findOne({ where: { registrationNo } });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (await TrackingDevice.findOne({ where: { vehicleId: vehicle.id } })) {
      return res.status(409).json({ success: false, message: 'Vehicle already has a tracking device' });
    }

    await TrackingDevice.create({ vehicleId: vehicle.id, deviceSerial });

    return res.status(201).json({
      success: true,
      message: 'Tracking device created',
      data: await findDeviceBySerial(deviceSerial),
    });
  } catch (err) {
    return next(err);
  }
};

const updateDevice = async (req, res, next) => {
  try {
    const device = await TrackingDevice.findOne({ where: { deviceSerial: req.params.deviceSerial } });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Tracking device not found' });
    }

    const updates = {};
    const { deviceSerial, isActive } = req.body;

    if (deviceSerial !== undefined) {
      if (!String(deviceSerial).trim()) {
        return res.status(422).json({ success: false, message: 'deviceSerial must not be empty' });
      }
      updates.deviceSerial = String(deviceSerial).trim();
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
        message: 'Provide at least one of deviceSerial, isActive',
      });
    }

    await device.update(updates);

    return res.status(200).json({
      success: true,
      message: 'Tracking device updated',
      data: await findDeviceBySerial(device.deviceSerial),
    });
  } catch (err) {
    return next(err);
  }
};

const deleteDevice = async (req, res, next) => {
  try {
    const device = await TrackingDevice.findOne({ where: { deviceSerial: req.params.deviceSerial } });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Tracking device not found' });
    }

    await device.destroy();

    return res.status(200).json({ success: true, message: 'Tracking device deleted' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
};
