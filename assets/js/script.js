//nps api key P7v76VxhVDmo5rOLwAyEnDqiIYeclDPZgcT0CdBK

var nationalParksUrl =
  "https://developer.nps.gov/api/v1/parks?stateCode=NM&stateCode=&limit=20&start=0&sort=&api_key=P7v76VxhVDmo5rOLwAyEnDqiIYeclDPZgcT0CdBK";

fetch(nationalParksUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
