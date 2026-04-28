const { District, Vehicle, TrackingDevice } = require('@/models');

const VEHICLES_PER_DISTRICT = 8;

const seedVehicleMasterData = async () => {
  const districts = await District.findAll({
    attributes: ['id', 'code'],
    order: [['id', 'ASC']],
  });

  for (const district of districts) {
    const districtCodeSegment = String(district.code || '')
      .replace('LK-', '')
      .replace(/[^A-Z0-9]/g, '');

    for (let index = 1; index <= VEHICLES_PER_DISTRICT; index += 1) {
      const number = String(index).padStart(3, '0');
      const registrationNo = `TK-${districtCodeSegment}-${number}`;
      const deviceSerial = `DEV-${districtCodeSegment}-${number}`;

      const [vehicle] = await Vehicle.findOrCreate({
        where: { registrationNo },
        defaults: {
          districtId: district.id,
          registrationNo,
          ownerName: `Owner ${districtCodeSegment} ${number}`,
        },
      });

      await TrackingDevice.findOrCreate({
        where: { vehicleId: vehicle.id },
        defaults: {
          vehicleId: vehicle.id,
          deviceSerial,
        },
      });
    }
  }
};

module.exports = {
  seedVehicleMasterData,
};