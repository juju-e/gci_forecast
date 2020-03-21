const api = `25392d6930b9a393b48cfd4373c5071e`;
let units = `metric`, place=``;
const   weatherDiv = document.getElementById(`weather`);
        city = document.getElementById(`location`),
        date = document.getElementById(`dt`),
        image = document.getElementById(`icon`),
        description = document.getElementById(`description`),
        temperature = document.querySelector(`#temperature > p`),
        humidity = document.querySelector(`#humidity > p`),
        sunrise = document.querySelector(`#sunrise > p`),
        sunset = document.querySelector(`#sunset > p`),
        wind = document.querySelector(`#wind > p`),
        direction = document.querySelector(`#direction > p`),
        cloudiness = document.querySelector(`#cloudiness > p`),
        uv = document.querySelector(`#uv > p`),
        uvInfo = document.querySelector(`#uv > #info`),
        searchBar = document.getElementById(`searchbar`),
        notFound = document.getElementById(`nope`),
        loading = document.getElementById(`loader`);
const icons = {
    2: "008-storm.svg",
    3: "016-drizzle.svg",
    5: "012-rain.svg",
    6: "011-snowy.svg",
    7: "015-fog.svg",
    781: "014-twister.svg",
    clearD : "010-sun.svg",
    clearN : "005-night.svg",
    cloudsD: "006-sunny.svg",
    cloudsN: "007-night-1.svg"
};
const uvLevels = [
    `<p>A UV Index reading of 0 to 2 means low danger from the sun's UV rays for the average person</p><p>>Wear sunglasses on bright days. If you burn easily, cover up and use broad spectrum SPF 30+ sunscreen. Bright surfaces, such as sand, water and snow, will increase UV exposure.</p>`,
    `<p>A UV Index reading of 3 to 5 means moderate risk of harm from unprotected sun exposure.</p><p>Stay in shade near midday when the sun is strongest. If outdoors, wear sun protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, will increase UV exposure.</p>`,
    `<p>A UV Index reading of 6 to 7 means high risk of harm from unprotected sun exposure. Protection against skin and eye damage is needed.</p><p>Reduce time in the sun between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, will increase UV exposure.</p>`,
    `<p>A UV Index reading of 8 to 10 means very high risk of harm from unprotected sun exposure. Take extra precautions because unprotected skin and eyes will be damaged and can burn quickly.</p><p>Minimize sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, will increase UV exposure.</p>`,
    `<p>A UV Index reading of 11 or more means extreme risk of harm from unprotected sun exposure. Take all precautions because unprotected skin and eyes can burn in minutes.</p><p>Try to avoid sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, will increase UV exposure.</p>`
]

const humanTime = (unix) => {
    const date = new Date(unix*1000);
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${hour}:${minutes}`;
}

const degreeToCardinal = (degree) => {
    if(degree>348.75||degree<11.25) return `N`;
    if(degree>=11.25&&degree<33.75) return `NNE`;
    if(degree>=33.75&&degree<56.25) return `NE`;
    if(degree>=56.25&&degree<78.75) return `ENE`;
    if(degree>=78.75&&degree<101.25) return `E`;
    if(degree>=101.25&&degree<123.75) return `ESE`;
    if(degree>=123.75&&degree<146.25) return `SE`;
    if(degree>=146.25&&degree<168.75) return `SSE`;
    if(degree>=168.75&&degree<191.25) return `S`;
    if(degree>=191.25&&degree<213.75) return `SSW`;
    if(degree>=213.75&&degree<236.25) return `SW`;
    if(degree>=236.25&&degree<258.75) return `WSW`;
    if(degree>=258.75&&degree<281.25) return `W`;
    if(degree>=281.25&&degree<303.75) return `WNW`;
    if(degree>=303.75&&degree<326.25) return `NW`;
    if(degree>=326.25&&degree<348.75) return `NNW`;
}

const weatherIcon = (cod, icon) => {
    if(cod===800&&icon==='d')
        return icons.clearD;
    if(cod===800&&icon==='n')
        return icons.clearN;
    if(cod>800&&icon==='d')
        return icons.cloudsD;
    if(cod>800&&icon==='n')
        return icons.cloudsN;
    if(cod===781)
        return icons[781];
    return icons[Math.floor(cod/100)];
}
const fetchWeather = (query) => {
    nope.style.display = weatherDiv.style.display = `none`;
    loader.style.display = `flex`;
    place = query;
    let currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=${units}&appid=${api}`;
    let UVIndex = fetch(currentWeather).then(result => result.json()).then(json => {
        if(json.cod===200){
            weatherDiv.style.display = `flex`;
            nope.style.display = loader.style.display = `none`;
            city.textContent = `${json.name}`;
            date.innerHTML = `<br><br>updated at ${humanTime(json.dt)}`;
            image.src = `icons/svg/${weatherIcon(json.weather[0].id, json.weather[0].icon[2])}`;
            description.textContent = json.weather[0].description;
            temperature.innerHTML = `${json.main.temp} ${units==="metric"?"&deg;C":"&deg;F"}`;
            humidity.textContent = `${json.main.humidity}%`;
            sunrise.textContent = humanTime(json.sys.sunrise);
            sunset.textContent = humanTime(json.sys.sunset);
            wind.textContent = `${json.wind.speed} ${units==="metric"?"m/s":"m/h"}`;
            direction.textContent = json.wind.deg ? degreeToCardinal(json.wind.deg): `no data`;
           cloudiness.textContent = `${json.clouds.all}%`;
            return fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${api}&lat=${json.coord.lat}&lon=${json.coord.lon}`);
        }
        if(json.cod==="404")
        {
            weatherDiv.style.display = `none`;
            nope.style.display = loader.style.display = `flex`;
        }
    }).catch(console.log());
    UVIndex.then(data => data.json()).then(uvdata => {
        const value = uvdata.value;
        uv.textContent = value;
        if(value < 3)
            {uv.style.color = uvInfo.style.borderColor = `green`;uvInfo.innerHTML = uvLevels[0];}
            else if(value < 6)
                {uv.style.color = uvInfo.style.borderColor = `yellow`;uvInfo.innerHTML = uvLevels[1];}
                else if(value < 8)
                    {uv.style.color = uvInfo.style.borderColor = `orange`;uvInfo.innerHTML = uvLevels[2];}
                    else if(value < 11)
                        {uv.style.color = uvInfo.style.borderColor = `red`;uvInfo.innerHTML = uvLevels[3];}
                        else if(value >= 11)
                            {uv.style.color = uvInfo.style.borderColor = `violet`;uvInfo.innerHTML = uvLevels[4];}
    });
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&units=${units}&appid=${api}`;
    fetch(forecast).then(result => result.json()).then(data => {
        console.log(forecast);
    });
}

searchBar.addEventListener('keypress', (e) => {
    let key = e.which || e.keyCode;
    if (key === 13) {
        fetchWeather(e.target.value);
        e.target.value = ``;
    }
});

fetchWeather("Bujumbura");
