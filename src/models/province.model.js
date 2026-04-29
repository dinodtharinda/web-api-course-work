const { DataTypes } = require('sequelize');

const ProvinceModel = (sequelize) => {
  const Province = sequelize.define(
    'Province',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'provinces',
      timestamps: true,
    }
  );

  return Province;
};

module.exports = {
  ProvinceModel,
};
