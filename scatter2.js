var marginforscatter={top:50,right:10,bottom:50,left:50};
var widthforscatter=700-marginforscatter.left-marginforscatter.right;
var heightforscatter=600-marginforscatter.top-marginforscatter.bottom;
var svgforscatter = d3.select("#scatterplot")
                          .append("svg")
                          .attr("width", widthforscatter + marginforscatter.left + marginforscatter.right)
                          .attr("height", heightforscatter + marginforscatter.top + marginforscatter.bottom)
                          .append("g")
                          .attr("transform","translate(" + marginforscatter.left + "," + marginforscatter.top + ")")


d3.csv("scatterplot.csv", function(data) {

//get r
var rforscatter = d3.scaleSqrt()
.domain([0.1, 0.25])
.range([10, 30]);

// Add X axis
var xforscatter = d3.scaleLinear()
.domain([0, 0])
.range([ 0, widthforscatter ]);
svgforscatter.append("g")
.attr("class", "Xaxisforscatter")   // Note that here we give a class to the X axis, to be able to call it later and modify it
.attr("transform", "translate(0," + heightforscatter + ")")
.call(d3.axisBottom(xforscatter))
.attr("opacity", "0")
.append("text")
.attr("dx", "1em")
.attr("x", 500)
  .attr("y", -10)
.style("text-anchor", "start")
  .style("fill", "gray")
.style("font-size","1.5em")
 .text("Negative affect")
// Add Y axis
var yforscatter = d3.scaleLinear()
.domain([0, 0.4])
.range([ heightforscatter, 0]);
svgforscatter.append("g")
.call(d3.axisLeft(yforscatter))
.append("text")
.attr("dy", "1em")
.attr("x", -50)
  .attr("y", -35)
.style("text-anchor", "start")
  .style("fill", "gray")
.style("font-size","1.5em")
 .text("Positive affect");

svgforscatter.append('g')
.selectAll("dot")
.data(data)
.enter()
.append("circle")
  .attr("cx", function (d) { return xforscatter(d.negativeaffect); } )
  .attr("cy", function (d) { return yforscatter(d.positiveaffect); } )
  .attr("r", function(d){return rforscatter(d.lifeevaluation);})
  .style("fill", function(d){if(d.kind==="All individuals with .a household member abroad"){return "#dc7a7a";}else if(d.kind==="Individuals with a household member .abroad for temporary work"){return"#dc9b65";}else if(d.kind==="Individuals receiving remittances .from relatives abroad"){return "#8e98e2";}else {return "#24c124";}
            })
.style("opacity","0.7");
// new X axis
xforscatter.domain([0, 0.4])
svgforscatter.select(".Xaxisforscatter")
.transition()
.duration(1500)
.attr("opacity", "1")
.call(d3.axisBottom(xforscatter));

svgforscatter.selectAll("circle")
.transition()
.delay(function(d,i){return(i*3)})
.duration(2000)
.attr("cx", function (d) { return xforscatter(d.negativeaffect); } )
.attr("cy", function (d) { return yforscatter(d.positiveaffect); } )
//  .attr("r", function(d){return d.lifeevaluation})



//add legend:circles
var valuesToShowforscatter = [0.1, 0.2]
var xCircleforscatter = 180
var xLabelforscatter = 280
var yCircleforscatter = 230

svgforscatter
.selectAll("legend")
.data(valuesToShowforscatter)
.enter()
.append("circle").attr("opacity","0").transition().duration(2000).attr("opacity","1")
.attr("cx", xCircleforscatter+200)
.attr("cy", function(d){ return yCircleforscatter - rforscatter(d) } )
.attr("r", function(d){ return rforscatter(d) })
.style("fill", "none")
.attr("stroke", "black")

// Add legend: segments
svgforscatter
.selectAll("legend")
.data(valuesToShowforscatter)
.enter()
.append("line").attr("opacity","0").transition().duration(2000).attr("opacity","1")
.attr('x1', function(d){ return xCircleforscatter + rforscatter(d)+200 } )
.attr('x2', xLabelforscatter+200)
.attr('y1', function(d){ return yCircleforscatter - rforscatter(d) } )
.attr('y2', function(d){ return yCircleforscatter - rforscatter(d) } )
.attr('stroke', 'black')
.style('stroke-dasharray', ('2,2'))

// Add legend: labels
svgforscatter
.selectAll("legend")
.data(valuesToShowforscatter)
.enter()
.append("text").attr("opacity","0").transition().duration(2000).attr("opacity","1")
.attr('x', xLabelforscatter+200)
.attr('y', function(d){ return yCircleforscatter - rforscatter(d) } )
.text( function(d){ return d } )
.style("font-size", 10)
.attr('alignment-baseline', 'middle')

//add 图例
svgforscatter.selectAll("circlesforlabels")
  .data(data)
  .enter()
  .append("circle")
.attr("opacity","0")
.transition().duration(2000)
    .attr("cx",370)
    .attr("cy", function(d,i){ return 25 + i*(40)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){if(d.kind==="All individuals with .a household member abroad"){return "#dc7a7a";}else if(d.kind==="Individuals with a household member .abroad for temporary work"){return"#dc9b65";}else if(d.kind==="Individuals receiving remittances .from relatives abroad"){return "#8e98e2";}else {return "#24c124";}
            })
  .style("opacity","0.7")

svgforscatter.selectAll("labelsforscatter")
          .data(data)
            .enter()
              .append("text")
            .style("fill", "gray")
            .style("opacity","0.7")

              .attr("y", function(d,i){ return 0 + i*(40) + (5)}) // 100 is where the first dot appears. 25 is the distance between dots
          .selectAll("tspan")
    .data(function(d) { return d.kind.split(".")})
    .enter()
    .append("tspan")
.attr("opacity","0")
.transition().duration(2000)
          .attr("x", 390)
.style("opacity","0.8")
          .attr("dy","1.2em")
          .attr("font-size","0.85em")
            .text(function(d){ return d})

});
