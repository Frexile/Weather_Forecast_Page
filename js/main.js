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

function load() {
  const currValSelector = document.querySelectorAll("section")[0];
  const loaderSelector = document.querySelector("body > main > div");
  currValSelector.style.display = "none";
  // currValSelector.classList.add("hidden");
  loaderSelector.classList.remove("hidden");

  setTimeout(() => {
    loaderSelector.classList.add("hidden");
    currValSelector.style.display = "grid";
  }, 1000);
}

async function main() {
  initStorage();
  initCurrent();
  initFavourites();
}

main();