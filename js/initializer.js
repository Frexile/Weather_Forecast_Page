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
    // console.log(savedFavourites)
    // await Promise.all(savedFavourites.map((item) => {
    //     console.log(item)
    //     createCard(item[1]);
    // }))

    for (let i = 0; i < savedFavourites.length; i++) {
        // console.log(savedFavourites[i])
        createCard(savedFavourites[i]);
    }
}