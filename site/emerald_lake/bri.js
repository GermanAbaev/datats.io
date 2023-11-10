document.addEventListener('DOMContentLoaded', function () {
    const inputFieldsContainer = document.getElementById('input-fields');
    const addFieldButton = document.getElementById('add-field');
    const generateGraphButton = document.getElementById('generate-graph');
    const resultDiv = document.getElementById('result');
    const chartsContainer = document.getElementById('charts-container');
    const maxFields = 3;
    let currentFieldNumber = 0;
    const columnColors = ['#FF5733', '#33FF57', '#5733FF', '#FF5733', '#33FF57', '#5733FF'];
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

            const codeLabels = document.querySelectorAll('.code-label');
            for (let i = 0; i < codeLabels.length; i++) {
                codeLabels[i].textContent = `Конкурент #${i + 1}`;
            }
        }
    });

    generateGraphButton.addEventListener('click', async () => {
        const codeInputs = document.querySelectorAll('.code-input');
        const requestData = [];

        for (const input of codeInputs) {
            const code = input.value.trim();
            if (code) {
                requestData.push(fetchData(code));
            }
        }

        const responses = await Promise.all(requestData);

        chartsContainer.innerHTML = '';

        if (responses.length > 0) {
            const resultText = 'Графики готовы';

            const comparativeChartContainer = document.createElement('div');
            comparativeChartContainer.className = 'chart-container';
            comparativeChartContainer.id = 'comparative-chart';
            chartsContainer.appendChild(comparativeChartContainer);

            const chistayaPribilChartContainer = document.createElement('div');
            chistayaPribilChartContainer.className = 'chart-container';
            chistayaPribilChartContainer.id = 'chistayaPribil-chart';
            chartsContainer.appendChild(chistayaPribilChartContainer);
            
            
            const ustavnoiKapitalChartContainer = document.createElement('div');
            ustavnoiKapitalChartContainer.className = 'chart-container';
            ustavnoiKapitalChartContainer.id = 'ustavnoiKapital-chart';
            chartsContainer.appendChild(ustavnoiKapitalChartContainer);
            
            
            const valovayaPribilChartContainer = document.createElement('div');
            valovayaPribilChartContainer.className = 'chart-container';
            valovayaPribilChartContainer.id = 'valovayaPribil-chart';
            chartsContainer.appendChild(valovayaPribilChartContainer);
            

            am4core.useTheme(am4themes_animated);

            const comparativeChart = am4core.create('comparative-chart', am4charts.XYChart);
            comparativeChart.data = [];

            const chistayaPribilChart = am4core.create('chistayaPribil-chart', am4charts.XYChart);
            chistayaPribilChart.data = [];

            const valovayaPribilChart = am4core.create('valovayaPribil-chart', am4charts.XYChart);
            valovayaPribilChart.data = [];

            const ustavnoiKapitalChart = am4core.create('ustavnoiKapital-chart', am4charts.PieChart3D);
            ustavnoiKapitalChart.titles.create().text = 'Уставной капитал'; // Set the title

            const ustavnoiKapitalData = [];


            responses.forEach((response, index) => {
                const data = JSON.parse(response);
                const sumOtch = parseFloat(data['body']['Документ']['Баланс']['Актив']['ВнеОбА']['@attributes']['СумОтч']);
                const chistayaPribil = parseFloat(data['body']['Документ']['ОтчетИзмКап']['ЧистАктив']['@attributes']['На31ДекОтч']);
                const valovayaPribil = parseFloat(data['body']['Документ']['ФинРез']['ВаловаяПрибыль']['@attributes']['СумОтч']);
                const ustavnoiKapital = parseFloat(data['body']['Документ']['Баланс']['Пассив']['КапРез']['УставКапитал']['@attributes']['СумОтч']);
                const orgName = data['body']['Документ']['СвНП']['НПЮЛ']['@attributes']['НаимОрг'];
                comparativeChart.data.push({
                    code: orgName,
                    value: sumOtch,
                });

                chistayaPribilChart.data.push({
                    code: orgName,
                    value: chistayaPribil,
                });
                valovayaPribilChart.data.push({
                    code: orgName,
                    value: valovayaPribil,
                });
                ustavnoiKapitalData.push({
                    code: orgName,
                    value: ustavnoiKapital,
                });
            });
            ustavnoiKapitalChart.data = ustavnoiKapitalData;
            
            ustavnoiKapitalChart.innerRadius = am4core.percent(40);
            ustavnoiKapitalChart.depth = 30;
            
            const series = ustavnoiKapitalChart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = 'value';
            series.dataFields.category = 'code';
            
            series.labels.template.text = '{category}: {value.value}';
            series.ticks.template.disabled = true;
            series.slices.template.tooltipText = '{category}: {value.value}';

        
            // Customize the appearance of the pie chart (you can further customize this)
            series.slices.template.stroke = am4core.color('#fff');
            series.slices.template.strokeWidth = 2;
            series.slices.template.strokeOpacity = 0.7;
            series.slices.template.tooltipText = '{category}: {value}';
            // Add a legend
            const legend = new am4charts.Legend();
            legend.position = 'left';
            
            ustavnoiKapitalChart.legend = legend;
            
            
            const createChart = (chart, id, title) => {
                chart.paddingRight = 20;

                // Create axes and series (You can customize these further)
                const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = 'code';
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.minGridDistance = 30;

                const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

                const series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = 'value';
                series.dataFields.categoryX = 'code';
                series.columns.template.stroke = am4core.color('#333');
                series.columns.template.strokeWidth = 1;
                series.columns.template.column.cornerRadiusTopLeft = 10;
                series.columns.template.column.cornerRadiusTopRight = 10;
                series.columns.template.column.cornerRadiusBottomLeft = 10;
                series.columns.template.column.cornerRadiusBottomRight = 10;
                series.columns.template.width = am4core.percent(6);
                series.columns.template.fill = am4core.color(columnColors[0]);
                
                
                series.appear(); 
                
                
                const bullet = series.bullets.push(new am4charts.Bullet());
                const circle = bullet.createChild(am4core.Circle);
                circle.radius = 5;
                circle.fill = am4core.color("#333"); // Bullet color
            
                bullet.hide(0);
                bullet.show(2000); // Animation
                
                
                const cursor = new am4charts.XYCursor();
                cursor.xAxis = categoryAxis;
                cursor.snapToSeries = series;
                chart.cursor = cursor; // Add this line to enable the cursor
                

                chart.events.on('ready', () => {
                    bullet.hide(0);
                    bullet.show(2000);
                });

                categoryAxis.renderer.minGridDistance = 30;
                categoryAxis.renderer.labels.template.horizontalCenter = 'right';
                categoryAxis.renderer.labels.template.verticalCenter = 'middle';

                valueAxis.min = 0;
                valueAxis.extraMax = 0.1;
                valueAxis.title.text = title;
            };


            createChart(comparativeChart, 'comparative-chart', 'Сумма отчета');
            createChart(chistayaPribilChart, 'chistayaPribil-chart', 'ЧистАктив');
            createChart(valovayaPribilChart, 'valovayaPribil-chart', 'Валовая прибыль');
            resultDiv.innerHTML = resultText;
        } else {
            resultDiv.innerHTML = 'No data to display.';
        }
    
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
