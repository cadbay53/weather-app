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
    // clearSearchList();
    previousValue = currentValue;
    return;
  }

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    fetchLocationData().then((data) => {
      locationArray = data;
      // display(locationArray);
    });
    previousValue = currentValue;
  }, 1000);
});

const searchIcon = document.querySelector("#icon");

searchIcon.addEventListener("click", () => {
  fetchWeatherData(locationArray);
});

searchIcon.addEventListener("keydown", () => {
  if (event.key == +"Enter") {
    fetchWeatherData();
  }
});
// ------------------------------------------------------------------------------------
// Function to fetch location data

async function fetchLocationData() {
  const cityName = document.querySelector("#input-box").value;
  const locationApiurl = `api url`;
  // const locationApiurl = `http://127.0.0.1:5000/location-data?city_name=${cityName}`;

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
// Function to append the location data list to the search box and empties the list if the
// search box is emptied

function display(resultArray) {
  const resultBox = document.querySelector(".result-box");

  resultBox.innerHTML = "";

  const myUl = document.createElement("ul");

  if (resultArray.length > 3) {
    for (i = 0; i < 4; i++) {
      const li = document.createElement("li");
      li.textContent = resultArray[i].name;
      myUl.appendChild(li);
      resultBox.appendChild(myUl);
    }
  } else if (resultArray.length > 0) {
    for (i = 0; i < resultArray.length; i++) {
      const li = document.createElement("li");
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
// Function for Clicking search button or pressing enter and fetching the weather forecast and displaying
// the forecast component

function fetchWeatherData(locationArray) {
  console.log(locationArray);
  // const locationData = locationArray[0];
  // console.log[]
}
