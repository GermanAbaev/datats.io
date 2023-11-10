document.addEventListener('DOMContentLoaded', function () {
    const inputFieldsContainer = document.getElementById('input-fields');
    const addFieldButton = document.getElementById('add-field');
    const fetchDataButton = document.getElementById('fetch-data');
    const resultDiv = document.getElementById('result');
    const chartsContainer = document.getElementById('charts-container');
    const maxFields = 3;
    let currentFieldNumber = 2; // Set the initial number of fields to 2

    // Secret Code
    const secretCode = 'hello'; // Change to your desired secret code
    let isUnblocked = false;

    // Create an array of colors for columns
    const columnColors = ['#FF5733', '#33FF57', '#5733FF', '#FF5733', '#33FF57', '#5733FF'];

    // Create an array to hold the amCharts instances
    const chartInstances = [];

    addFieldButton.addEventListener('click', () => {
        const codeInputs = document.querySelectorAll('.code-input');
        if (codeInputs.length < maxFields) {
            currentFieldNumber++;
            const field = document.createElement('div');
            field.className = 'input-group';
            field.innerHTML = `
                <span class="code-label">Конкурент #${currentFieldNumber}</span>
                <input type="text" class="code-input" placeholder="Enter code">
                <button class="remove-field">Remove</button>
            `;
            inputFieldsContainer.appendChild(field);
        } else {
            alert("You've reached the maximum input of 3 fields.");
        }
    });

    inputFieldsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-field')) {
            event.target.parentElement.remove();
            currentFieldNumber--;

            // Update the labels
            const codeLabels = document.querySelectorAll('.code-label');
            for (let i = 0; i < codeLabels.length; i++) {
                codeLabels[i].textContent = `Конкурент #${i + 1}`;
            }
        }
    });

    fetchDataButton.addEventListener('click', async () => {
        const codeInputs = document.querySelectorAll('.code-input');
        const requestData = [];

        for (const input of codeInputs) {
            const code = input.value.trim();
            if (code) {
                requestData.push(fetchData(code));
            }
        }

        const responses = await Promise.all(requestData);
        let resultText = '';

        // Clear previous charts
        chartsContainer.innerHTML = '';

        responses.forEach((response, index) => {
            const data = JSON.parse(response);
            const ustavKapital = data['body']['Документ']['Баланс']['Пассив']['КапРез']['УставКапитал']['@attributes']['СумОтч'];
            const debZadol = data['body']['Документ']['Баланс']['Актив']['ОбА']['ДебЗад']['@attributes']['СумОтч'];
            const saldoInv = data['body']['Документ']['ДвижениеДен']['ИнвОпер']['СальдоИнв']['@attributes']['СумОтч'];
            const saldoTek = data['body']['Документ']['ДвижениеДен']['ТекОпер']['СальдоТек']['@attributes']['СумОтч'];
            const viruch = data['body']['Документ']['ФинРез']['Выруч']['@attributes']['СумОтч'];
            const sumOtch = data['body']['Документ']['Баланс']['Актив']['ВнеОбА']['@attributes']['СумОтч'];
            const chistayaPribil = data['body']['Документ']['ОтчетИзмКап']['ЧистАктив']['@attributes']['На31ДекОтч'];
            const valovayaPribil = data['body']['Документ']['ФинРез']['ВаловаяПрибыль']['@attributes']['СумОтч'];
            const oborotnyeAktivy = data['body']['Документ']['Баланс']['Актив']['ОбА']['@attributes']['СумОтч'];
            const vneoborotnyeAktivy = data['body']['Документ']['Баланс']['Актив']['ВнеОбА']['@attributes']['СумОтч'];
            const pribylOtProdazh = data['body']['Документ']['ФинРез']['ПрибПрод']['@attributes']['СумОтч'];
            const pribylDoNalogooblozheniya = data['body']['Документ']['ФинРез']['ПрибУбДоНал']['@attributes']['СумОтч'];
            // Create a container for the chart
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            chartContainer.id = `chart${index + 1}`;
            chartsContainer.appendChild(chartContainer);

            // Create an amCharts column chart with moving bullets
            chartInstances[index] = am4core.create(`chart${index + 1}`, am4charts.XYChart);
            chartInstances[index].data = [];

            // Extract years and data points for the chart
            const dynamics = data['body']['Документ']['ОтчетИзмКап']['ЧистАктив']['@attributes'];
            const years = Object.keys(dynamics);
            const values = Object.values(dynamics);

            for (let i = 0; i < years.length; i++) {
                chartInstances[index].data.push({
                    year: years[i],
                    value: values[i],
                });
            }

            // Create the X and Y axes
            const categoryAxis = chartInstances[index].xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = 'year';

            const valueAxis = chartInstances[index].yAxes.push(new am4charts.ValueAxis());

            // Create the series
            const series = chartInstances[index].series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = 'value';
            series.dataFields.categoryX = 'year';
            series.columns.template.stroke = am4core.color('#333');
            series.columns.template.strokeWidth = 1;
            series.columns.template.column.cornerRadiusTopLeft = 10;
            series.columns.template.column.cornerRadiusTopRight = 10;
            series.columns.template.column.cornerRadiusBottomLeft = 10;
            series.columns.template.column.cornerRadiusBottomRight = 10;
            // Set the width of the columns (make them thinner)
            series.columns.template.width = am4core.percent(40); // Adjust the width percentage as needed


            chartContainer.style.height = '400px'; // Set the desired height in pixels

            // Assign a color to each column
            series.columns.template.fill = am4core.color(columnColors[index % columnColors.length]);

            // Create moving bullets
            const bullet = series.bullets.push(new am4core.Circle());
            bullet.stroke = am4core.color('#ffffff');
            bullet.strokeWidth = 2;
            bullet.tooltipText = '{valueY}';// Modify bullet animation settings
            bullet.hide(0); // Start with the bullet hidden
            bullet.show(2000); // Show the bullet over a duration of 2000 milliseconds (2 seconds)
            
            // You can adjust the duration (in milliseconds) to control the speed of the bullet animation
            
            bullet.adapter.add('fill', (fill, target) => {
                if (target.dataItem.valueY < 0) {
                    return am4core.color('#ff0000'); // Color for negative values
                }
                return fill;
            });

            // Add chart cursor
            chartInstances[index].cursor = new am4charts.XYCursor();
            chartInstances[index].cursor.behavior = 'zoomY';

            resultText += `Data for code ${codeInputs[index].value}:
            Выручка компании на период отчетного года: ${viruch},
                    Сумма отчета: ${sumOtch}, 
                    Чистая прибыль: ${chistayaPribil}, 
                    Валовая прибыль: ${valovayaPribil}, 
                    Оборотные активы (итог): ${oborotnyeAktivy},
                    Внеоборотные активы (итог): ${vneoborotnyeAktivy},
                    Прибыль от продаж: ${pribylOtProdazh},
                    Сальдо денежных потоков от инвестиционных операций: ${saldoInv},
                    Сальдо денежных потоков от текущих операций: ${saldoTek},
                    Дебиторская задолженность: ${debZadol},
                    Прибыль до налогообложения: ${pribylDoNalogooblozheniya}<br>`;

             const pieChartContainer = document.createElement('div');
    pieChartContainer.className = 'pie-chart-container';
    pieChartContainer.id = `pieChart${index + 1}`;
    chartsContainer.appendChild(pieChartContainer);

    // Create an amCharts pie chart
    const pieChart = am4core.create(`pieChart${index + 1}`, am4charts.PieChart);

    // Add data to the pie chart
    pieChart.data = [
        {
            category: 'Чистая Прибыль',
            value: chistayaPribil
        },
        {
            category: 'Выручка',
            value: viruch
        }
    ];

    // Create pie series
    const pieSeries = pieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.category = 'category';
    pieSeries.dataFields.value = 'value';

    // Set a label and tooltip
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.tooltipText = '{category}: {value.value}';

    // Adjust the chart's appearance as needed
    pieChart.innerRadius = am4core.percent(40);

    // Add chart cursor
    pieChart.cursor = new am4charts.XYCursor();
        });

        resultDiv.innerHTML = resultText;
    });

    async function fetchData(code) {
        try {
            const response = await fetch(`https://zachestnyibiznesapi.ru/paid/data/test-fs-fns?id=${code}`);
            if (response.ok) {
                const data = await response.json();
                return JSON.stringify(data);
            } else {
                return `Error fetching data for code ${code}`;
            }
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }
});
