const { Op } = require('sequelize');
const { PoliceStation, District, Vehicle, LocationPing, Province, TrackingDevice } = require('@/models');
const { parseListQuery, buildListMeta } = require('@/utils/list-query.util');

const listStations = async (req, res, next) => {
  try {
    const { page, pageSize, limit, offset, sortBy, sortOrder, search } = parseListQuery(req.query, {
      defaultSortBy: 'name',
      defaultSortOrder: 'ASC',
      allowedSortBy: ['name', 'code', 'createdAt', 'updatedAt'],
    });

    const where = search
      ? {
          [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { code: { [Op.like]: `%${search}%` } }],
        }
      : undefined;

    const { rows: stations, count: total } = await PoliceStation.findAndCountAll({
      where,
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code', 'provinceId', 'createdAt', 'updatedAt'],
          required: true,
        },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: 'Police stations retrieved',
      data: stations,
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

const stationInclude = [
  {
    model: District,
    as: 'district',
    attributes: ['id', 'name', 'code', 'provinceId', 'createdAt', 'updatedAt'],
    required: true,
  },
];

const getStation = async (req, res, next) => {
  try {
    const station = await PoliceStation.findByPk(req.params.stationId, { include: stationInclude });

    if (!station) {
      return res.status(404).json({ success: false, message: 'Police station not found' });
    }

    return res.status(200).json({ success: true, message: 'Police station retrieved', data: station });
  } catch (err) {
    return next(err);
  }
};

const createStation = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const code = String(req.body.code || '').trim().toUpperCase();
    const { districtId } = req.body;
    const errors = {};

    if (!name) errors.name = 'name is required';
    if (!code) errors.code = 'code is required';
    if (!Number.isInteger(districtId) || districtId <= 0) errors.districtId = 'districtId must be a positive integer';

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors });
    }

    if (!(await District.findByPk(districtId))) {
      return res.status(422).json({ success: false, message: 'Invalid districtId' });
    }

    const station = await PoliceStation.create({ name, code, districtId });

    return res.status(201).json({
      success: true,
      message: 'Police station created',
      data: await PoliceStation.findByPk(station.id, { include: stationInclude }),
    });
  } catch (err) {
    return next(err);
  }
};

const updateStation = async (req, res, next) => {
  try {
    const station = await PoliceStation.findByPk(req.params.stationId);

    if (!station) {
      return res.status(404).json({ success: false, message: 'Police station not found' });
    }

    const updates = {};
    const { name, code, districtId } = req.body;

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(422).json({ success: false, message: 'name must not be empty' });
      }
      updates.name = String(name).trim();
    }

    if (code !== undefined) {
      if (!String(code).trim()) {
        return res.status(422).json({ success: false, message: 'code must not be empty' });
      }
      updates.code = String(code).trim().toUpperCase();
    }

    if (districtId !== undefined) {
      if (!(await District.findByPk(districtId))) {
        return res.status(422).json({ success: false, message: 'Invalid districtId' });
      }
      updates.districtId = districtId;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one of name, code, districtId',
      });
    }

    await station.update(updates);

    return res.status(200).json({
      success: true,
      message: 'Police station updated',
      data: await PoliceStation.findByPk(station.id, { include: stationInclude }),
    });
  } catch (err) {
    return next(err);
  }
};

const deleteStation = async (req, res, next) => {
  try {
    const station = await PoliceStation.findByPk(req.params.stationId);

    if (!station) {
      return res.status(404).json({ success: false, message: 'Police station not found' });
    }

    await station.destroy();

    return res.status(200).json({ success: true, message: 'Police station deleted' });
  } catch (err) {
    return next(err);
  }
};

const listStationVehicles = async (req, res, next) => {
  try {
    const station = await PoliceStation.findByPk(req.params.stationId);

    if (!station) {
      return res.status(404).json({ success: false, message: 'Police station not found' });
    }

    const query = parseListQuery(req.query, {
      defaultSortBy: 'registrationNo',
      defaultSortOrder: 'ASC',
      allowedSortBy: ['registrationNo', 'ownerName', 'isActive', 'createdAt', 'updatedAt'],
    });

    const where = { districtId: station.districtId };

    if (query.search) {
      where[Op.or] = [
        { registrationNo: { [Op.like]: `%${query.search}%` } },
        { ownerName: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await Vehicle.findAndCountAll({
      where,
      include: [
        {
          model: TrackingDevice,
          as: 'trackingDevice',
          attributes: ['id', 'deviceSerial', 'isActive', 'createdAt', 'updatedAt'],
          required: false,
        },
      ],
      order: [[query.sortBy, query.sortOrder]],
      limit: query.limit,
      offset: query.offset,
    });

    return res.status(200).json({
      success: true,
      message: 'Station vehicles retrieved',
      data: rows,
      meta: buildListMeta(query, count),
    });
  } catch (err) {
    return next(err);
  }
};

const getStationTrackingHistory = async (req, res, next) => {
  try {
    const { stationId } = req.params;
    const { from, to } = req.query;

    const station = await PoliceStation.findByPk(stationId, {
      attributes: ['id', 'name', 'code', 'districtId', 'createdAt', 'updatedAt'],
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code', 'provinceId', 'createdAt', 'updatedAt'],
          required: true,
          include: [
            {
              model: Province,
              as: 'province',
              attributes: ['id', 'name', 'createdAt', 'updatedAt'],
              required: true,
            },
          ],
        },
      ],
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Police station not found',
      });
    }

    let dateFilter = {};

    if (from || to) {
      if (!from || !to) {
        return res.status(400).json({
          success: false,
          message: 'from and to are required together',
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

      dateFilter = {
        recordedAt: {
          [Op.between]: [fromDate, toDate],
        },
      };
    }

    const history = await LocationPing.findAll({
      where: dateFilter,
      attributes: ['id', 'latitude', 'longitude', 'recordedAt', 'sourceType', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'registrationNo', 'districtId'],
          required: true,
          where: { districtId: station.districtId },
          include: [
            {
              model: District,
              as: 'district',
              attributes: ['id', 'name', 'code', 'provinceId', 'createdAt', 'updatedAt'],
              required: true,
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
      message: 'Station tracking history retrieved',
      data: {
        station: {
          id: station.id,
          name: station.name,
          code: station.code,
          districtId: station.districtId,
          district: {
            id: station.district.id,
            name: station.district.name,
            code: station.district.code,
            provinceId: station.district.provinceId,
            province: {
              id: station.district.province.id,
              name: station.district.province.name,
            },
          },
        },
        count: history.length,
        history: history.map((ping) => ({
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
        })),
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listStations,
  getStation,
  createStation,
  updateStation,
  deleteStation,
  listStationVehicles,
  getStationTrackingHistory,
};