const apikey = "6875873f551141e0b2f92726253006";  //API key for auth...

//check network connectivity
window.addEventListener("offline", () => {
  alert("Network disconnected");
});


//initialial point of control for search query..................
document.getElementById("getcity").addEventListener("click", () => {
  const loc = document.getElementById("city").value;
  const rem = document.getElementById("current");

  if (rem.childNodes.length !== 0) {
    rem.replaceChildren();
  }

  const rem1 = document.getElementById("forecast");
  while (rem1.children.length > 0) {
    rem1.removeChild(rem1.lastElementChild);
  }

  if (loc === "") {
    alert("Please enter city name...");
  } else {
    getCurData(loc);
    ForecastData(loc);
    document.getElementById("city").value = "";
    document.getElementById("current").style.display = "flex";
    document.getElementById("forecast").style.display = "flex";
  }
});


//get weatherdata using geolocation............
document.getElementById("getloc").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const geoloc = `${lat},${lon}`;

      if (geoloc !== "") {
        const rem = document.getElementById("current");
        if (rem.childNodes.length !== 0) {
          rem.replaceChildren();
        }

        const rem1 = document.getElementById("forecast");
        while (rem1.children.length > 0) {
          rem1.removeChild(rem1.lastElementChild);
        }

        getCurData(geoloc);
        ForecastData(geoloc);
        document.getElementById("current").style.display = "flex";
        document.getElementById("forecast").style.display = "flex";
      }
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for location.");
          break;
        case error.POSITION_UNAVAILABLE:
          oalert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
      }
    }
  );
});

//add dropdown on event............................
document.getElementById("city").addEventListener("click", () => {
  let items = JSON.parse(sessionStorage.getItem("searchedLocations")) || [];
  if (items.length > 0) {
    showList();
  }
});

//remove dropdown on event.........................
document.getElementById("city").addEventListener("blur", () => {
  let element = document.getElementById("locationDropdown");
  element.style.display = "none";
});

//current forecast data for requested city............
async function getCurData(loc) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${loc}&aqi=no`
    );
    if (response.ok) {
      const data = await response.json();
      addtoList(loc);
      addData(data);
    } else {
      const data = await response.json();
      alert(`${data.error.message}`);
    }
  } catch (error) {
    alert(error);
  }
}

//5 day forecast for requested city.................
async function ForecastData(loc) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${loc}&days=6&aqi=no&alerts=no`
    );
    if (response.ok) {
      const data = await response.json();
      addForecast(data);
    }
  } catch (error) {
    alert(error);
  }
}

//display current forecast data.....................
function addData(data) {
  const element = document.getElementById("current");
  const content = document.createElement("div");
  content.id = "body";
  element.appendChild(content);

  const body = document.getElementById("body");
  const head = document.createElement("h3");
  head.innerHTML = data.location.name;
  const s1 = document.createElement("p");
  s1.innerHTML = `Temp: ${data.current.temp_c}`;
  const s2 = document.createElement("p");
  s2.innerHTML = `Wind: ${data.current.wind_kph}`;
  const s3 = document.createElement("p");
  s3.innerHTML = `Humidity: ${data.current.humidity}`;
  const icon = document.createElement("img");
  icon.src = data.current.condition.icon;

  body.appendChild(head);
  body.appendChild(icon);
  body.appendChild(s1);
  body.appendChild(s2);
  body.appendChild(s3);
}

//display 5day forecast data......................
function addForecast(data) {
  for (let item in data.forecast.forecastday) {
    if (item != "0") {
      const element = document.getElementById("forecast");
      const content = document.createElement("div");
      content.className = "body1";
      element.appendChild(content);

      const body = document.getElementsByClassName("body1");
      const head = document.createElement("h3");
      head.innerHTML = data.forecast.forecastday[item].date;
      const s1 = document.createElement("p");
      s1.innerHTML = `Temp: ${data.forecast.forecastday[item].day.avgtemp_c}`;
      const s2 = document.createElement("p");
      s2.innerHTML = `Wind: ${data.forecast.forecastday[item].day.maxwind_kph}`;
      const s3 = document.createElement("p");
      s3.innerHTML = `Humidity: ${data.forecast.forecastday[item].day.avghumidity}`;
      const icon = document.createElement("img");
      icon.src = data.forecast.forecastday[item].day.condition.icon;

      body[item - 1].appendChild(head);
      body[item - 1].appendChild(icon);
      body[item - 1].appendChild(s1);
      body[item - 1].appendChild(s2);
      body[item - 1].appendChild(s3);
    }
  }
}

//add location to local storage list.......................

function addtoList(item) {
  let items = JSON.parse(sessionStorage.getItem("searchedLocations")) || [];
  if (items.length > 0) {
    if (!items.includes(item)) {
      items.push(item);
    }
  } else {
    items.push(item);
  }
  sessionStorage.setItem("searchedLocations", JSON.stringify(items));
}

//Display dropdown from local storage list..............................
function showList() {
  const element = document.getElementById("locationDropdown");
  element.innerHTML = "";

  let items = JSON.parse(sessionStorage.getItem("searchedLocations")) || [];
  if (items.length > 0) {
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      element.appendChild(option);
    });
  }

  element.style.display = "block";
}
