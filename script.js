{
  const searchBox = document.querySelector("#searchPlace");

  let timeout = null;

  searchBox.addEventListener("keyup", () => {
    clearTimeout(timeout);

    timeout = setTimeout(fetchLocationData, 1000);
  });
}

async function fetchLocationData() {
  const cityName = document.querySelector("#searchPlace").value;
  const locationApiurl = `http://cadbay-api.cadbay.in/location-data?city_name=${cityName}`;
  // const locationApiurl = `http://127.0.0.1:5000/location-data?city_name=${cityName}`;
  //   console.log(locationApiurl);
  //   console.log(cityName);
  try {
    const response = await fetch(locationApiurl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error.message);
  }
}

// Play area
const inputPlay = document.getElementById("play");
const inputPlayP = document.getElementById("playp");

inputPlay.addEventListener("keyup", () => {
  let timeout = null;
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    inputPlayP.innerText = `${inputPlay.value}`;
  }, 1500);
});
