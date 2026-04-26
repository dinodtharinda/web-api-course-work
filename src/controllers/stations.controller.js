const { PoliceStation, District } = require('@/models');

const listStations = async (req, res, next) => {
  try {
    const stations = await PoliceStation.findAll({
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code', 'provinceId', 'createdAt', 'updatedAt'],
          required: true,
        },
      ],
      order: [['name', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      message: 'Police stations retrieved',
      data: stations,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listStations,
};