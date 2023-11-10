// Initialize amCharts
am4core.ready(function () {
    // Create chart instance
    var chart = am4core.create("chartContainer", am4charts.PieChart);

    // Set chart data
    chart.data = [];

    // Function to add a country and update the chart
    function addCountry() {
        var countryInput = document.getElementById("countryInput").value;

        if (countryInput.trim() !== "") {
            // Check if the country already exists in the data
            var existingCountry = chart.data.find(function (item) {
                return item.country === countryInput;
            });

            if (existingCountry) {
                existingCountry.value++;
            } else {
                chart.data.push({
                    country: countryInput,
                    value: 1
                });
            }

            // Update the chart
            chart.invalidateData();
        }

        // Clear the input field
        document.getElementById("countryInput").value = "";
    }

    // Add a handler for the "Enter" key
    document.getElementById("countryInput").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addCountry();
        }
    });

    // Create pie series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "country";
});

