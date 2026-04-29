const { DataTypes } = require('sequelize');

const VehicleModel = (sequelize) => {
  const Vehicle = sequelize.define(
    'Vehicle',
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
      registrationNo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      ownerName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'vehicles',
      timestamps: true,
    }
  );

  return Vehicle;
};

module.exports = {
  VehicleModel,
};