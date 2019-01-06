var svg = d3.select("#Tobacco").select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection



d3.queue()
  .defer(d3.json, "countries.geo.json")  // World shape
  .defer(d3.csv, "happy.csv") // Position of circles
  .await(ready);


function ready(error, dataGeo, data) {

  // Create a color scale
 /* var allContinent = d3.map(data, function(d){return(d.homecontinent)}).keys()
  var color = d3.scaleOrdinal()
    .domain(allContinent)
    .range(d3.schemePaired);
*/
  // Add a scale for bubble size
  var valueExtent = d3.extent(data, function(d) { return +d.n; })
  var size = d3.scaleSqrt()
    .domain(valueExtent)  // What's in the data
    .range([2, 12])  // Size in pixel

  // Draw the map
/*  svg.append("g")
      .selectAll("path")
      .data(dataGeo.features)
      .enter()
      .append("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
      .style("stroke", "none")
      .style("opacity", .3)
*/

  // Add circles:
  var myCircles=svg
    .selectAll("myCircles")
    .data(data.sort(function(a,b) { return +b.n - +a.n }).filter(function(d,i){ return i<1000 }))
    .enter()
    .append("circle")


      .attr("cx", function(d){ return projection([+d.homelon, +d.homelat])[0] })
      .attr("cy", function(d){ return projection([+d.homelon, +d.homelat])[1] })
	 // .transition().duration(2000)
      .attr("r", function(d){ return size(+d.n) })
    .style("fill", function(d){ if(d.n>6916){return "#FF3500"}else{return "#FFB800"} })
	  .attr("stroke",function(d){ if(d.n>6916){return "#A62300"}else{return "none"} })
	 .attr("stroke-width", 1.5)
      .attr("fill-opacity", .4)
  .attr("class","bubble")

myCircles.attr("opacity",0)

}
