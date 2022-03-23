//nps api key P7v76VxhVDmo5rOLwAyEnDqiIYeclDPZgcT0CdBK
var searchState;
var parkData;

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
      parkData = data.data;
      displayParks(parkData);
    });
};

//displays parks in each state
var displayParks = function (parks) {
  //clears past search results
  $(".placeholderContainer").empty();
  for (var i = 0; i < parks.length; i++) {
    var listPark = document.createElement("div");
    listPark.textContent = parkData[i].fullName;
    $(".placeholderContainer").append(listPark);
  }
};

var getState = function () {
  $(".searchBtn").on("click", function () {
    searchState = $("#state").val();
    console.log(searchState);
    getPark();
  });
};
getState();

//when state name is entered, a list of parks in the state is displayed in div
//when park is clicked, it gets park n ame and returns data from the clicked event (using event.target) most likely
