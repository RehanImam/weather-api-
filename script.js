const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially variables need ??

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

// ek kam or pending hai

function switchTab(newTab){
  if(newTab != oldTab){
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
      // kya search form eala container is invisible ,if yes then make it is visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }
    else{
      // main pehle search wala tab pr tha ,ab wour weather tab visible krna hai
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // ab mai you weather tab me aagya hu,toh weather bhi display krna poadega,so ets check local storage first
      // for coordinates ,if we haves them there 
      getfromSessionStorage();
  }
}
}


userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
});

// checked if coordinates are already present insession storage
function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates")
  if(!localCoordinates){
    // agar local coordinates nahi Mile
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates = JSON.parse(localCoordinates)
    fetchUserWearherInfo(coordinates)
  }
}

async function fetchUserWearherInfo(coordinates) {
  const {lat,lon} = coordinates;
  // make grantcontainer onvisible
  grantAccessContainer.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  // api call
  try{
    const response = await fetch(
        // `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//         `https://api.openweathermap.org/data/2.5/weather?lat=28.6139&lon=77.2520621&appid=d1845658f92b31c64bd94f06f7188c9c&units=metric
// `
    );
    
      const data = await response.json();

      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
  }
  catch(err){
    loadingScreen.classList.remove("active");
  //  hw
  }
}



function renderWeatherInfo(weatherInfo){
  // firstly ,we have to fatch the elment

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudness = document.querySelector("[data-cloudiness]");

  //fetch values from weatherInfo object and put it UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp ?? 'N/A'} ° C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed ?? 'N/A'} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity ?? 'N/A'} %`;
  cloudness.innerText = `${weatherInfo?.clouds?.all ?? 'N/A'} %` ;


}

function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    //hw - show an alert for geolocation available
  }
}

function showPosition(position){

  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWearherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]")
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if(cityName ==="")
    return;
  else
      fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active")
  grantAccessContainer.classList.remove("active")

  try{
    const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
  
     const data = await response.json();
     loadingScreen.classList.remove("active");
     userInfoContainer.classList.add("active");
     renderWeatherInfo(data);
  }
  catch(err){
    //hw
  }
}



  