const { Op } = require('sequelize');
const { Province, District, Vehicle, LocationPing } = require('@/models');
const { parseListQuery } = require('@/utils/list-query.util');

const listProvinces = async (req, res, next) => {
  try {
    const includeDistricts = String(req.query.includeDistricts || '').toLowerCase() === 'true';
    const { page, pageSize, limit, offset, sortBy, sortOrder, search } = parseListQuery(req.query, {
      defaultSortBy: 'name',
      defaultSortOrder: 'ASC',
      allowedSortBy: ['name', 'code', 'createdAt', 'updatedAt'],
    });

    const where = search
      ? {
          name: {
            [Op.like]: `%${search}%`,
          },
        }
      : undefined;

    const { rows: provinces, count: total } = await Province.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
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

const getMovementHistory = async (req, res, next) => {
  try {
    const { registrationNo } = req.params;
    const { from, to } = req.query;

    if (!registrationNo) {
      return res.status(400).json({
        success: false,
        message: 'registrationNo is required',
      });
    }

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'from and to are required',
      });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      return res.status(422).json({
        success: false,
        message: 'from and to must be valid date-time values',
      });
    }

    if (fromDate > toDate) {
      return res.status(422).json({
        success: false,
        message: 'from must be earlier than or equal to to',
      });
    }

    const vehicle = await Vehicle.findOne({
      where: { registrationNo: String(registrationNo).trim().toUpperCase() },
      attributes: ['id', 'registrationNo'],
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    const movementHistory = await LocationPing.findAll({
      where: {
        vehicleId: vehicle.id,
        recordedAt: {
          [Op.between]: [fromDate, toDate],
        },
      },
      attributes: ['id', 'latitude', 'longitude', 'recordedAt', 'sourceType', 'createdAt', 'updatedAt'],
      order: [
        ['recordedAt', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Movement history retrieved',
      data: {
        vehicleId: vehicle.id,
        registrationNo: vehicle.registrationNo,
        from: fromDate,
        to: toDate,
        count: movementHistory.length,
        history: movementHistory.map((ping) => ({
          id: ping.id,
          latitude: ping.latitude,
          longitude: ping.longitude,
          recordedAt: ping.recordedAt,
          sourceType: ping.sourceType,
          createdAt: ping.createdAt,
          updatedAt: ping.updatedAt,
        })),
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getFilteredHistory = async (req, res, next) => {
  try {
    const { provinceId, districtId } = req.query;

    const parsedProvinceId = provinceId !== undefined ? Number.parseInt(provinceId, 10) : null;
    const parsedDistrictId = districtId !== undefined ? Number.parseInt(districtId, 10) : null;

    if (parsedProvinceId === null && parsedDistrictId === null) {
      return res.status(400).json({
        success: false,
        message: 'provinceId or districtId is required',
      });
    }

    if (parsedProvinceId !== null && (!Number.isInteger(parsedProvinceId) || parsedProvinceId <= 0)) {
      return res.status(422).json({
        success: false,
        message: 'provinceId must be a positive integer',
      });
    }

    if (parsedDistrictId !== null && (!Number.isInteger(parsedDistrictId) || parsedDistrictId <= 0)) {
      return res.status(422).json({
        success: false,
        message: 'districtId must be a positive integer',
      });
    }

    const movementHistory = await LocationPing.findAll({
      attributes: ['id', 'latitude', 'longitude', 'recordedAt', 'sourceType', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'registrationNo', 'districtId'],
          required: true,
          include: [
            {
              model: District,
              as: 'district',
              attributes: ['id', 'name', 'code', 'provinceId', 'createdAt', 'updatedAt'],
              required: true,
              ...(parsedDistrictId !== null ? { where: { id: parsedDistrictId } } : {}),
              include: [
                {
                  model: Province,
                  as: 'province',
                  attributes: ['id', 'name', 'createdAt', 'updatedAt'],
                  required: true,
                  ...(parsedProvinceId !== null ? { where: { id: parsedProvinceId } } : {}),
                },
              ],
            },
          ],
        },
      ],
      order: [
        ['recordedAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Filtered movement history retrieved',
      data: {
        filters: {
          provinceId: parsedProvinceId,
          districtId: parsedDistrictId,
        },
        count: movementHistory.length,
        history: movementHistory.map((ping) => ({
          id: ping.id,
          latitude: ping.latitude,
          longitude: ping.longitude,
          recordedAt: ping.recordedAt,
          sourceType: ping.sourceType,
          createdAt: ping.createdAt,
          updatedAt: ping.updatedAt,
          vehicle: {
            id: ping.vehicle.id,
            registrationNo: ping.vehicle.registrationNo,
          },
          district: {
            id: ping.vehicle.district.id,
            name: ping.vehicle.district.name,
            code: ping.vehicle.district.code,
            provinceId: ping.vehicle.district.provinceId,
          },
          province: {
            id: ping.vehicle.district.province.id,
            name: ping.vehicle.district.province.name,
          },
        })),
      },
    });
  } catch (err) {
    return next(err);
  }
};
module.exports = {
  listProvinces,
  ingestLocationPing,
  getLatestLocation,
  getMovementHistory,
  getFilteredHistory,
};
