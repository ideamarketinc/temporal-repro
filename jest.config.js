const { defaults: tsjPreset } = require("ts-jest/presets");

const config = {
  clearMocks: true,
  transform: {
    ...tsjPreset.transform,
  },
};

module.exports = config;
