document.addEventListener('DOMContentLoaded', function () {
    const websiteInput = document.getElementById('website-input');
    const fetchWebsiteDataButton = document.getElementById('fetch-website-data');
    const websiteDataDiv = document.getElementById('website-data');
    const dynamicFieldsDiv = document.getElementById('dynamic-fields');
    const addFieldButton2 = document.getElementById('add-field2');

    addFieldButton2.addEventListener('click', function () {
        createDynamicField();
    });

    fetchWebsiteDataButton.addEventListener('click', async () => {
        const userWebsite = websiteInput.value.trim();
        if (userWebsite === '') {
            websiteDataDiv.textContent = 'Please enter a website URL';
            return;
        }

        try {
            const apiUrl = `https://apis.pr-cy.ru/api/v1.1.0/analysis/base/${userWebsite}?key=qN1lIM25NM1lySkVNRTMzd2Y2by9aST0`;
            const websiteDataResponse = await fetch(apiUrl);

            if (websiteDataResponse.ok) {
                const websiteData = await websiteDataResponse.json();
                displayWebsiteMetrics(websiteData, websiteDataDiv);
            } else {
                websiteDataDiv.textContent = 'Error fetching website data';
            }
        } catch (error) {
            websiteDataDiv.textContent = 'Error: ' + error.message;
        }
    });

    function createDynamicField() {
        const dynamicField = document.createElement('div');
        dynamicField.className = 'dynamic-field';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter a website URL';
        dynamicField.appendChild(input);

        const fetchButton = document.createElement('button');
        fetchButton.textContent = 'Fetch Data';
        dynamicField.appendChild(fetchButton);

        const resultDiv = document.createElement('div');
        resultDiv.className = 'result';
        dynamicField.appendChild(resultDiv);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        dynamicField.appendChild(deleteButton);

        dynamicFieldsDiv.appendChild(dynamicField);

        fetchButton.addEventListener('click', async () => {
            const userWebsite = input.value.trim();
            if (userWebsite === '') {
                resultDiv.textContent = 'Please enter a website URL';
                return;
            }

            try {
                const apiUrl = `https://apis.pr-cy.ru/api/v1.1.0/analysis/base/${userWebsite}?key=qN1lIM25NM1lySkVNRTMzd2Y2by9aST0`;
                const websiteDataResponse = await fetch(apiUrl);

                if (websiteDataResponse.ok) {
                    const websiteData = await websiteDataResponse.json();
                    displayWebsiteMetrics(websiteData, resultDiv);
                } else {
                    resultDiv.textContent = 'Error fetching website data';
                }
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
            }
        });

        deleteButton.addEventListener('click', () => {
            dynamicFieldsDiv.removeChild(dynamicField);
        });
    }

    function displayWebsiteMetrics(data, resultDiv) {
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
                <li>Скорость загрузки страниц с мобильных устройств : ${data['pageSpeedMobile']['pageSpeed']['value']}</li>
                <li>Конкурент сайта #1 : ${data['competitors']['competitors']['0']['domain']}</li>
                <li>Конкурент сайта #2 : ${data['competitors']['competitors']['1']['domain']}</li>
                <li>Дата создания сайта : ${data['whoisCreationDate']['whoisCreationDate']}</li>
                <li>Рейтинг в соответственной стране создания сервиса: ${data['countryRank']['countryRank']}</li>
                <li>Индекс качеста сайта по версии Yandex.ru (См. подребнее https://yandex.ru/support/webmaster/site-quality-index.html?lang=en): ${data['yandexSqi']['yandexSqi']}</li>
                <li>Рейтинг в мире: ${data['globalRank']['globalRank']}</li>
                <li>Рейтинг по версии SimilarWeb: ${data['similarWebRank']['similarWebGlobalRank']}</li>
                <li>Рейтинг по версии MegaIndex: ${data['megaindexRank']['megaindexTrustRankLog']}</li>
                <li>Скорость загрузки сайта с рабочего стола: ${data['pageSpeedDesktop']['pageSpeed']['score']}</li>
                <li>Количество доменов по версии megaindex: ${data['megaindexDomainsCount']['megaindexDomainsCount']}</li>
                <li>Доступен ли домен на ${data['domainAvailability']['updated']} : True </li>
                <li>Оптимизированни ли фотографии на сервисе? ${data['pageSpeedOptimizeImages']['pageSpeedOptimizeImages']} на${data['pageSpeedOptimizeImages']['updated']} </li>
                <li>Рейтинг по версии pr-cy: ${data['prcyRank']['prcyGrade']}</li>
                <li>Анализ трафика по версии Alexa: ${data['alexaTrafficMap']['alexaTrafficMap']['US']}</li>
                <li>История выдачи поисковых система по запросам в Google, кол-во слов: ${data['megaindexHistoryGoogle']['words']}</li>
                <li>История выдачи поисковых система по запросам в Yandex, кол-во слов: ${data['megaindexHistoryYandex']['words']}</li>
                <li>Дата устаревания домена: ${data['whoisExpirationDate']['whoisExpirationDate']}</li>

            </ol>
        `;
        resultDiv.innerHTML = ''; // Clear any previous data
        resultDiv.appendChild(metricsDiv);
    }
});
