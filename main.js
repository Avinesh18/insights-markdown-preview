import * as d3 from "d3";

var d3plot = function(containerID, dataset, xMax, yMax) {

    var margin = {top: 5, right: 10, bottom: 20, left: 30}
    , width = window.innerWidth/1.3 - margin.left - margin.right // Use the window's width 
    , height = window.innerHeight/4 - margin.top - margin.bottom; // Use the window's height

    // The number of datapoints
    //var n = 21;
    var n = xMax;

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, n-1]) // input
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, yMax]) // input 
        .range([height, 0]); // output 

    // 7. d3's line generator
    var line = d3.line()
        .x(function(d, i) {return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d);}) // set the y values for the line generator 
        //.curve(d3.curveMonotoneX) // apply smoothing to the line

    // 1. Add the SVG to the page and employ #2
    var svg = d3.select(`#${containerID}`).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("style", "position: fixed");

    // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale).ticks(5)); // Create an axis component with d3.axisLeft

    const colors = ["#FFFF00","#FF0000", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#00000"]

    for(var i = 0; i < dataset.length; ++i)
    {
        var temp = dataset[i];
        svg.append("path")
            .datum(temp)
            .attr("class", "line")
            .attr("d", line)
            .attr("style", `fill: none;    stroke: ${colors[i]};   stroke-width: 2;`); 

        svg.selectAll(`.dot${i}`)
            .data(temp)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d, i) { return xScale(i) })
            .attr("cy", function(d) { return yScale(d) })
            .attr("r", 5)
            .attr("style", `fill: ${colors[i]}`);
    }
}

var insightsDivElements = document.getElementsByClassName("language-insights");

for(var i=0; i<insightsDivElements.length; ++i)
{
    var code = insightsDivElements[i].getElementsByTagName("div")[0].innerHTML;
    if(code == "")
        continue;

    var elementLines = code.trim().split("\n");
    var dataset=[];
    var maxLen = 0;
    var maxVal = 0;
    elementLines.forEach(function(e) {
        var temp = e.trim().split(" ").map(e => parseInt(e));
        maxLen = temp.length > maxLen ? temp.length : maxLen;
        temp.forEach(function(d){
            maxVal = d > maxVal ? d : maxVal;
        });
        dataset.push(e.trim().split(" "));
    });

    var containerID = `insightsChartContainer${i}`;
    insightsDivElements[i].innerHTML = `<div id="${containerID}"></div>`;
    d3plot(containerID, dataset, maxLen, maxVal);
}
