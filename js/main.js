const apiKey = "c3e933801amsh831c38a46c3a0a7p1eef72jsnc9db1c1d58c7";
const apiHost = "weatherapi-com.p.rapidapi.com";
const urlSample = "https://weatherapi-com.p.rapidapi.com/current.json?q=";

var weatherDesc = new Map();
var currPos;

weatherDesc.set("city", "Moscow");

async function getApiResponse(cityIdentifier) {
    const response = await fetch(urlSample + cityIdentifier,{
        "method": "GET",
        "headers": {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": apiHost
        }
    })

    return response.json();
}

async function showContent(city) { 
    // event.preventDefault();
    var temp = document.getElementById("fav-tmp").content;
    var jsonData = await getApiResponse(city); 
    fillData(jsonData, 1)//remove 

    var copyHTML = document.importNode(temp, true);
    

    const clone = temp.querySelector("div").cloneNode(true);
    
    // console.log(clone)
    var favourites = document.querySelector("#fav-cities")
    // console.log(favourites)

    document.getElementById("fav-cities").appendChild(clone);

    clone.querySelector('button').onclick = () => {
        favourites.removeChild(clone)

        const favCities = new Set(JSON.parse(localStorage.cities));
        favCities.delete(city)

        localStorage.cities = JSON.stringify([...favCities])
    }

}

async function successCallBack(position){
    var currData = {};
    weatherDesc.set("city", `${position.coords.latitude},${position.coords.longitude}`);

    currData = await getApiResponse(weatherDesc.get("city"))
    fillData(currData, 0)
    
    return currData
}

async function errorCallBack(){
    weatherDesc.set("city", "Moscow");
    console.log("errorResponse", getApiResponse(weatherDesc.get("city")));

    var currData = {};
    currData = await getApiResponse(weatherDesc.get("city"));
    fillData(currData, 0)
    return currData
}

function fillHeader(flag){
    var cityName, tempCelsius, icon;
    var headerInfo = {
        cityName, tempCelsius, icon
    }
    
    var temp = document.getElementById("fav-tmp").content;

    if (!flag){
        headerInfo.cityName = document.querySelector("#current-city-name")
        headerInfo.tempCelsius = document.querySelector("#current-city > div > div > p")
        headerInfo.icon = document.querySelector("#current-city > div > div > img")
    }
    else {
        headerInfo.cityName = temp.querySelector("div > div > div > h3")
        headerInfo.tempCelsius = temp.querySelector("div > div > div > p")
        headerInfo.icon =  temp.querySelector("div > div > div > img")
    }

    return headerInfo
}

function fillData(jsonData, elemId){
    const current = jsonData.current;
    const location = jsonData.location;
    // var flag = 0;
    
    var header = fillHeader(elemId);
    console.log(header)
    header.cityName.innerHTML = location.name;
    header.tempCelsius.innerHTML = current.temp_c + '&#176'
    header.icon.src = current.condition.icon

    weatherParams = setSelectors(elemId);//ключ задающий значение для curr/fav

    weatherParams.get("wind").innerHTML = `${current.wind_dir}, ${current.wind_mph} m/s`
    weatherParams.get("cloud").innerHTML = `${current.cloud}%`
    weatherParams.get("pressure").innerHTML = `${current.pressure_mb} mb`
    weatherParams.get("humidity").innerHTML = `${current.humidity}%`
    weatherParams.get("coords").innerHTML = `[${location.lat}, ${location.lon}]`
}

function setSelectors(flag){
    var descParams = ["wind", "cloud", "pressure", "humidity", "coords"];
    var listHTML;
    var temp = document.getElementById("fav-tmp").content;

    if (!flag) {
        listHTML = document.querySelector("#current-city > ul")
    }
    else {
        listHTML = temp.querySelector("div > ul")
    }

    var descSamples = new Map()

    for (let i = 0; i < descParams.length; i++) {
        var selector = `li:nth-child(${i + 1}) > p`;
        // console.log(`iter : ${i}`, selector)
        descSamples.set(descParams[i], listHTML.querySelector(selector));
    }

    return descSamples;
}


async function initCurrent(){
    var elemId = 0
  
    if (navigator.geolocation){
        console.log('geolocation sucksess')
        navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
    }
    else {
        console.log('geolocation is unavailable at your browser/OS');
        defaultJson = await getApiResponse(localStorage.getItem('defaultCity'));
        fillData(defaultJson, elemId)
    }

}

function initStorage(){
    var defaultFavourites = ["moscow", "new-york", "london", "tokio"]

    if (localStorage.getItem('defaultCity') === null) {
        localStorage.setItem('defaultCity', "Moscow")
    }

    if (localStorage.getItem('cities') === null) {
        localStorage.cities = JSON.stringify(defaultFavourites)
        // localStorage.setItem('cities', JSON.stringify(defaultFavourites))
    }
} 

function initFavourites(){
    var savedFavourites = JSON.parse(localStorage.cities);

    for (let i = 0; i < savedFavourites.length; i++) {
        showContent(savedFavourites[i])
    }
}

async function addFavourite(){
    event.preventDefault()
    const cityField = document.querySelector("#add-city-field");
    const newCity = cityField.value.trim().toLowerCase();
    cityField.value = ''
    
    if (newCity !== '') {
        var currFavourites = new Set(JSON.parse(localStorage.cities));
        
        try {
            if (!currFavourites.has(newCity)){
                await showContent(newCity)
                currFavourites.add(newCity)
            
                localStorage.cities = JSON.stringify([...currFavourites])
            } else {
                window.alert(`This city (${newCity}) is already in your favourites list.`)
            }
        } catch(err) {
            window.alert(`This city (${newCity}) doesn't exist. Try again`)
        }
    }
}

function load(){
    const currValSelector = document.querySelector("#current-city");
    const loaderHTML = document.getElementById('loader-tmp').content;
    const loaderCopy = loaderHTML.querySelector('div').cloneNode(true);
    
    currValSelector.style.display = 'none';
    console.log(loaderCopy)
    
    document.querySelector("body > main > div").insertBefore(loaderCopy, currValSelector)
    
}

async function main(){
    initStorage()
    initCurrent()
    initFavourites()
}


main()
