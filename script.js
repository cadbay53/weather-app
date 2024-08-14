// --------------------------------------------------------------------------------------
// Logic for displaying fetching the location data and displaying as a suggestions list
// Logic for event listeners

const searchBox = document.querySelector("#input-box");

let timeout = null;
let previousValue = "";
let locationArray;

searchBox.addEventListener("keyup", () => {
  const currentValue = searchBox.value.trim();
  // different logic for different search box situations (took help from gpt)
  if (currentValue === "") {
    clearTimeout(timeout);
    clearSearchList();
    previousValue = currentValue;
    return;
  }

  if (currentValue === previousValue) {
    clearTimeout(timeout);
    previousValue = currentValue;
    return;
  }

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    fetchLocationData().then((data) => {
      locationArray = data;
      display(locationArray);
    });
    previousValue = currentValue;
  }, 500);
  // fetchLocationData().then((data) => {
  //   locationArray = data;
  //   display(locationArray);
  // });
  // previousValue = currentValue;
});

const searchIcon = document.querySelector("#icon");

searchIcon.addEventListener("click", () => {
  fetchWeatherDataBySearchButton(locationArray);
});

searchBox.addEventListener("keyup", (e) => {
  if (event.key === "Enter" || event.keyCode === 13) {
    fetchWeatherDataBySearchButton(locationArray);
  }
});

// searchIcon.addEventListener("keydown", () => {
//   if (event.key === "Enter") {
//     fetchWeatherData();
//   }
// });
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
    return locationArray;
  } catch (error) {
    console.log(error.message);
  }
}

// -----------------------------------------------------------------------------------------
// Function to fetch weather data

async function fetchWeatherDataBySearchButton(locationArray) {
  const locationDetails = locationArray[0];
  const latitude = locationDetails.lat;
  const longitude = locationDetails.lon;

  const weatherApiurl = `https://cadbayw-api.cadbay.in/api-weather?lat=${latitude}&lon=${longitude}`;
  // const weatherApiurl = `http://127.0.0.1:5000/api-weather?lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(weatherApiurl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const weatherJson = await response.json();

    console.log(weatherJson);
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
      console.log(li);
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
}

function clearSearchList() {
  const resultBox = document.querySelector(".result-box");
  resultBox.innerHTML = "";
}

// -----------------------------------------------------------------------------------------
// Function for Clicking search button or pressing enter and fetching the weather forecast
// and displaying the forecast component

// function fetchWeatherDataBySearchButton(locationArray) {
//   // console.log(locationArray);
//   const locationDetails = locationArray[0];
//   console.log(locationDetails);
//   const name = locationDetails.name;
//   const longitude = locationDetails.lon;
//   const latitude = locationDetails.lat;
// }
