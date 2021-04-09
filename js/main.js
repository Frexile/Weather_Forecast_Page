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

function toUpperFirst(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function load(flag) {
  var currValSelector;
  var loaderTemp = document.getElementById("load-tmp").content;
  var loaderClone = loaderTemp.querySelector("div").cloneNode(true);
  var loaderSelector;

  if (flag === 0){
    loaderClone.id = "curr-loader"
    currValSelector = document.querySelectorAll("section")[0];
    document.querySelectorAll("section")[0].appendChild(loaderClone)
    
    loaderSelector = document.getElementById("curr-loader")

  } else if (flag === 1){
    loaderClone.id = "fav-loader"
    currValSelector = document.getElementById("fav-cities");
    // console.log(currValSelector)
    document.getElementById("fav-cities").appendChild(loaderClone)

    loaderSelector = document.getElementById("fav-loader")
  }
  console.log(loaderSelector)
  //loaderSelector  = document.querySelector("body > main > div");
  currValSelector.style.display = "none";
  // currValSelector.classList.add("hidden");
  loaderSelector.style.display = "block";
  // loaderSelector.classList.remove("hidden");

  setTimeout(() => {
    // loaderSelector.classList.add("hidden");
    loaderSelector.style.display = "none";
    currValSelector.style.display = "grid";
  }, 1000);
}

async function main() {
  initStorage();
  initCurrent();
  initFavourites();
}

main();