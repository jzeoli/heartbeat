var heartbeat = function () {

	var self = this;

	var n = 40,
			random = d3.random.normal(0, 0),
			data = d3.range(n).map(random);

		var margin = {
				top: 20,
				right: 20,
				bottom: 20,
				left: 40
			},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		//Width scale of the line graph
		var x = d3.scale.linear()
			.domain([0, n - 1])
			.range([0, width]);

		//Height scale of the line graph
		var y = d3.scale.linear()
			.domain([-1, 1])
			.range([height, 0]);


		//Build Line
		var line = d3.svg.line()
			.interpolate("cardinal")
			.x(function (d, i) {
				return x(i);
			})
			.y(function (d, i) {
				return y(d);
			});

		//Append the SVG to body
		var svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		//Build ClipPath
		svg.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);

		var path = svg.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);





	/**********************

	Global Vars

	************************/

	this.cyclePoint = 0;
    this.interval = 50;
    this.heartbeat = "normal"


	/****************************

	Build Chart Initially

	****************************/
	this.init = function () {


	}


	/****************************

	Makes the heart Beat

	****************************/

	this.beat = function (value) {
		// push a new data point onto the back
		data.push(parseFloat(value));

		// redraw the line, and slide it to the left
		path
			.attr("d", line)
			.attr("transform", null)
			.transition()
			.duration(this.interval)
			.ease("linear")
			.attr("transform", "translate(" + x(-1) + ",0)")
			.each("end", this.start);

		// pop the old data point off the front
		data.shift();

	}



		/****************************

	Calls the heart Beat

	****************************/

	this.start = function(){

		var point = 0;

		if(self.cyclePoint == 0){
			point = 0;

		} else if (self.cyclePoint == 2) {
			point = -.1;

		} else if(self.cyclePoint == 4){
			point = -.15;

		} else if(self.cyclePoint == 6){
			point = .7;

		} else if(self.cyclePoint == 8){
			point = -.3;

		} else if(self.cyclePoint == 10){
			point = 0;

		} else if(self.cyclePoint == 12){
			point = .15;

		}  else if(self.cyclePoint >=20){
			self.cyclePoint = -1
		}

			self.cyclePoint++;

		self.beat(point);
	}


	this.init();

}
