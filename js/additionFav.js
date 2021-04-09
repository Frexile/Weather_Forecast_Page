async function addFavourite() {
    event.preventDefault();
    const cityField = document.querySelector("#add-city-field");
    const newCity = cityField.value.trim().toLowerCase();
    cityField.value = "";
  
    if (newCity !== "") {
      var currFavourites = new Map(JSON.parse(localStorage.cities));
      console.log(currFavourites)

      

      try {
        let data = await getApiResponse(newCity);
        let currCoords = `${data.location.lat},${data.location.lon}`
        console.log("CURR COORDS", currCoords)
        console.log(currFavourites.has(currCoords))

        if (!currFavourites.has(currCoords)) {
          await createCard(data);

          currFavourites.set(currCoords, newCity)
          // currFavourites.add(newCity);
  
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