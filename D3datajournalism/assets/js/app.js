var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Import Data
d3.csv("/assets/data/data.csv").then(function (censusData) {

    // Parse 
    // ==============================
    censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        console.log('abbr', data.abbr);
    });
    //console.log('censusData', censusData)

    // Scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([.95 * d3.min(censusData, d => d.poverty), 1.05 * d3.max(censusData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        //.domain([0, d3.max(censusData, d => d.healthcare)])
        .domain([.85 * d3.min(censusData, d => d.healthcare), 1.05 * d3.max(censusData, d => d.healthcare)])        
        .range([height, 0]);

    // Create axis 
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Axes to chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    // ==============================

    var labelsGroup = chartGroup.append('g').selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .attr("dx", "-0.7em")
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy", "0.35em")
        .attr("font-size", "0.6em")
        .attr("x", d => xLinearScale(d.poverty))
        .text(d => d.abbr);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "13")
        .attr("fill", d3.color("steelblue"))
        .attr("opacity", ".35");  //.35


    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height / 2) - 40)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lack healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${(width / 2) - 75} , ${height + margin.top + 15})`)
        .attr("class", "axisText")
        .text("In poverty (%)");


}).catch(function (error) {
    console.log(error);
});



