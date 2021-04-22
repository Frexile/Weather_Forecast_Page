function setSelectors(flag) {
  let descParams = ["wind", "cloud", "pressure", "humidity", "coords"];
  let listHTML;
  let temp = document.getElementById("fav-tmp").content;

  if (!flag) {
    listHTML = document.querySelector("#current-city > ul");
  } else {
    listHTML = temp.querySelector("div > ul");
  }

  let descSamples = new Map();

  for (let i = 0; i < descParams.length; i++) {
    var selector = `li:nth-child(${i + 1}) > p`;
    descSamples.set(descParams[i], listHTML.querySelector(selector));
  }

  return descSamples;
}

function toUpperFirst(str) {
  return str[0].toUpperCase() + str.slice(1);
}

const uriSample = "https://weather-forecast-page.herokuapp.com";
const defaultCity = "Moscow";


async function initFavs(){
  // load(document.getElementById("fav-cities"), document.getElementById("favourites"))

  const favsResponses = await fetch(uriSample + "/favourites", {
    method : "GET"
  });

  const data = await favsResponses.json();

  data.map(item => {
    generateCard(item);
  });
}

async function generateCard(cityJson){
  let temp = document.getElementById("fav-tmp").content;

  fillParams(cityJson, 1);

  const clone = temp.querySelector("div").cloneNode(true);
  let favourites = document.getElementById("fav-cities");

  favourites.appendChild(clone);

  clone.querySelector("button").onclick = async () => {
    favourites.removeChild(clone);
    
    try {

      console.log(cityJson.cityName);
      let bodyData = { 
        "cityName" : cityJson.cityName 
      }
      const data = await fetch(uriSample + "/favourites", {
        method : "DELETE",
        headers : {
          'Content-Type': 'application/json; charset=utf-8'
        },
        mode : 'cors',
        body : JSON.stringify(bodyData)
      });
    } catch (err) {
      console.error(err); 
    }
  };
}

function fillParams(jsonData, elemId) {
  let header = fillHeader(elemId);

  header.cityName.innerHTML = jsonData.cityName;
  header.tempCelsius.innerHTML = jsonData.temp + "&#176";
  header.icon.src = jsonData.icon;

  weatherParams = setSelectors(elemId);

  weatherParams.get("wind").innerHTML = `${jsonData.windDir}, ${jsonData.wind} m/s`;
  weatherParams.get("cloud").innerHTML = `${jsonData.cloud}%`;
  weatherParams.get("pressure").innerHTML = `${jsonData.pressure} mb`;
  weatherParams.get("humidity").innerHTML = `${jsonData.humidity}%`;
  weatherParams.get("coords").innerHTML = `[${jsonData.coords.lat}, ${jsonData.coords.lon}]`;
}

function fillHeader(flag) {
  let cityName, tempCelsius, icon;
  let headerInfo = {
    cityName,
    tempCelsius,
    icon,
  };

  let temp = document.getElementById("fav-tmp").content;

  if (!flag) {
    headerInfo.cityName = document.querySelector("#current-city-name");
    headerInfo.tempCelsius = document.querySelector("#current-city > div > div > p");
    headerInfo.icon = document.querySelector("#current-city > div > div > img");
  } else {
    headerInfo.cityName = temp.querySelector("div > div > div > h3");
    headerInfo.tempCelsius = temp.querySelector("div > div > div > p");
    headerInfo.icon = temp.querySelector("div > div > div > img");
  }

  return headerInfo;
}

async function initCurr() {
  load(document.querySelectorAll("section")[0], document.querySelector("main"));

  if (navigator.geolocation) {
    console.log("Geolocation success");

    navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
  } else {
    console.log("Geolocation is unavailable at your browser/OS");

    defaultJson = await getApiResponse(localStorage.getItem("defaultCity"));
    fillParams(defaultJson, elemId);
  }
}

async function successCallBack(position) {
  const currResponse = await fetch(uriSample + `/weather/coordinates?lat=${position.coords.latitude}&long=${position.coords.longitude}`, {
    method : "GET"
  });

  const currJson = await currResponse.json();
  fillParams(currJson, 0);

  return currJson;
}
  
async function errorCallBack() {
  const currResponse = await fetch(uriSample + `/weather/city?q=${defaultCity}`, {
    method : "GET"
  });
  
  const currJson = await currResponse.json();
  fillParams(currJson, 0);

  return currJson;
}

async function addFav() {
  event.preventDefault();
  const cityField = document.querySelector("#add-city-field");
  const newCity = cityField.value.trim().toLowerCase();
  cityField.value = "";

  if (newCity !== "") {
    
    try {
      let bodyData = {
        "cityName" : toUpperFirst(newCity)
      }

      const favResponse = await fetch(uriSample + "/favourites", {
        method : "POST",
        headers : {
          'Content-Type': 'application/json; charset=utf-8'
        },
        mode : 'cors',
        body : JSON.stringify(bodyData)
      });
      
      const fav = await fetch(uriSample + "/weather/city?q="+ newCity, {
        method : "GET"
      });

      const favJson = await fav.json();

      if (favResponse.status === 409) {
        window.alert(
          `This city (${toUpperFirst(
            newCity
          )}) is already in your favourites list.`
        );
      } else {
        await generateCard(favJson);
      }
    } catch (err) {
      window.alert(
        `This city (${toUpperFirst(newCity)}) doesn't exist. Try again`
      );
    }
  }
}

function load(selector, parentSelector) {
  var currValSelector;
  var loaderTemp = document.getElementById("load-tmp").content;
  var loaderClone = loaderTemp.querySelector("div").cloneNode(true);
  var loaderSelector;
  loaderClone.id = "curr-loader";
  
  currValSelector = selector;
  let parent = parentSelector;
  let loader = parent.insertBefore(loaderClone, currValSelector);

  loaderSelector = document.getElementById("curr-loader");
  
  loaderSelector.style.display = "block";
  currValSelector.style.display = "none";
  

  setTimeout(() => {
    currValSelector.style.display = "grid";
    loaderSelector.style.display = "none";
    // console.log(parent)
    parent.removeChild(loaderSelector);
  }, 1300);
  
}

initCurr();
initFavs();