const { DataTypes } = require('sequelize');

const DistrictModel = (sequelize) => {
  const District = sequelize.define(
    'District',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      provinceId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'districts',
      timestamps: true,
    }
  );

  return District;
};

module.exports = {
  DistrictModel,
};
