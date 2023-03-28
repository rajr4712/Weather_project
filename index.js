const userTab = document.querySelector("[data-userWeather]");                        //19loc in html
const searchTab = document.querySelector("[data-searchWeather]");                     //20 loc in html
const userContainer = document.querySelector(".weather-container");                  //24 loc in html

const grantAccessContainer = document.querySelector(".grant-location-container");     //28loc in html
const searchForm = document.querySelector("[data-searchForm]");                      //37 loc in html
const loadingScreen = document.querySelector(".loading-container");                  //47 loc in html
const userInfoContainer = document.querySelector(".user-info-container");             //55 loc in html

//initially vairables need????

//when load then by default your weather APP Tab(userTaB) display loc 53 in html 
let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");                /*old-tab(your weather tab ) me css style add in css file */ 
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {                         //new tab tab jis tab pe humne click kiya hai ,oldTab is "your weatherTab"
        oldTab.classList.remove("current-tab");     //its remove the weather tab text k background grey color (in mobile screenshot me check)
        oldTab = newTab;
        oldTab.classList.add("current-tab");        //if click on weather tab par hi then no remove add apply

        
  //if searchForm is not equal to active , then make it visible  
        if(!searchForm.classList.contains("active")) {           //searchFrom is varaible wch acess seacrh for city input wala tag and search image button
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");    //27 to 33  html file loc remove from screen in
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

//ADD A EVENT LISTNER ON YOUR WEATHER TAB 19 TO 21 AND SEARCH WEATHER TAB 24 TO 26 LOC
userTab.addEventListener("click", () => {          //UserTab is variable wch contain your weather tab check loc 2 in js 
    //pass clicked tab as input paramter to render
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);                         //searchTab is search weather wala tab
});


//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");       //then grantlocation(navigator) wala ui display
    }
    else {
        const coordinates = JSON.parse(localCoordinates);   
 //fecth user weather info is lat or longi k base par dega so call this function 
        fetchUserWeatherInfo(coordinates);                 //calling a function where pass cordinates to fetch
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
   
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");        //when weather details comes loading screen invisible
        userInfoContainer.classList.add("active");        //userinfoContainer wala ui screen visible
    //renderweatherInfo work data me store all value ko jo fetch api k through aaye wo userinfoContainer me display
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }

}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc all the elements to render(display) on your werather Ui, 
    //TO DISPLAY : ex- temp, windspeed,humidity,cloudness etc

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object (check:json formator and validator) and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

//its return the user latitide and longitude  and it puts in 39 and 40 line of code me(copy from w3 school*/
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {                  
    e.preventDefault();                                          //default kuch nhi karna hai
    let cityName = searchInput.value;

    if(cityName === "")                        //if cityName is equal to empty in input tag then return nothing to do
        return;
    else 
        fetchSearchWeatherInfo(cityName);       //if present (jo hum type krenge) then call function fetchSearchWeatherInfo(cityName),inloc158 me where cityNmae is passes
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}







// /*its return the user latitide and longitude  and it puts in 39 and 40 line of code above(copy from w3 school website*/
// function getLocation() {
//     if(navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);     /*showPosition is callback function */
//     }
//     else {
//         console.log("No geoLocation Support by browser");
//     }
// }

// function showPosition(position) {
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }

/*jst go to console and type - getLocation(); and press enter you can get your lat and long */