
var margin = {top: 45, right: 100, bottom: 30, left: 30},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//var formatPercent = d3.format("");

var color = d3.scale.ordinal()
          .range(["#dc7a7a","#dc9b65","#8e98e2"])
          .domain(["life evaluation","positive affect","negative affect"]);

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// Scales. Note the inverted domain fo y-scale: bigger is up!
var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
   // .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>" + d.country + "</strong><br/><span style='color:#fff'>" + d.year +": "+ d.percent + "</span>";
  })

// csv loaded asynchronously
d3.csv("barchart.csv", type, function(data) {

  // Data is nested by country
  var countries = d3.nest()
      .key(function(d) { return d.country; })
      .entries(data);

  // Parse dates and numbers. We assume values are sorted by date.
  // Also compute the maximum price per symbol, needed for the y-domain.
  // symbols.forEach(function(s) {
  //   s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; });
  //   s.maxPrice = d3.max(s.values, function(d) { return d.price; });
  // });

  // Compute the minimum and maximum year and percent across symbols.
  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, 0.4]);

  // Add an SVG element for each country, with the desired dimensions and margin.
  var svg = d3.select("#vis").selectAll("svg")
    .data(countries)
    .enter()
    .append("svg:svg")
    .attr("width", width+50)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	 .selectAll("text")
	.attr("font-size","1em");

  svg.append("g")

    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
	.attr("y",-15)
    .selectAll("tspan")
				.data(function(d) { return d.key.split(".")})
				.enter()
				.append("tspan")
				.attr("x",width- 250)

				.attr("dy","1em")
	//.attr("text-anchor", "start")
    .attr("font-size", "1.2em")
				.text(function(d){
					return d;
				});

  // Accessing nested data: https://groups.google.com/forum/#!topic/d3-js/kummm9mS4EA
  // data(function(d) {return d.values;})
  // this will dereference the values for nested data for each group
  svg.selectAll(".bar")
      .data(function(d) {return d.values;})
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.percent); })
      .attr("height", function(d) { return height - y(d.percent); })
      .attr("fill", function(d) {return color(d.year)})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  svg.call(tip);

});

function type(d) {
  d.percent = +d.percent;
  return d;
}
	    function update(){

      // For each check box:
      d3.selectAll(".checkbox").each(function(d){
        cb = d3.select(this);
        grp = cb.property("value")

        // If the box is check, I show the group
        if(cb.property("checked")){
          svg.selectAll("."+grp).transition().duration(1000).style("opacity", 1).attr("r", function(d){ return size(d.size) })

        // Otherwise I hide it
        }else{
          svg.selectAll("."+grp).transition().duration(1000).style("opacity", 0).attr("r", 0)
        }
      })
    }

    // When a button change, I run the update function
    d3.selectAll(".checkbox").on("change",update);

    // And I initialize it at the beginning
    update()
