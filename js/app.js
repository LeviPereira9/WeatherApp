const form = document.querySelector(".top-banner form");
const msg = document.querySelector(".msg");
const input = document.querySelector(".top-banner form .form-control");
const list = document.querySelector(".cities");
const forms = document.querySelectorAll('.needs-validation')
let weathers = [];

const icon = {
    icon_01d: "bi bi-brightness-high",
    icon_01n: "bi bi-moon-stars-fill",
    icon_02d: "bi bi-cloud-sun",
    icon_02n: "bi bi-cloud-moon-fill",
    icon_03d: "bi bi-cloudy",
    icon_03n: "bi bi-cloudy-fill",
    icon_04d: "bi bi-clouds",
    icon_04n: "bi bi-clouds-fill",
    icon_09d: "bi bi-cloud-rain",
    icon_09n: "bi bi-cloud-rain-fill",
    icon_10d: "bi bi-cloud-rain-heavy",
    icon_10n: "bi bi-cloud-rain-heavy-fill",
    icon_11d: "bi bi-cloud-lightning-rain",
    icon_11n: "bi bi-cloud-lightning-rain-fill",
    icon_13d: "bi bi-cloud-snow",
    icon_13n: "bi bi-cloud-snow-fill",
    icon_50d: "bi bi-cloud-haze",
    icon_50n: "bi bi-cloud-haze-fill"
}

//API setup
const apiKey = "df33e2e1877e366b16529e886b27739d";

//Controlar o form, pegar o valor.
form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.textContent = "";

    if(!form.checkValidity()){
        e.stopPropagation();
        form.classList.add('was-validated');
    } else {
        const inputVal = input.value
        weatherApp(inputVal);

        input.value = "";
        input.focus()
        form.classList.remove("was-validated");
    }

});

//Chamada na API.
async function weatherApp(inputVal){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric&lang=pt_br`


    const response = await fetch(url);

    if(!response.ok){
        msg.textContent = "Insira um nome de cidade válido! \uD83D\uDE29";
    }

    const data = await response.json();

    const weatherData = {
        id: data.id,
        name: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        icon: "icon_" + data.weather[0].icon,
        desc: data.weather[0]["description"].charAt(0).toUpperCase() + data.weather[0]["description"].slice(1),
        wind: Math.round(data.wind.speed * 3.26),
        humidity: data.main.humidity,
        feels: data.main.feels_like
    }
    
    //Se já tiver repetido uma cidade.
    if (weathers.find(e => e.id === weatherData.id)) {
        msg.textContent = `Já sabe como está o clima em ${data.name}. Seja mais específico ao informar o nome da cidade ou país. 😉`
        return;
    }

    weathers.push(weatherData);
    
    displayWeather(weathers);
}


//Disponibilizar o clima da cidade no card
function displayWeather(data){

    //Limpa a lista
    list.innerHTML = "";

    //Percore todas as pesquisas e preenche legal.
    data.map((data)=>{
        const li = document.createElement("li");
        console.log(data);
        li.classList.add("card", "col-10", "col-sm-8", "col-md-5", "col-lg-3", "bg-dark", "p-0");
        const markup = `
            <div
                class="card-header d-flex justify-content-between align-content-center card_header"
            >
                <span class="position-relative mt-1">
                ${data.name}
                <span
                    class="position-absolute mt-1 ms-1 translate-middle-y badge rounded-pill bg-warning text-dark"
                >
                    ${data.country}
                </span>
                </span>
                <div data-bs-theme="dark">
                <i 
                    class="btn btn-close" 
                    aria-label="Close" 
                    role="button"
                    onclick="closeWeather(${data.id})"
                    ></i>
                </div>
            </div>
            <div class="card-body card_body">
                <h5 class="text-center d-block my-2 card-subtitle">
                <i class="i bi-thermometer-sun"></i> ${data.temp}<sup>°C</sup>
                </h5>
                <i
                class="${icon[data.icon]} my-4 weather_icon d-block text-center"
                ></i>
                <h5 class="card-title text-center mt-3">${data.desc}</h5>
            </div>
            <div class="card-footer card_footer">
                <div class="row">
                <div class="col-4">
                    <div
                    class="d-flex flex-column"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Vento"
                    >
                    <i
                        class="bi bi-wind text-center my-2 weather_footer_icon"
                    ></i>
                    <small class="text-center mb-1">${data.wind} km/h</small>
                    </div>
                </div>
                <div class="col-4">
                    <div
                    class="d-flex flex-column"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Umidade"
                    >
                    <i
                        class="bi bi-moisture text-center my-2 weather_footer_icon"
                    ></i>
                    <small class="text-center mb-1">${data.humidity}%</small>
                    </div>
                </div>
                <div class="col-4">
                    <div
                    class="d-flex flex-column"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Sensação Térmica"
                    >
                    <i
                        class="bi bi-thermometer-high text-center my-2 weather_footer_icon"
                    ></i>
                    <small class="text-center">${data.feels}<sup>°C</sup></small>
                    </div>
                </div>
                </div>
            </div>
            </div>
        `

        
        
        li.innerHTML = markup;
        list.appendChild(li);
            
    })
    
   

    // Tooltip Trigger
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Pra excluir, limpa o evento chamado pelo html e manda fazer a lista novamente.
function closeWeather(id){
    weathers = weathers.filter((e)=> e.id !== id)
    displayWeather(weathers);
}