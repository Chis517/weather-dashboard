var API_KEY = '5da404477baa8d243c35d8549ebcfaae'
var searchBtn = document.getElementById('btn')
var currentContainer = document.getElementById('current')
var fiveDayContainer = document.getElementById('forecast')
var historyContainer = document.getElementById('history')

searchBtn.addEventListener('click', getCity)

function getCity() {
  var currentCity = document.getElementById('city-input').value
  currentForecast(currentCity)
saveHistory(currentCity)
};

function saveHistory(city) {
  var storage = JSON.parse(localStorage.getItem('weatherHistory'))
  if (storage === null) {
    storage = []
  }
  storage.push(city)
  localStorage.setItem('weatherHistory', JSON.stringify(storage))
  searchHistory()
};

function searchHistory() {
  var currentStorage = JSON.parse(localStorage.getItem('weatherHistory'))
  if (currentStorage === null) {
    historyContainer.textContent = 'No current weather history'
  } else {
    historyContainer.textContent = ''
    for (var i = 0; i < currentStorage.length; i++) {
      var historyBtn = document.createElement('button')
      historyBtn.setAttribute('id', currentStorage[i])
      historyBtn.textContent = currentStorage[i]
      historyContainer.append(historyBtn)

      historyBtn.addEventListener('click', function(event) {
        currentForecast(event.target.id)
      })
    }
  }
}

searchHistory()

function currentForecast(city) {
  currentContainer.textContent = ''
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + API_KEY + '&units=imperial')
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log('current', data);

      var lat = data.coord.lat
      var lon = data.coord.lon
      getFiveDay(lat, lon)
      getUVI(lat, lon)

      var currentCity = document.createElement('h2')
      currentCity.textContent = data.name
      currentContainer.prepend(currentCity)

      var temp = document.createElement('p')
      temp.textContent = 'Temp: ' + data.main.temp + '˚F'
      currentContainer.append(temp)

      var wind = document.createElement('p')
      wind.textContent = 'Wind: ' + data.wind.speed + ' MPH'
      currentContainer.append(wind)

      var humidity = document.createElement('p')
      humidity.textContent = 'Humidity: ' + data.main.humidity + ' %'
      currentContainer.append(humidity)
    });
};

function getFiveDay(lat, lon) {
  fiveDayContainer.textContent = ''
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=imperial')
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log('5 day', data);

      var fiveDayHead = document.createElement('h3')
      fiveDayHead.textContent = "5-Day Forecast:"
      fiveDayContainer.prepend(fiveDayHead)

      for (var i = 0; i < 5; i++) {
        var card = document.createElement('div')
        fiveDayContainer.append(card)

        var day = document.createElement('h3')
        day.textContent = moment().add(i + 1, 'days').format('dddd')
        card.append(day)

        var date = document.createElement('h3')
        date.textContent = moment().add(i + 1, 'days').format('L')
        card.append(date)

        var icon = document.createElement('img')
        icon.setAttribute('src', 'https://openweathermap.org/img/w/' + data.daily[i].weather[0].icon + '.png')
        card.append(icon)

        var fiveDayTemp = document.createElement('p')
        fiveDayTemp.textContent = 'Temp: ' + data.daily[i].temp.day + '˚F'
        card.append(fiveDayTemp)

        var fiveDayWind = document.createElement('p')
        fiveDayWind.textContent = 'Wind: ' + data.daily[i].wind_speed + ' MPH'
        card.append(fiveDayWind)

        var fiveDayHumid = document.createElement('p')
        fiveDayHumid.textContent = 'Humidity: ' + data.daily[i].humidity + ' %'
        card.append(fiveDayHumid)
      };
    });
};

function getUVI(lat, lon) {
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=imperial')
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      var uv = document.createElement('p')
      uv.textContent = 'UV Index: ' + data.current.uvi
      currentContainer.append(uv)
    });
};