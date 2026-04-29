const { Province, District } = require('@/models');

const provinces = [
  { code: 'LK-1', name: 'Western Province' },
  { code: 'LK-2', name: 'Central Province' },
  { code: 'LK-3', name: 'Southern Province' },
  { code: 'LK-4', name: 'Northern Province' },
  { code: 'LK-5', name: 'Eastern Province' },
  { code: 'LK-6', name: 'North Western Province' },
  { code: 'LK-7', name: 'North Central Province' },
  { code: 'LK-8', name: 'Uva Province' },
  { code: 'LK-9', name: 'Sabaragamuwa Province' },
];

const districts = [
  { provinceCode: 'LK-1', code: 'LK-CMB', name: 'Colombo' },
  { provinceCode: 'LK-1', code: 'LK-GMP', name: 'Gampaha' },
  { provinceCode: 'LK-1', code: 'LK-KAL', name: 'Kalutara' },
  { provinceCode: 'LK-2', code: 'LK-KND', name: 'Kandy' },
  { provinceCode: 'LK-2', code: 'LK-MTL', name: 'Matale' },
  { provinceCode: 'LK-2', code: 'LK-NWR', name: 'Nuwara Eliya' },
  { provinceCode: 'LK-3', code: 'LK-GLL', name: 'Galle' },
  { provinceCode: 'LK-3', code: 'LK-MTR', name: 'Matara' },
  { provinceCode: 'LK-3', code: 'LK-HNB', name: 'Hambantota' },
  { provinceCode: 'LK-4', code: 'LK-JFN', name: 'Jaffna' },
  { provinceCode: 'LK-4', code: 'LK-KIL', name: 'Kilinochchi' },
  { provinceCode: 'LK-4', code: 'LK-MUL', name: 'Mullaitivu' },
  { provinceCode: 'LK-4', code: 'LK-VAV', name: 'Vavuniya' },
  { provinceCode: 'LK-4', code: 'LK-MAN', name: 'Mannar' },
  { provinceCode: 'LK-5', code: 'LK-BTI', name: 'Batticaloa' },
  { provinceCode: 'LK-5', code: 'LK-AMP', name: 'Ampara' },
  { provinceCode: 'LK-5', code: 'LK-TRC', name: 'Trincomalee' },
  { provinceCode: 'LK-6', code: 'LK-PUT', name: 'Puttalam' },
  { provinceCode: 'LK-6', code: 'LK-KUR', name: 'Kurunegala' },
  { provinceCode: 'LK-7', code: 'LK-ANR', name: 'Anuradhapura' },
  { provinceCode: 'LK-7', code: 'LK-POL', name: 'Polonnaruwa' },
  { provinceCode: 'LK-8', code: 'LK-BAD', name: 'Badulla' },
  { provinceCode: 'LK-8', code: 'LK-MON', name: 'Monaragala' },
  { provinceCode: 'LK-9', code: 'LK-RAT', name: 'Ratnapura' },
  { provinceCode: 'LK-9', code: 'LK-KGL', name: 'Kegalle' },
];

const seedMasterData = async () => {
  const provinceRows = [];

  for (const province of provinces) {
    const [record] = await Province.findOrCreate({
      where: { code: province.code },
      defaults: province,
    });

    provinceRows.push(record);
  }

  for (const district of districts) {
    const province = provinceRows.find((item) => item.code === district.provinceCode);

    if (!province) {
      continue;
    }

    await District.findOrCreate({
      where: { code: district.code },
      defaults: {
        provinceId: province.id,
        name: district.name,
        code: district.code,
      },
    });
  }
};

module.exports = {
  seedMasterData,
};
