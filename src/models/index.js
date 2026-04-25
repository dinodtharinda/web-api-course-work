const { Sequelize } = require('sequelize');
const { ProvinceModel } = require('@/models/province.model');
const { DistrictModel } = require('@/models/district.model');
const { UserModel } = require('@/models/user.model');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'web_api_course_work',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    define: {
      underscored: true,
      freezeTableName: true,
    },
  }
);

const Province = ProvinceModel(sequelize);
const District = DistrictModel(sequelize);
const User = UserModel(sequelize);

Province.hasMany(District, {
  foreignKey: 'provinceId',
  as: 'districts',
});

District.belongsTo(Province, {
  foreignKey: 'provinceId',
  as: 'province',
});

module.exports = {
  sequelize,
  Sequelize,
  Province,
  District,
  User,
};
