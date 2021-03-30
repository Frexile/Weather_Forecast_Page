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

async function showContent() { 
    event.preventDefault();
    var temp = document.getElementById("fav-tmp").content;
    var londonJson = await getApiResponse("London"); 
    fillData(londonJson)

    var copyHTML = document.importNode(temp, true);
    document.getElementById("fav-cities").appendChild(copyHTML);

    
    
}

async function successCallBack(position){
    var currData = {};
    // currPos = await position;
    weatherDesc.set("city", `${position.coords.latitude},${position.coords.longitude}`);

    currData = await getApiResponse(weatherDesc.get("city"))
    
    console.log(currData.current)
    console.log('fill data...')
    fillData(currData)
    console.log("json in succsessCallback()",fillData(currData))
    return currData
}

function errorCallBack(){
    weatherDesc.set("city", "Saint-Petersburg");
    console.log(getApiResponse(weatherDesc.get("city")));
    return getApiResponse(weatherDesc.get("city"));
}


async function main(){

    console.log("nav is working...")
    navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);


    console.log("nav is done")
    console.log(weatherDesc.get("city"))


    weatherDesc.set("city", "UFA");

    console.log(weatherDesc.get("city"))
}

// function buildCurrent(){
//     var currentCity = document.getElementById("current-city")

//     console.log(currentCity)

//     currentCity.innerHTML = 
// }

function fillData(jsonData){
    const current = jsonData.current;
    const location = jsonData.location;
    
    var currentCity = document.getElementById("current-city-name")
    console.log("json in fillData()",jsonData)

    currentCity.innerHTML = location.name

    weatherParams = setSelectors(1);

    
    var deg = document.querySelector("#current-city > div > div > p")
    deg.innerHTML = current.temp_c + '&#176'

    var pic = document.querySelector("#current-city > div > div > img")
    pic.src = current.condition.icon


    weatherParams.get("wind").innerHTML = `${current.wind_dir},${current.wind_kph}`
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
main()
//buildCurrent()
// fillData(getApiResponse("Moscow"))