const { District, PoliceStation } = require('@/models');

const stations = [
  { districtCode: 'LK-CMB', code: 'LK-PS-001', name: 'Colombo Central Police Station' },
  { districtCode: 'LK-CMB', code: 'LK-PS-002', name: 'Fort Police Station' },
  { districtCode: 'LK-GMP', code: 'LK-PS-003', name: 'Gampaha Police Station' },
  { districtCode: 'LK-KAL', code: 'LK-PS-004', name: 'Kalutara Police Station' },
  { districtCode: 'LK-KND', code: 'LK-PS-005', name: 'Kandy Police Station' },
  { districtCode: 'LK-MTL', code: 'LK-PS-006', name: 'Matale Police Station' },
  { districtCode: 'LK-NWR', code: 'LK-PS-007', name: 'Nuwara Eliya Police Station' },
  { districtCode: 'LK-GLL', code: 'LK-PS-008', name: 'Galle Police Station' },
  { districtCode: 'LK-MTR', code: 'LK-PS-009', name: 'Matara Police Station' },
  { districtCode: 'LK-HNB', code: 'LK-PS-010', name: 'Hambantota Police Station' },
  { districtCode: 'LK-JFN', code: 'LK-PS-011', name: 'Jaffna Police Station' },
  { districtCode: 'LK-KIL', code: 'LK-PS-012', name: 'Kilinochchi Police Station' },
  { districtCode: 'LK-MUL', code: 'LK-PS-013', name: 'Mullaitivu Police Station' },
  { districtCode: 'LK-VAV', code: 'LK-PS-014', name: 'Vavuniya Police Station' },
  { districtCode: 'LK-MAN', code: 'LK-PS-015', name: 'Mannar Police Station' },
  { districtCode: 'LK-BTI', code: 'LK-PS-016', name: 'Batticaloa Police Station' },
  { districtCode: 'LK-AMP', code: 'LK-PS-017', name: 'Ampara Police Station' },
  { districtCode: 'LK-TRC', code: 'LK-PS-018', name: 'Trincomalee Police Station' },
  { districtCode: 'LK-PUT', code: 'LK-PS-019', name: 'Puttalam Police Station' },
  { districtCode: 'LK-KUR', code: 'LK-PS-020', name: 'Kurunegala Police Station' },
  { districtCode: 'LK-ANR', code: 'LK-PS-021', name: 'Anuradhapura Police Station' },
  { districtCode: 'LK-POL', code: 'LK-PS-022', name: 'Polonnaruwa Police Station' },
  { districtCode: 'LK-BAD', code: 'LK-PS-023', name: 'Badulla Police Station' },
  { districtCode: 'LK-MON', code: 'LK-PS-024', name: 'Monaragala Police Station' },
  { districtCode: 'LK-RAT', code: 'LK-PS-025', name: 'Ratnapura Police Station' },
];

const seedPoliceStations = async () => {
  for (const station of stations) {
    const district = await District.findOne({
      where: { code: station.districtCode },
    });

    if (!district) {
      continue;
    }

    await PoliceStation.findOrCreate({
      where: { code: station.code },
      defaults: {
        districtId: district.id,
        name: station.name,
        code: station.code,
      },
    });
  }
};

module.exports = {
  seedPoliceStations,
};