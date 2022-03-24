const WEATHER_API_KEY = "efce923fdeaa8b3017a1d2da22a5ca95";
const WEATHER_API = "https://api.openweathermap.org";
const defaultCoords = { lat: 33.625274, lon: -112.21869 };
const NPS_API = "https://developer.nps.gov/api/v1/parks";
const NPS_API_KEY = "P7v76VxhVDmo5rOLwAyEnDqiIYeclDPZgcT0CdBK";

// easy way to reuse and build the url
/**
 *
 * @param lat: latitude desired - default from defaultCoords
 * @param long: longitude desired - default from defaultCoords
 * @returns url api string with latitude and longitude appended
 */
const getWeatherUrl = (lat, lon) => {
  const urlLat = lat || defaultCoords.lat;
  const urlLon = lon || defaultCoords.lon;
  return `${WEATHER_API}/data/2.5/onecall?units=imperial&lat=${urlLat}&lon=${urlLon}&appid=${WEATHER_API_KEY}`;
};

const getParkUrl = (state) =>
  `${NPS_API}?stateCode=${state}&limit=20&start=0&api_key=${NPS_API_KEY}`;

const handleRequest = async (url) => {
  const request = await fetch(url).catch((err) => console.log(err));
  return await request.json();
};

const fetchWeather = async (lat, lon) =>
  await handleRequest(getWeatherUrl(lat, lon));

const fetchParks = async (state) => {
  let parksResponse = await handleRequest(getParkUrl(state));
  return parksResponse.data;
};

const handleParkItemClick = async (park) => {
  const parkWeather = await fetchWeather(park.latitude, park.longitude);
  const {
    temp,
    wind_speed: windSpeed,
    humidity,
    weather,
  } = parkWeather.current;
  setWeatherDetails({
    temp,
    windSpeed,
    humidity,
    icon: weather[0].icon,
  });
  setParkDetails(park);
};

const setParkDetails = (park) => {
  const parkImage = park.images.find((image) => image?.credit.includes("NPS"));
  $(".park-name").text(park.fullName);
  $(".weather-description").text(park.weatherInfo);
  $(".park-photo").attr("src", parkImage?.url || "");
};

const setWeatherDetails = (parkWeather) => {
  const iconUrl = `https://openweathermap.org/img/wn/${parkWeather.icon}@2x.png`;
  $(".temp").text(parkWeather.temp + "°");
  $(".wind-speed").text(parkWeather.windSpeed + " mph");
  $(".humidity").text(parkWeather.humidity + "%");
  $(".icon").attr("src", iconUrl);
};

//creates button for each park list item
const createParkListItem = (park) => {
  const parkElement = document.createElement("button");
  parkElement.setAttribute("class", "park-list");
  parkElement.textContent = park.fullName;
  parkElement.onclick = () => handleParkItemClick(park);
  $(".placeholderContainer").append(parkElement);
};

//displays parks in each state
const displayParks = (parks) => {
  //clears past search results
  $(".placeholderContainer").empty();
  parks.forEach(createParkListItem);
};
//event listener on search button
$(".searchBtn").on("click", async function () {
  const searchState = $("#state").val();
  const parks = await fetchParks(searchState);
  displayParks(parks);
  console.log(parks);
});
