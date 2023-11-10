document.addEventListener('DOMContentLoaded', function () {const websiteInput = document.getElementById('website-input');
const fetchWebsiteDataButton = document.getElementById('fetch-website-data');
const websiteDataDiv = document.getElementById('website-data');

fetchWebsiteDataButton.addEventListener('click', async () => {
    const userWebsite = websiteInput.value.trim();
    if (userWebsite === '') {
        websiteDataDiv.innerHTML = 'Please enter a website URL';
        return;
    }

    try {
        const apiUrl = `https://apis.pr-cy.ru/api/v1.1.0/analysis/base/${userWebsite}?key=qN1lIM25NM1lySkVNRTMzd2Y2by9aST0`;
        const websiteDataResponse = await fetch(apiUrl);

        if (websiteDataResponse.ok) {
            const websiteData = await websiteDataResponse.json();
            displayWebsiteMetrics(websiteData);
        } else {
            websiteDataDiv.innerHTML = 'Error fetching website data';
        }
    } catch (error) {
        websiteDataDiv.innerHTML = 'Error: ' + error.message;
    }
});

function displayWebsiteMetrics(data) {
    
    const metricsDiv = document.createElement('div');
    metricsDiv.innerHTML = `
        <h2>Website Metrics</h2>
        <ol>
            <li>Общее количество посещений (дни): ${data['publicStatistics']['publicStatisticsVisitsDaily']}</li>
            <li>Изменение за последний месяц: ${data['publicStatistics']['publicStatisticsVisitsMonthly']}</li>
            <li>Показатель отказов (bounce rate): ${data['bounceRate']['bounceRate']}</li>
            <li>Количество страниц за визит: ${data['pagesPerVisit']['pagesPerVisit']}</li>
            <li>Средняя продолжительность визита: ${data['avgVisitDuration']['avgVisitDuration']}</li>
            <li>Яндекс индекс сайта: ${data['yandexIndex']['yandexIndex']}</li>
            <li>Google индекс сайта: ${data['googleIndex']['googleIndex']}</li>
            <li>Безопасный сайт? : ${data['yandexSafeBrowsing']['yandexSafeBrowsing']}</li>
            <li>Информация Роскомнадзор : ${data['roskomnadzor']['roskomnadzorDomainForbidden']}</li>
            <li>Информация Роскомнадзор : ${data['roskomnadzor']['roskomnadzorDomainForbidden']}</li>
        </ol>
    `;
    websiteDataDiv.innerHTML = ''; // Clear any previous data
    websiteDataDiv.appendChild(metricsDiv);
}

});