document.addEventListener("DOMContentLoaded", function() {
    const regionsSelect = document.getElementById("regions");
    const departementsSelect = document.getElementById("departements");
    const showCommunesButton = document.getElementById("show-communes");
    const communesList = document.getElementById("communes-list");
    const geolocateButton = document.getElementById("geolocate");
    const cityInfo = document.getElementById("city-info");

    fetch("https://geo.api.gouv.fr/regions")
        .then(response => response.json())
        .then(data => {
            data.forEach(region => {
                const option = document.createElement("option");
                option.value = region.code;
                option.textContent = region.nom;
                regionsSelect.appendChild(option);
            });
        });

    regionsSelect.addEventListener("change", function() {
        const regionCode = this.value;
        if (regionCode) {
            fetch(`https://geo.api.gouv.fr/regions/${regionCode}/departements`)
                .then(response => response.json())
                .then(data => {
                    departementsSelect.innerHTML = '<option value="">Sélectionner un département</option>';
                    data.forEach(department => {
                        const option = document.createElement("option");
                        option.value = department.code;
                        option.textContent = department.nom;
                        departementsSelect.appendChild(option);
                    });
                });
        } else {
            departementsSelect.innerHTML = '<option value="">Sélectionner un département</option>';
        }
    });

    showCommunesButton.addEventListener("click", function() {
        const departementCode = departementsSelect.value;
        if (departementCode) {
            fetch(`https://geo.api.gouv.fr/departements/${departementCode}/communes`)
                .then(response => response.json())
                .then(data => {
                    communesList.innerHTML = '';
                    data.sort((a, b) => b.population - a.population); 
                    data.forEach(commune => {
                        const div = document.createElement("div");
                        div.textContent = `${commune.nom} - ${commune.population} habitants`;
                        communesList.appendChild(div);
                    });
                });
        }
    });

    geolocateButton.addEventListener("click", function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetch(`https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,population,surface`)
                    .then(response => response.json())
                    .then(data => {
                        const city = data[0];
                        cityInfo.innerHTML = `<strong>${city.nom}</strong><br>Population: ${city.population}<br>Surface: ${city.surface} km²`;
                    });
            });
        } else {
            alert("La géolocalisation n'est pas disponible sur ce navigateur.");
        }
    });
});

