async function addFavourite() {
    event.preventDefault();
    const cityField = document.querySelector("#add-city-field");
    const newCity = cityField.value.trim().toLowerCase();
    cityField.value = "";
  
    if (newCity !== "") {
      var currFavourites = new Set(JSON.parse(localStorage.cities));
  
      try {
        if (!currFavourites.has(newCity)) {
          await createCard(newCity);
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