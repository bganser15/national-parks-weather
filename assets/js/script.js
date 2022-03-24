const API_KEY = "efce923fdeaa8b3017a1d2da22a5ca95";
const BASE_URL = "https://api.openweathermap.org/data/2.5/onecall";
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

$(document).ready(() => {
  // Initial data fetch
  fetchWeather();
});

// easy way to reuse and build the url
/**
 *
 * @param lat: latitude desired - default from defaultCoords
 * @param long: longitude desired - default from defaultCoords
 * @returns Promise<whatever the data is>
 */
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
