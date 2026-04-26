const { DataTypes } = require('sequelize');

const TrackingDeviceModel = (sequelize) => {
  const TrackingDevice = sequelize.define(
    'TrackingDevice',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      vehicleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
      },
      deviceSerial: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'tracking_devices',
      timestamps: true,
    }
  );

  return TrackingDevice;
};

module.exports = {
  TrackingDeviceModel,
};