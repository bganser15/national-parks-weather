const API_KEY = "efce923fdeaa8b3017a1d2da22a5ca95";
const BASE_URL = "https://api.openweathermap.org/data/2.5/onecall";
const BASE_URLTWO = "https://api.openweathermap.org";
const defaultCoords = { lat: 33.625274, lon: -112.21869 };

//nps api key P7v76VxhVDmo5rOLwAyEnDqiIYeclDPZgcT0CdBK
var searchState;
var parkData;
let selectedParkData;

var getPark = function () {
  var nationalParksUrl =
    "https://developer.nps.gov/api/v1/parks?stateCode=" +
    searchState +
    "&stateCode=&limit=20&start=0&sort=&api_key=P7v76VxhVDmo5rOLwAyEnDqiIYeclDPZgcT0CdBK";
  fetch(nationalParksUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data, "this is the api");
      parkData = data.data;
      displayParks(parkData);
      return parkData;
    });
};

let displayInfo = function (data) {
  console.log(data, "should only have some data");
};

//displays parks in each state
var displayParks = function (parks) {
  //clears past search results
  $(".placeholderContainer").empty();
  for (var i = 0; i < parks.length; i++) {
    var listPark = document.createElement("button");
    //gives each item an id equal to the loop iterator
    listPark.setAttribute("id", i);
    //add class for styling
    listPark.setAttribute("class", "park-list");
    listPark.setAttribute("lat", parkData[i].latitude);
    listPark.setAttribute("long", parkData[i].longitude);

    listPark.textContent = parkData[i].fullName;
    $(".placeholderContainer").append(listPark);
  }

  $(".park-list").on("click", function (event) {
    let parkClicked = event.target;
    parkClicked = $(this).attr("id");
    displayInfo(parkData[parkClicked]);
  });
};

var getState = function () {
  $(".searchBtn").on("click", function () {
    searchState = $("#state").val();
    console.log(searchState);
    getPark();
  });
};
displayParks();

//weather api code starts

$(document).ready(() => {
  // Initial data fetch
  fetchWeather();
});

// easy way to reuse and build the url

const getUrl = (lat, lon) => {
  const urlLat = lat || defaultCoords.lat;
  const urlLon = lon || defaultCoords.lon;
  return `${BASE_URL}?units=imperial&lat=${urlLat}&lon=${urlLon}&appid=${API_KEY}`;
};

const fetchWeather = async (lat, lon) => {
  return await fetch(getUrl())
    .then((res) => res.json())
    .then((res) => $(".data-json").append(JSON.stringify(res, null, 2)))
    .catch((err) => console.error("WEATHER ERR: ", err));
};

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
  return `${BASE_URL}/data/2.5/onecall?units=imperial&lat=${urlLat}&lon=${urlLon}&appid=${API_KEY}`;
};

/**
 *
 * @param city: city desired - default from defaultCity
 * @returns url api string with latitude and longitude appended
 */
const getGeoCodeUrl = (city) => {
  const urlCity = city || defaultCity;
  return `${BASE_URL}/geo/1.0/direct?q=${urlCity}&appid=${API_KEY}`;
};

const handleRequest = async (url) => {
  const request = await fetch(url).catch((err) => console.log(err));
  return await request.json();
};

const fetchWeather = async (lat, lon) => {
  return await handleRequest(getWeatherUrl(lat, lon));
};
// add js docs later
const fetchLatitudeLongitude = async (city) => {
  return await handleRequest(getGeoCodeUrl(city));
};

const fetchCityWeather = async (city) => {
  const cityLatLon = (await fetchLatitudeLongitude(city))[0];
  const cityWeather = await fetchWeather(cityLatLon.lat, cityLatLon.lon);
  return { name: cityLatLon.name, ...cityWeather };
};
const setCityDetails = (cityData) => {
  // console.log(cityData.icon)
  const iconUrl = `https://openweathermap.org/img/wn/${cityData.icon}@2x.png`;
  console.log(iconUrl);
  $(".city").text(cityData.name);
  $(".date").text("Date: " + cityData.date);
  $(".temp").text("Temp: " + cityData.temp + "°");
  $(".wind-speed").text("Wind Speed: " + cityData.windSpeed + " mph");
  $(".humidity").text("Humidity: " + cityData.humidity + "%");
  $(".icon").attr("src", iconUrl);

  $("img").css({
    height: "100px",
    width: "100px",
    "background-color": "rgba(255, 255, 255, 0.76)",
    "border-radius": "10px",
    border: "solid 2px rgb(118, 118, 118)",
  });
  // clearing container

  var uvButton = document.createElement("button");
  uvButton.setAttribute("class", "btn");

  if (cityData.uv < 3) {
    uvButton.classList.add("btn-success");
  } else if (cityData.uv < 7) {
    uvButton.classList.add("btn-warning");
  } else {
    uvButton.classList.add("btn-danger");
  }
  uvButton.textContent = cityData.uv;
  $(".uv").append(uvButton);
};

const getCurrentDate = () => {
  const date = new Date();
  const [month, day, year] = [
    date.getMonth(),
    date.getDate(),
    date.getFullYear(),
  ];
  return `${month + 1}/${day}/${year}`;
};

const handleCitySearch = async () => {
  const city = $(".form-input").val();
  const cityWeather = await fetchCityWeather(city);
  console.log(cityWeather);
  console.log(city);
  setCityDetails({
    name: cityWeather.name,
    date: getCurrentDate(),
    temp: cityWeather.current.temp,
    windSpeed: cityWeather.current.wind_speed,
    uv: cityWeather.current.uvi,
    humidity: cityWeather.current.humidity,
    icon: cityWeather.current.weather[0].icon,
  });
};

// fetchCityWeather("Phoenix");
$(".fa-search").click(() => handleCitySearch());
