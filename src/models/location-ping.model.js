const { DataTypes } = require('sequelize');

const LocationPingModel = (sequelize) => {
  const LocationPing = sequelize.define(
    'LocationPing',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      vehicleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      recordedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      sourceType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'device',
      },
    },
    {
      tableName: 'location_pings',
      timestamps: true,
    }
  );

  return LocationPing;
};

module.exports = {
  LocationPingModel,
};