'use strict'

const searchUrl = 'https://app.ticketmaster.com/discovery/v2/events';
const apiKey = 'B4AiEGL0UQAYYeDXj6rMY2a8rq8qdRDt';
const eventType = 'sports'
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.length; i++) {
    $('#results-list').append(`
      <li><h3>${responseJson[i].name}</h3>
      <a href='${responseJson[i].url}'>${responseJson[i].url}</a>
      
      </li>
      `)
  };
  $('#results').removeClass('hidden');
}
function getSportsNearMeInfo(localCity, stateArr) {
  let dt = new Date().toISOString()
  //console.log (dt);
  let start = new Date();
  start.setHours(0, 0, 0, 0);

  function formatDate(whateverYouWant) {

    return whateverYouWant.toISOString().split('.')[0] + "Z"
  }

  let end = new Date();
  //console.log(start.toISOString().split('.')[0]+"Z" );
  //console.log(start.toISOString());
  //console.log(end.toISOString());
  end.setHours(23, 59, 59, 999);
  const params = {
    apikey: apiKey,
    city: localCity,
    stateCode: stateArr,
    classificationName: eventType,
    startDateTime: formatDate(start),
    endDateTime: formatDate(end),
    // new Date('').toISOString()

  };
  const queryString = formatQueryParams(params)
  const url = searchUrl + '?' + queryString;
  fetch(url)
    .then(response => {
      if (response.ok) {
        response.json().then(function (data) {
          if (data.length === 0) {
            console.log('hello');
            nothingToShow();

          }
          else {
            displayResults(data._embedded.events)
          }

          //displayResults(data._embedded.events)
        });
      }
    }).catch(err => {
      console.log('hello');
      nothingToShow();
      $('#js-error-message').text(`Something went wrong: ${err.message}`);

    });
}
//When user enters value on date that nothing is showing//
function nothingToShow() {
  console.log('failure');
  $('.fail-screen').show();
  $('.content').on('click', '.fail-screen', function () {
    $('#city').val('');
    $('#state').val('');
    $(this).hide('fast');
    $('.loading-screen').hide();
    $('.landing').show('fast');
  });
}
function watchForm() {

  $('form').submit(event => {

    event.preventDefault();

    const cityValue = $('#city').val();
    const stateValue = $('#state').val();


    getSportsNearMeInfo(cityValue, stateValue);

  });

}
$(watchForm);