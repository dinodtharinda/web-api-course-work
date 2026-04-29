const { DataTypes } = require('sequelize');

const PoliceStationModel = (sequelize) => {
  const PoliceStation = sequelize.define(
    'PoliceStation',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      districtId: {
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
      tableName: 'police_stations',
      timestamps: true,
    }
  );

  return PoliceStation;
};

module.exports = {
  PoliceStationModel,
};