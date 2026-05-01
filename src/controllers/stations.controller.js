const { Op } = require('sequelize');
const { PoliceStation, District, Vehicle, LocationPing, Province } = require('@/models');
const { parseListQuery } = require('@/utils/list-query.util');

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
  getStationTrackingHistory,
};