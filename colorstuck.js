
		var width = 1400;
		var height = 600;

		var svg = d3.select("#Tobacco")
					.append("svg")
					.attr("width", width)
					.attr("height", height);

		var Tobacco_g = svg.append("g");

		var projection = d3.geoMercator()

		var geoGenerator = d3.geoPath()
			.projection(projection);

		var colorScale2 = d3.scaleLinear().range(["#CAFFFF", "#005757"]);

		var tooltip = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip");

		queue()
		    .defer(d3.json, "countries.geo.json")
		    .defer(d3.csv, "migrantstock.csv", typeAndSet)
		    .await(loaded);

		var CountryByName = d3.map();

		function typeAndSet(d){
			d.value = +d.value;
      d.Region = d.Region;
			CountryByName.set(d.Country, d)
			return d;

		}

		console.log(CountryByName);

		function getColor(d){
			var Country = CountryByName.get(d.properties.name);
			console.log(Country)

			if(Country){
				return colorScale2(Country.value);
			}else if (d.properties.name!="Antarctica"){
				return "#ccc";
			}
			else{
				return "#FFFFFF";
			}
		}

		function loaded(error, Tobacco, num){
			if(error) throw error;

			console.log(num);

			colorScale2.domain(d3.extent(num, function(g){
				return g.value;
			}))

			projection.fitSize([1400, 750], Tobacco);

			var Tobacco = Tobacco_g.selectAll("path")
				.data(Tobacco.features);
        console.log(Tobacco)

			Tobacco.enter()
				.append("path")
				.attr("d", geoGenerator)
				.attr("fill", function(d){ return getColor(d); })
				.on("mouseover", mouseoverFunc)
                .on("mousemove", mousemoveFunc)
                .on("mouseout", mouseoutFunc);

			var linear = colorScale2;

			svg.append("g")
				.attr("class", "legendLinear")
				.attr("transform", "translate(160,50)");

			var legendLinear = d3.legendColor()
				.shapeWidth(30)
				.orient("vertical")
				.labelFormat(d3.format(".4s"))
				.scale(linear);

			svg.select(".legendLinear")
				.call(legendLinear);

			svg.append("rect")
			   .attr("x",160)
			   .attr("y",135)
			   .attr("height",15)
			   .attr("width",30)
			   .attr("fill","#ccc")

			svg.append("text")
			   .attr("x",200)
			   .attr("y",149)
			   .attr("height",15)
			   .attr("width",30)
			   .attr("font-size",9)
			   .text("None")

// svg.attr("class","colorstuck").attr("opacity",0)

		}


		function mouseoverFunc(d) {

			if (d.properties.name!="Antarctica"){

			d3.select(this)
			.transition()
            .duration(300)
            .style("stroke-width", 1)
			.style("stroke", "grey")

            if (CountryByName.get(d.properties.name)){

            tooltip
                .style("display", null)
                .html("<p> Country: " + d.properties.name +"<br>Age-standardized Prevalence: " + CountryByName.get(d.properties.name)["value"] + "<br>Global Average: 21.9"+"</p>");

            } else {

            tooltip
                .style("display", null)
                .html("<p> No Data for " + d.properties.name + "</p>");
            }
        }

        }

        function mousemoveFunc(d) {

            tooltip
                .style("top", (d3.event.pageY - 10) + "px" )
                .style("left", (d3.event.pageX + 10) + "px");
        }

        function mouseoutFunc(d) {
            tooltip.style("display", "none");

            d3.select(this)
            .transition()
            .duration(300)
            .style("stroke", "none")
            .style("stroke-width", 2);

        }
