const axios = require("axios");

module.exports = async function getCoordinates(city) {
  const url = `https://nominatim.openstreetmap.org/search?q=${city}&countrycodes=EG&format=json`;
  const response = await axios.get(url);

  if (response.data.length > 0) {
    const lat = parseFloat(response.data[0].lat);
    const lon = parseFloat(response.data[0].lon);
    return { lat, lon };
  } else {
    throw new Error("City not found");
  }
};
