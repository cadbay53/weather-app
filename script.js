// --------------------------------------------------------------------------------------
// Logic for displaying fetching the location data and displaying as a suggestions list
// Logic for event listeners

const searchBox = document.querySelector("#input-box");
const searchIcon = document.querySelector("#icon");
const weatherComponent = document.querySelector(".weather-componentRow");
const resultBox = document.querySelector(".result-box");

let timeout = null;
let previousValue = "";
let locationArray;
let weatherData;

// ----------------------------------------------------------------------------------------
// Event listeners for different events
searchBox.addEventListener("keyup", () => {
  weatherComponent.style.display = "none";
  const currentValue = searchBox.value.trim();
  // different logic for different search box situations (took help from gpt)
  if (currentValue === "") {
    // clearTimeout(timeout);
    clearSearchList();
    previousValue = currentValue;
    return;
  }

  if (currentValue === previousValue) {
    // clearTimeout(timeout);
    previousValue = currentValue;
    return;
  }

  // clearTimeout(timeout);

  // timeout = setTimeout(() => {
  //   fetchLocationData().then((data) => {
  //     locationArray = data;
  //     display(locationArray);
  //   });
  //   previousValue = currentValue;
  // }, 500);
  fetchLocationData().then((data) => {
    locationArray = data;
    display(locationArray);
  });
  previousValue = currentValue;
});

searchIcon.addEventListener("click", () => {
  fetchWeatherData(locationArray).then((data) => {
    weatherData = data;
    // console.log(weatherData);
    displayWeatherComponent(weatherData);
  });
});

searchBox.addEventListener("keyup", (e) => {
  if (event.key === "Enter" || event.keyCode === 13) {
    fetchWeatherData(locationArray).then((data) => {
      weatherData = data;
      // console.log(weatherData);
      displayWeatherComponent(weatherData);
    });
  }
});

// ------------------------------------------------------------------------------------
// Function to fetch location data

async function fetchLocationData() {
  const cityName = document.querySelector("#input-box").value;
  const locationApiurl = `https://cadbayw-api.cadbay.in/api-location?city_name=${cityName}`;
  // const locationApiurl = `http://127.0.0.1:5000/api-location?city_name=${cityName}`;

  try {
    const response = await fetch(locationApiurl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    // block for extracting location names from the json
    const locationJson = await response.json();

    const locationArray = locationJson.map((locationObject, i) => {
      return {
        name: locationObject.name,
        lat: locationObject.lat,
        lon: locationObject.lon,
      };
    });
    // console.log(locationArray);
    const uniqueLocationArray = locationArray.filter(
      (elem, index) =>
        locationArray.findIndex((obj) => obj.name === elem.name) === index
    );
    console.log(uniqueLocationArray);
    return uniqueLocationArray;
  } catch (error) {
    console.log(error.message);
  }
}

// -----------------------------------------------------------------------------------------
// Function to fetch weather data

async function fetchWeatherData(locationArray, event) {
  let locationDetails;

  // console.log(locationArray);

  if (event) {
    const locationClicked = event.target.textContent;
    // console.log(locationClicked);
    const indexLocation = locationArray.findIndex(
      (obj) => obj.name === locationClicked
    );
    locationDetails = locationArray[indexLocation];
  } else {
    locationDetails = locationArray[0];
  }
  const latitude = locationDetails.lat;
  const longitude = locationDetails.lon;
  const cityName = locationDetails.name;

  // console.log(locationDetails);
  const weatherApiurl = `https://cadbayw-api.cadbay.in/api-weather?lat=${latitude}&lon=${longitude}&city_name=${cityName}`;
  // const weatherApiurl = `http://127.0.0.1:5000/api-weather?lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(weatherApiurl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const weatherJson = await response.json();

    // console.log(weatherJson);
    return weatherJson;
  } catch (error) {
    console.log(error.message);
  }
}

// -----------------------------------------------------------------------------------------
// Function to append the location data list to the search box and empties the list if the
// search box is emptied

function display(resultArray) {
  const resultBox = document.querySelector(".result-box");

  resultBox.innerHTML = "";

  const myUl = document.createElement("ul");

  if (resultArray.length > 3) {
    for (i = 0; i < 4; i++) {
      const li = document.createElement("li");
      li.id = "listItem-" + i;
      li.textContent = resultArray[i].name;
      // console.log(li);
      myUl.appendChild(li);
      resultBox.appendChild(myUl);
    }
  } else if (resultArray.length > 0) {
    for (i = 0; i < resultArray.length; i++) {
      const li = document.createElement("li");
      li.id = "listItem-" + i;
      li.textContent = resultArray[i].name;
      myUl.appendChild(li);
      resultBox.appendChild(myUl);
    }
  } else {
    resultBox.innerHTML = "";
  }

  const liElements = document.querySelectorAll("li");

  liElements.forEach((li) => {
    li.addEventListener("click", (e) => {
      fetchWeatherData(locationArray, e).then((data) => {
        weatherData = data;
        // console.log(weatherData);
        displayWeatherComponent(weatherData);
      });
    });
  });
}

function clearSearchList() {
  const resultBox = document.querySelector(".result-box");
  resultBox.innerHTML = "";
  pElement.innerText = "";
}

// -----------------------------------------------------------------------------------------
// Function for displaying the forecast component

function displayWeatherComponent(weatherData) {
  console.log(weatherData);
  resultBox.innerHTML = "";
  weatherComponent.style.display = "flex";
  const locationToDisplay = weatherData.city_name;
  const temperatureToDisplay = weatherData.temperature;
  const cloudStatusToDisplay = weatherData.clouds;

  const locationElem = document.querySelector(".weather-componentRow h1");
  const temperatureElem = document.querySelector(".temperature");
  const cloudsElem = document.querySelector(".cloudy");

  locationElem.innerText = locationToDisplay;
  temperatureElem.textContent = temperatureToDisplay + "\u00B0" + "C";
  cloudsElem.innerText = cloudStatusToDisplay;
}
