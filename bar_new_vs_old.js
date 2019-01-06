// create 2 data_set

var data1forbar = [
   {group: "life evaluation", value: 0.4},
   {group: "positive affect", value: 0.4},
   {group: "decrease of negative affect", value: 0.24}
];

var data2forbar = [
   {group: "life evaluation", value: 0.5},
   {group: "positive affect", value: 0.3},
   {group: "decrease of negative affect", value: 0.21}
];

// set the dimensions and margins of the graph
var margin_foor = {top: 30, right:50 , bottom: 30, left: 20},
    width_foor = 600 - margin_foor.left - margin_foor.right,
    height_foor = 460 - margin_foor.top - margin_foor.bottom;

// append the svg object to the body of the page
var foor = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width_foor + margin_foor.left + margin_foor.right)
    .attr("height", height_foor + margin_foor.top + margin_foor.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_foor.left + "," + margin_foor.top + ")");

// X axis
var x_foor = d3.scaleBand()
  .range([ 0, width_foor ])
  .domain(data1forbar.map(function(d) { return d.group; }))
  .padding(0.2);
foor.append("g")
  .attr("transform", "translate(0," + height_foor + ")")
  .call(d3.axisBottom(x_foor))

// Add Y axis
var y_foor = d3.scaleLinear()
  .domain([0, 0.5])
  .range([ height_foor, 0]);
  foor.append("g")
  .attr("class", "myYaxis")
  .call(d3.axisLeft(y_foor));

// A function that create / update the plot for a given variable:
function update(data) {

  var u = foor.selectAll("rect")
    .data(data)

  u
    .enter()
    .append("rect")
    .attr("class","forbar")
    .merge(u)
    .transition()
    .duration(1000)
      .attr("x", function(d) { return x_foor(d.group); })
      .attr("y", function(d) { return y_foor(d.value); })
      .attr("width", x_foor.bandwidth())
      .attr("height", function(d) { return height_foor - y_foor(d.value); })
      .attr("fill", "#ef6c57")
}

// Initialize the plot with the first dataset
update(data1forbar);
