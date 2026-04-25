const { Province, District } = require('@/models');

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

module.exports = {
  listProvinces,
};
