function initStorage() {
    var defaultFavourites = [ ["55.75,37.62", "moscow"], ["40.71,-74.01", "new-york"] , 
                              ["51.52,-0.11", "london" ], ["35.69,139.69", "tokyo" ] ];
  
    let defFav = new Map(defaultFavourites)
  
    if (localStorage.getItem("defaultCity") === null) {
      localStorage.setItem("defaultCity", "Moscow");
    }
  
    if (localStorage.getItem("cities") === null) {
      localStorage.cities = JSON.stringify(defaultFavourites);
    }
}

async function initCurrent() {
    var elemId = 0;
    load(0);
    if (navigator.geolocation) {
      console.log("Geolocation success");
      navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
    } else {
      console.log("Geolocation is unavailable at your browser/OS");
      defaultJson = await getApiResponse(localStorage.getItem("defaultCity"));
      fillData(defaultJson, elemId);
    }
}

async function successCallBack(position) {
    var currData = {};

    currData = await getApiResponse(`${position.coords.latitude},${position.coords.longitude}`);
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

async function initFavourites() {
    var savedFavourites = JSON.parse(localStorage.cities);
    load(1)

    let weatherResponses = await Promise.all(savedFavourites.map((item) => 
        getApiResponse(item)
    ));
    
    console.log(weatherResponses)

    for (let i = 0; i < weatherResponses.length; i++) {
        // console.log(savedFavourites[i])
        createCard(weatherResponses[i]);
    }
}