const apikey = "6875873f551141e0b2f92726253006";

document.getElementById("getcity").addEventListener("click", () => {
  const loc = document.getElementById("city").value;

  if (loc !== "") {
    const rem = document.getElementById("current");
    if (rem.childNodes.length !== 0) {
      rem.replaceChildren();
    }

    const rem1 = document.getElementById("forecast");
    while (rem1.children.length > 1) {
      rem1.removeChild(rem1.lastElementChild);
    }

    getCurData(loc);
    ForecastData(loc);
  }
});

//current forecast data for requested city
async function getCurData(loc) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${loc}&aqi=no`
    );
    if (response.ok) {
      const data = await response.json();
      addData(data);
    }
  } catch (error) {
    console.log(error);
  }
}

//5 day forecast for requested city
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
    console.log(error);
  }
}

//display current forecast data
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

//display 5day forecast data
function addForecast(data) {
  const element = document.getElementById("forecast");
  const heading = document.createElement("h3");
  heading.innerHTML = data.location.name;
  element.appendChild(heading);

  for (let item in data.forecast.forecastday) {
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

    body[item].appendChild(head);
    body[item].appendChild(icon);
    body[item].appendChild(s1);
    body[item].appendChild(s2);
    body[item].appendChild(s3);
  }
}
