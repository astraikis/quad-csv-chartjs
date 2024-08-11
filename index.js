const boundPaddingY = 1;
const boundPaddingX = 0.2;
let activeGrid = "all";

let chart;
let xAvg;
let yAvg;
let xMin;
let xMax;
let yMin;
let yMax;

const data = {
    labels: [],
    datasets: [{
        data:[]
    }]
};

function setGrid(pos) {
    if (activeGrid === pos) {
        activeGrid = "all";
    } else {
        activeGrid = pos;
    }
    document.getElementById(pos).classList.toggle("grid-btn-active");

    if (activeGrid === "all") {
        chart.config._config.options.scales.x.min = xMin - boundPaddingX;
        chart.config._config.options.scales.x.max = xMax + boundPaddingX;
        chart.config._config.options.scales.y.min = yMin - boundPaddingY;
        chart.config._config.options.scales.y.max = yMax + boundPaddingY;
    } else if (activeGrid === "tl") {
        chart.config._config.options.scales.x.min = xMin - boundPaddingX;
        chart.config._config.options.scales.x.max = xAvg + boundPaddingX;
        chart.config._config.options.scales.y.min = yAvg - boundPaddingY;
        chart.config._config.options.scales.y.max = yMax + boundPaddingY;
    } else if (activeGrid === "tr") {
        chart.config._config.options.scales.x.min = xAvg - boundPaddingX;
        chart.config._config.options.scales.x.max = xMax + boundPaddingX;
        chart.config._config.options.scales.y.min = yAvg - boundPaddingY;
        chart.config._config.options.scales.y.max = yMax + boundPaddingY;
    } else if (activeGrid === "bl") {
        chart.config._config.options.scales.x.min = xMin - boundPaddingX;
        chart.config._config.options.scales.x.max = xAvg + boundPaddingX;
        chart.config._config.options.scales.y.min = yMin - boundPaddingY;
        chart.config._config.options.scales.y.max = yAvg + boundPaddingY;
    } else if (activeGrid === "br") {
        chart.config._config.options.scales.x.min = xAvg - boundPaddingX;
        chart.config._config.options.scales.x.max = xMax + boundPaddingX;
        chart.config._config.options.scales.y.min = yMin - boundPaddingY;
        chart.config._config.options.scales.y.max = yAvg + boundPaddingY;
    }

    chart.update();
}

const fileInput = document.getElementById("file-input");
fileInput.onchange = () => {
    let xSum = 0;
    let ySum = 0;

    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
        const rows = e.target.result.split("\n");
        
        for (let i = 1; i < rows.length - 1; i++) {
            const row = rows[i].split(",");
            data.labels.push(row[0]);
            restaurant = {
                x: row[2],
                y: row[1],
                r: row[3].slice(0, -1) / 4
            }
            data.datasets[0].data.push(restaurant);

            xSum += parseFloat(row[2]);
            ySum += parseFloat(row[1]);
            xMin = Math.min(xMin, row[2]);
            xMax = Math.max(xMax, rows[2]);
            yMin = Math.min(yMin, row[2]);
            yMax = Math.max(yMax, rows[2]);
        }

        xAvg = xSum / (rows.length - 1);
        yAvg = ySum / (rows.length - 1);


    const ctx = document.getElementById("chart");

    chart = new Chart(ctx, {
        type: "bubble",
        data: data,
        options: {
            onClick: function(e) {
                const element = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
                if (!element[0]) {
                    return;
                }
                const restaurant = data.datasets[0].data[element[0].index];
                const restaurantName = data.labels[element[0].index];
                
                document.getElementById("chart-details-empty").style.display = "none";
                document.getElementById("chart-details-container").style.display = "block";
                document.getElementById("chart-details-name").innerText = restaurantName;
                document.getElementById("chart-details-rating").innerText = `${restaurant.x} stars`;
                document.getElementById("chart-details-price").innerText = `$${restaurant.y} average price`;
                document.getElementById("chart-details-num-reviews").innerText = `${restaurant.r} reviews`;
            },
            plugins: {
                annotation: {
                    annotations: {
                        yAvgLine: {
                            drawTime: 'beforeDatasetsDraw',
                            type: 'line',
                            yMin: yAvg,
                            yMax: yAvg,
                            borderColor: 'rgb(211, 211, 211)',
                            borderWidth: 3,
                        },
                        xAvgLine: {
                            drawTime: 'beforeDatasetsDraw',
                            type: 'line',
                            xMin: xAvg,
                            xMax: xAvg,
                            borderColor: 'rgb(211, 211, 211)',
                            borderWidth: 3,
                        }
                    }
                },
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: file.name
                },
                tooltip: {
                    // Disable the on-canvas tooltip
                    enabled: false,
    
                    external: function(context) {
                        // Tooltip Element
                        let tooltipEl = document.getElementById('chartjs-tooltip');
    
                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            document.body.appendChild(tooltipEl);
                        }
    
                        // Hide if no tooltip
                        const tooltipModel = context.tooltip;
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }
    
                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if (tooltipModel.yAlign) {
                            tooltipEl.classList.add(tooltipModel.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }
    
                        function getBody(bodyItem) {
                            return bodyItem.lines;
                        }

                        const bodyLines = tooltipModel.body.map(getBody)[0][0].slice(1,-1).split(", ");
    
                        // Set Text
                        if (tooltipModel.body) {
                            tooltipEl.innerHTML =
                                `<h4>${tooltipModel.title[0]}</h4>
                                <p>${bodyLines[0]} stars</p>
                                <p>$${bodyLines[1]} average price</p>
                                <p>${bodyLines[2]} reviews</p>`
                        }
    
                        const position = context.chart.canvas.getBoundingClientRect();
                        const bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);
    
                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                        tooltipEl.style.font = bodyFont.string;
                        tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                    }
                }
            }
        }
    });

    console.log(chart.config._config.options);
    }
}