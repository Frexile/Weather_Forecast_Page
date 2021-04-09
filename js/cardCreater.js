async function createCard(city) {
    var temp = document.getElementById("fav-tmp").content;
    // var jsonData = city;

    var coords = fillData(city, 1); //remove

    const clone = temp.querySelector("div").cloneNode(true);
    var favourites = document.querySelector("#fav-cities");

    document.getElementById("fav-cities").appendChild(clone);

    clone.querySelector("button").onclick = () => {
        favourites.removeChild(clone);
    
        const favCities = new Map(JSON.parse(localStorage.cities));
        console.log("COORDS BEFORE REMOVE", coords)
        favCities.delete(coords)
        // favCities.delete(city);
    
        localStorage.cities = JSON.stringify([...favCities]);
    };
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

    console.log(localStorage.cities)
    var coords = `${location.lat},${location.lon}`
    console.log(coords)

    header.cityName.innerHTML = location.name;
    header.tempCelsius.innerHTML = current.temp_c + "&#176";
    header.icon.src = current.condition.icon;

    weatherParams = setSelectors(elemId);

    weatherParams.get("wind").innerHTML = `${current.wind_dir}, ${current.wind_mph} m/s`;
    weatherParams.get("cloud").innerHTML = `${current.cloud}%`;
    weatherParams.get("pressure").innerHTML = `${current.pressure_mb} mb`;
    weatherParams.get("humidity").innerHTML = `${current.humidity}%`;
    weatherParams.get("coords").innerHTML = `[${location.lat}, ${location.lon}]`;

    return coords;
}