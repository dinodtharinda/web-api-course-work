const { Op } = require('sequelize');

const { sequelize, LocationPing, Vehicle } = require('@/models');
const { infoLog } = require('@/utils/logger.util');

const DEFAULT_START_AT = '2026-04-18T00:00:00Z';
const DEFAULT_END_AT = '2026-04-25T23:59:59Z';
const DEFAULT_PINGS_PER_DAY = 4;
const SOURCE_TYPE = 'simulation';
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MIN_LATITUDE = 5.8;
const MAX_LATITUDE = 9.9;
const MIN_LONGITUDE = 79.6;
const MAX_LONGITUDE = 81.95;

const parseDate = (value, fallback) => {
  const date = new Date(value || fallback);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid simulation date value: ${value}`);
  }

  return date;
};

const createSeededRandom = (seedText) => {
  let seed = 0;

  for (const character of seedText) {
    seed = (seed * 31 + character.charCodeAt(0)) >>> 0;
  }

  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getBaseCoordinates = (districtId) => {
  const districtOffset = Math.max(Number.parseInt(districtId, 10) || 1, 1);

  return {
    latitude: 6.6 + ((districtOffset - 1) % 9) * 0.32,
    longitude: 79.7 + ((districtOffset - 1) % 8) * 0.18,
  };
};

const buildSimulationRows = (vehicle, startAt, endAt, pingsPerDay) => {
  const random = createSeededRandom(`${vehicle.id}:${vehicle.registrationNo}`);
  const { latitude: baseLatitude, longitude: baseLongitude } = getBaseCoordinates(vehicle.districtId);
  const pingRows = [];
  const intervalMs = Math.floor(DAY_IN_MS / pingsPerDay);
  let currentLatitude = baseLatitude + (random() - 0.5) * 0.04;
  let currentLongitude = baseLongitude + (random() - 0.5) * 0.04;

  for (let dayCursor = startAt.getTime(); dayCursor <= endAt.getTime(); dayCursor += DAY_IN_MS) {
    for (let slot = 0; slot < pingsPerDay; slot += 1) {
      const recordedAt = new Date(dayCursor + slot * intervalMs);

      if (recordedAt > endAt) {
        continue;
      }

      currentLatitude = clamp(currentLatitude + (random() - 0.5) * 0.05, MIN_LATITUDE, MAX_LATITUDE);
      currentLongitude = clamp(currentLongitude + (random() - 0.5) * 0.05, MIN_LONGITUDE, MAX_LONGITUDE);

      pingRows.push({
        vehicleId: vehicle.id,
        latitude: Number(currentLatitude.toFixed(7)),
        longitude: Number(currentLongitude.toFixed(7)),
        recordedAt,
        sourceType: SOURCE_TYPE,
        createdAt: recordedAt,
        updatedAt: recordedAt,
      });
    }
  }

  return pingRows;
};

const seedSimulationHistory = async () => {
  const startAt = parseDate(process.env.SIMULATION_START_DATE, DEFAULT_START_AT);
  const endAt = parseDate(process.env.SIMULATION_END_DATE, DEFAULT_END_AT);
  const pingsPerDay = Number.parseInt(process.env.SIMULATION_PINGS_PER_DAY || String(DEFAULT_PINGS_PER_DAY), 10);

  if (!Number.isInteger(pingsPerDay) || pingsPerDay <= 0) {
    throw new Error('SIMULATION_PINGS_PER_DAY must be a positive integer');
  }

  if (startAt > endAt) {
    throw new Error('SIMULATION_START_DATE must be earlier than SIMULATION_END_DATE');
  }

  const vehicles = await Vehicle.findAll({
    attributes: ['id', 'registrationNo', 'districtId'],
    order: [['id', 'ASC']],
  });

  if (vehicles.length === 0) {
    infoLog('No vehicles available for simulation history seeding');
    return;
  }

  const simulationRows = vehicles.flatMap((vehicle) => buildSimulationRows(vehicle, startAt, endAt, pingsPerDay));

  await sequelize.transaction(async (transaction) => {
    await LocationPing.destroy({
      where: {
        sourceType: SOURCE_TYPE,
        recordedAt: {
          [Op.between]: [startAt, endAt],
        },
      },
      transaction,
    });

    await LocationPing.bulkCreate(simulationRows, {
      transaction,
      validate: true,
    });
  });

  infoLog(`Seeded ${simulationRows.length} simulation location pings for ${vehicles.length} vehicles`);
};

module.exports = {
  seedSimulationHistory,
};