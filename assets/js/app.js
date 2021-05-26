// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1024 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("assets/data/data.csv").then( data => {


  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, width ]);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
 // Add X axis label
  svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Age of Individuals")
        .attr("font-size", "1em");
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 30])
    .range([ height, 0]);
  // Add Y axis Label
  svg.append("g")
    .call(d3.axisLeft(y));
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("% of Smokers");
  // Add tool tips
  var tooltip = d3.select("#scatter")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")

  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html(`For State ${d.abbr} <br> Average Age: ${d.age} <br> % of Smokers ${d.smokes}`)
      .style("left", (d3.mouse(this)[0]+90) + "px") 
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }


  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d=> x(d.age) )
    .attr("cy", d=> y(d.smokes) )
    .attr("r", width * .01)
    .style("fill", "#69b3a2")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )
  // Add Text
  svg.append('g')
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => x(d.age) )
    .attr("y", d => y(d.smokes) )
    .attr("dx", "-.5em")
    .attr("dy", ".40em")
    .attr("font-size", ".5em")
    .attr("class","cText")

    //Adjusts x Axis scale

    function updatePlot() {

        // Get the value of the button
        xlim = this.value
    
        // Update X axis
        x.domain([3,xlim])
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
    
        // Update chart
        svg.selectAll("circle")
           .data(data)
           .transition()
           .duration(1000)
           .attr("cx", d => x(d.age))
           .attr("cy", d => y(d.smokes))
        svg.selectAll(".cText")
           .data(data)
           .transition()
           .duration(1000)
           .attr("x", d => x(d.age) )
           .attr("y", d => y(d.smokes) )
      }
    // Fires button even
    d3.select("#buttonXlim").on("input", updatePlot )

});