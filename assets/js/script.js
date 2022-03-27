const WEATHER_API_KEY = "efce923fdeaa8b3017a1d2da22a5ca95";
const WEATHER_API = "https://api.openweathermap.org";
const defaultCoords = { lat: 33.625274, lon: -112.21869 };
const NPS_API = "https://developer.nps.gov/api/v1/parks";
const NPS_API_KEY = "P7v76VxhVDmo5rOLwAyEnDqiIYeclDPZgcT0CdBK";

$(document).on('ready', () => {
  location.hash = ''
})

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
  const request = await fetch(url).then((res) => res.json()).catch((err) => console.log(err));
  return request;
};

const fetchWeather = async (lat, lon) =>
  await handleRequest(getWeatherUrl(lat, lon));

const fetchParks = async (state) => {
  let parksResponse = await handleRequest(getParkUrl(state)).then((res) => res.data);
  return parksResponse;
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
  console.log(park)
  const parkImage = park.images.find((image) => image?.credit.includes("NPS"));
  $(".park-name").text(park.fullName);
  $(".weather-description").text(park.weatherInfo);
  $(".park-photo").attr("src", parkImage?.url || "");
  $('#coords').text(`${park.latitude},${park.longitude}`);
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
  $(".nationalParkListContainer").append(parkElement);
};

//displays parks in each state
const displayParks = (parks) => {
  //clears past search results
  $(".nationalParkListContainer").empty();
  parks.forEach(createParkListItem);
};

const displayBookmarkParks = (parks) => {
  //clears past search results
  // $(".nationalParkListContainer").empty();
  parks.forEach(createParkListItem);
};
//event listener on search button
$(".searchBtn").on("click", async function () {
  location.hash = 'search';
  $('.searchBtn').addClass('border border-red');
  $('.seeFavesBtn').removeClass('border border-red');
  const searchState = $("#state").val();
  const parks = await fetchParks(searchState);
  displayParks(parks);
  console.log(parks);
});

// first - add a favorites button and make a new method to do the second part
// second - when click on the favorites clear the park list - probably parklistcontainer.empty as above in displayparks method
// third - try to see if you can call displayparks within the favebtn click event

$('.seeFavesBtn').on('click', () => {
  location.hash = '#favorites'
  $('.seeFavesBtn').addClass('border border-red');
  $('.searchBtn').removeClass('border border-red');
  const stringifiedBookmarks = localStorage.getItem('bookmarks'); // string at this point
  const stringifiedBookmarksToObject = JSON.parse(stringifiedBookmarks) || {}; // object at this point
  const savedBookmarks = stringifiedBookmarksToObject.bookmarks || []; // get the bookmark array or ise an empty array by default

  displayParks(savedBookmarks)
});

$('.faveBtn').on('click', () => {
  const stringifiedBookmarks = localStorage.getItem('bookmarks'); // string at this point
  const stringifiedBookmarksToObject = JSON.parse(stringifiedBookmarks) || {}; // object at this point
  let savedBookmarks = stringifiedBookmarksToObject.bookmarks || []; // get the bookmark array or ise an empty array by default

  const parkName = $('.park-name').text();
  const parkDescription = $('.weather-description').text();
  const parkPhoto = $('.park-photo').attr("src");
  const parkCoords = $('#coords').text().split(',');
  const isAlreadyInBookmarks = savedBookmarks.some((bookmark) => bookmark.fullName === parkName);
  // if the current park matches a park name in the bookmarks then remove that one

  if (parkName === '') return;
  if (isAlreadyInBookmarks) {
    savedBookmarks = savedBookmarks.filter((bookmark) => bookmark.fullName !== parkName);
    localStorage.setItem('bookmarks', JSON.stringify({ bookmarks: savedBookmarks }));
  } else {

    //else do what we are doing below
    // pretend this is data from api call
    const parkToSave = {
      fullName: parkName,
      weatherInfo: parkDescription,
      images: [{ credit: 'NPS', url: parkPhoto }],
      latitude: parkCoords[0],
      longitude: parkCoords[1]
    };

    savedBookmarks = savedBookmarks.concat(parkToSave);

    localStorage.setItem('bookmarks', JSON.stringify({ bookmarks: savedBookmarks }));
  }

  // if you are in favorites page call display, but don't if you are not
  if (location.hash === '#favorites') {
    displayParks(savedBookmarks)
  }
})

function myFunc() {
  //Get place name and store it to place var
  var savedPark = document.getElementById("current-park").innerHTML

  //Switch button to display save/delete bookmark
  var button = document.getElementById("button")
  if (button.innerHTML == "Delete") {
    button.innerHTML = "Save"

    //code runs when "delete" is pressed
    var bookmarks = localStorage.getItem("bookmarks")

    //convert bookmarks into array by using .split
    bookmarks = bookmarks.split(",   ")

    //remove last item using bookmarks.pop()
    bookmarks.pop()

    // set into localStorage
    localStorage.setItem("bookmarks", bookmarks)
    console.log(bookmarks)
    console.log("deleted")
  } else {
    //code runs when "save" button is clicked
    button.innerHTML = "Delete"
    //check if localStorage is empty
    var bookmarks = localStorage.getItem("bookmarks")

    if (bookmarks === null) {
      //if localStorage "bookmarks" has nothing, save place name in it
      localStorage.setItem("bookmarks", place)
    } else {
      //if localStorage "bookmarks" has something, push place name into the array
      var array = []
      array.push(bookmarks)
      array.push(place)

      // set updated array into localStorage "bookmarks"
      localStorage.setItem("bookmarks", array)
      console.log(bookmarks)
      console.log("saved")

    }
  }
}