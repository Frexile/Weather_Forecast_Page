const apiKey = "c3e933801amsh831c38a46c3a0a7p1eef72jsnc9db1c1d58c7";
const apiHost = "weatherapi-com.p.rapidapi.com";
const urlSample = "https://weatherapi-com.p.rapidapi.com/current.json?q=";

async function getApiResponse(cityIdentifier) {
  const response = await fetch(urlSample + cityIdentifier, {
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    },
  });

  return response.json();
}

async function showContent(city) {
  var temp = document.getElementById("fav-tmp").content;
  var jsonData = await getApiResponse(city);

  fillData(jsonData, 1); //remove

  const clone = temp.querySelector("div").cloneNode(true);
  var favourites = document.querySelector("#fav-cities");

  document.getElementById("fav-cities").appendChild(clone);

  clone.querySelector("button").onclick = () => {
    favourites.removeChild(clone);

    const favCities = new Set(JSON.parse(localStorage.cities));
    favCities.delete(city);

    localStorage.cities = JSON.stringify([...favCities]);
  };
}

async function successCallBack(position) {
  var currData = {};

  currData = await getApiResponse(
    `${position.coords.latitude},${position.coords.longitude}`
  );
  fillData(currData, 0);

  return currData;
}

async function errorCallBack() {
  var currData = {};
  console.log(localStorage.defaultCity)
  currData = await getApiResponse(localStorage.defaultCity);
  fillData(currData, 0);

  return currData;
}

function fillHeader(flag) {
  var cityName, tempCelsius, icon;
  var headerInfo = {
    cityName,
    tempCelsius,
    icon,
  };

  var temp = document.getElementById("fav-tmp").content;

  if (!flag) {
    headerInfo.cityName = document.querySelector("#current-city-name");
    headerInfo.tempCelsius = document.querySelector(
      "#current-city > div > div > p"
    );
    headerInfo.icon = document.querySelector("#current-city > div > div > img");
  } else {
    headerInfo.cityName = temp.querySelector("div > div > div > h3");
    headerInfo.tempCelsius = temp.querySelector("div > div > div > p");
    headerInfo.icon = temp.querySelector("div > div > div > img");
  }

  return headerInfo;
}

function fillData(jsonData, elemId) {
  const current = jsonData.current;
  const location = jsonData.location;
  var header = fillHeader(elemId);

  header.cityName.innerHTML = location.name;
  header.tempCelsius.innerHTML = current.temp_c + "&#176";
  header.icon.src = current.condition.icon;

  weatherParams = setSelectors(elemId);

  weatherParams.get("wind").innerHTML = `${current.wind_dir}, ${current.wind_mph} m/s`;
  weatherParams.get("cloud").innerHTML = `${current.cloud}%`;
  weatherParams.get("pressure").innerHTML = `${current.pressure_mb} mb`;
  weatherParams.get("humidity").innerHTML = `${current.humidity}%`;
  weatherParams.get("coords").innerHTML = `[${location.lat}, ${location.lon}]`;
}

function setSelectors(flag) {
  var descParams = ["wind", "cloud", "pressure", "humidity", "coords"];
  var listHTML;
  var temp = document.getElementById("fav-tmp").content;

  if (!flag) {
    listHTML = document.querySelector("#current-city > ul");
  } else {
    listHTML = temp.querySelector("div > ul");
  }

  var descSamples = new Map();

  for (let i = 0; i < descParams.length; i++) {
    var selector = `li:nth-child(${i + 1}) > p`;
    descSamples.set(descParams[i], listHTML.querySelector(selector));
  }

  return descSamples;
}

async function initCurrent() {
  var elemId = 0;
  load();
  if (navigator.geolocation) {
    console.log("Geolocation success");
    navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
  } else {
    console.log("Geolocation is unavailable at your browser/OS");
    defaultJson = await getApiResponse(localStorage.getItem("defaultCity"));
    fillData(defaultJson, elemId);
  }
}

function initStorage() {
  var defaultFavourites = ["moscow", "new-york", "london", "tokio"];

  if (localStorage.getItem("defaultCity") === null) {
    localStorage.setItem("defaultCity", "Moscow");
  }

  if (localStorage.getItem("cities") === null) {
    localStorage.cities = JSON.stringify(defaultFavourites);
  }
}

function initFavourites() {
  var savedFavourites = JSON.parse(localStorage.cities);

  for (let i = 0; i < savedFavourites.length; i++) {
    showContent(savedFavourites[i]);
  }
}

async function addFavourite() {
  event.preventDefault();
  const cityField = document.querySelector("#add-city-field");
  const newCity = cityField.value.trim().toLowerCase();
  cityField.value = "";

  if (newCity !== "") {
    var currFavourites = new Set(JSON.parse(localStorage.cities));

    try {
      if (!currFavourites.has(newCity)) {
        await showContent(newCity);
        currFavourites.add(newCity);

        localStorage.cities = JSON.stringify([...currFavourites]);
      } else {
        window.alert(
          `This city (${toUpperFirst(
            newCity
          )}) is already in your favourites list.`
        );
      }
    } catch (err) {
      window.alert(
        `This city (${toUpperFirst(newCity)}) doesn't exist. Try again`
      );
    }
  }
}

function toUpperFirst(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function load() {
  const currValSelector = document.querySelectorAll("section")[0];
  const loaderSelector = document.querySelector("body > main > div");
  console.log(currValSelector)
  currValSelector.classList.add("hidden");
  loaderSelector.classList.remove("hidden");

  setTimeout(() => {
    loaderSelector.classList.add("hidden");
    currValSelector.classList.remove("hidden");
  }, 1000);
}

async function main() {
  initStorage();
  initCurrent();
  initFavourites();
}

main();
