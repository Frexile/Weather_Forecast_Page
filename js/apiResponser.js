const apiKey = "c3e933801amsh831c38a46c3a0a7p1eef72jsnc9db1c1d58c7";
const apiHost = "weatherapi-com.p.rapidapi.com";
const urlSample = "https://weatherapi-com.p.rapidapi.com/current.json?q=";

async function getApiResponse(cityIdentifier) {
  console.log(urlSample + cityIdentifier)
  const response = await fetch(urlSample + cityIdentifier, {
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    },
  });

  return response.json();
}