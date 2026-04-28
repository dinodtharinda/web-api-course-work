const { Sequelize } = require('sequelize');
const { ProvinceModel } = require('@/models/province.model');
const { DistrictModel } = require('@/models/district.model');
const { PoliceStationModel } = require('@/models/police-station.model');
const { VehicleModel } = require('@/models/vehicle.model');
const { LocationPingModel } = require('@/models/location-ping.model');
const { TrackingDeviceModel } = require('@/models/tracking-device.model');
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
const PoliceStation = PoliceStationModel(sequelize);
const Vehicle = VehicleModel(sequelize);
const LocationPing = LocationPingModel(sequelize);
const TrackingDevice = TrackingDeviceModel(sequelize);
const User = UserModel(sequelize);

Province.hasMany(District, {
  foreignKey: 'provinceId',
  as: 'districts',
});

District.belongsTo(Province, {
  foreignKey: 'provinceId',
  as: 'province',
});

District.hasMany(PoliceStation, {
  foreignKey: 'districtId',
  as: 'policeStations',
});

PoliceStation.belongsTo(District, {
  foreignKey: 'districtId',
  as: 'district',
});

District.hasMany(Vehicle, {
  foreignKey: 'districtId',
  as: 'vehicles',
});

Vehicle.belongsTo(District, {
  foreignKey: 'districtId',
  as: 'district',
});

Vehicle.hasOne(TrackingDevice, {
  foreignKey: 'vehicleId',
  as: 'trackingDevice',
});

TrackingDevice.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
});

Vehicle.hasMany(LocationPing, {
  foreignKey: 'vehicleId',
  as: 'locationPings',
});

LocationPing.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
});

module.exports = {
  sequelize,
  Sequelize,
  Province,
  District,
  PoliceStation,
  Vehicle,
  LocationPing,
  TrackingDevice,
  User,
};
