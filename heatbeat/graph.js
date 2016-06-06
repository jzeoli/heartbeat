var heartbeat = function() {

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
        width = window.innerWidth - margin.left - margin.right,
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
        .x(function(d, i) {
            return x(i);
        })
        .y(function(d, i) {
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
    this.vals = [];
    this.isInBeat = false;

    /****************************

    Build Chart Initially

    ****************************/
    this.init = function() {


    }

    /****************************

    Determine Heartbeat

    ****************************/
    //saved vars
    this.lastPageViewCount = 0;
    this.lastEventsCount = 0;

    this.getBeat = function(pvc, evc) {
        //Weight the goal conversions
        evc = evc * 2;

        var self = this;
        var delta = 0;

        if (this.lastPageViewCount < pvc) {
            delta += pvc - this.lastPageViewCount;
        }
        if (this.lastEventsCount < evc) {
            delta += evc - this.lastEventsCount;
        }

        this.vals.push(delta);

        if (this.vals.length > 30) {
            this.vals.splice(0, 1);
        }

        var bpms = 0;
        for (var i in this.vals) {
            bpms += self.vals[i];
        }

        this.lastPageViewCount = pvc;
        this.lastEventsCount = evc;

    }


    /****************************

    Makes the heart Beat

    ****************************/

    this.beat = function(value) {
        // push a new data point onto the back
        data.push(parseFloat(value));

        // redraw the line, and slide it to the left
        path
            .attr("d", line)
            .attr("transform", null)
            .transition()
            .duration(this.interval)
            .attr("transform", "translate(" + x(-1) + ",0)")
            .each("end", this.start);

        // pop the old data point off the front
        data.shift();

    }



  /****************************

	Calls the Heart Beat

	****************************/

    this.start = function() {

        var func;
        var sum = 0;

        for (var x in self.vals) {
            sum += self.vals[x]
        }

        if (sum >= 8 && sum <= 10) {
            func = _normal();
        }
        if (sum <= 2) {
            func = _asystole();
        }
        if (sum > 10) {
            func = _tachycardia();
        }
        if (sum < 8 && sum > 2) {
            func = _bradycardia();
        }

        var point = func;

        self.beat(point);

        self.cyclePoint++;

    }


    this.init();



    /**************************

    Private Functions: Templates

    ***************************/

    var _normal = function() {

        var nums = [0, .1, 0, -.15, -.2, .7, -.3, -.03, 0, 0, .1, .15, .05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        if (self.cyclePoint > nums.length - 1) {
            self.cyclePoint = 0
        }

        var point = nums[self.cyclePoint];


        return point;

    }

    var _asystole = function() {

        var nums = [0];

        if (self.cyclePoint > nums.length - 1) {
            self.cyclePoint = 0
        }

        var point = nums[self.cyclePoint];

        return point;

    }

    var _tachycardia = function() {

        var nums = [0, .1, 0, -.15, -.2, .7, -.3, -.03, 0, 0, .1, .15, .05, 0, 0];

        if (self.cyclePoint > nums.length - 1) {
            self.cyclePoint = 0
        }

        var point = nums[self.cyclePoint];


        return point;

    }

    var _bradycardia = function() {
        var nums = [0, .1, 0, -.15, -.2, .7, -.3, -.03, 0, 0, .1, .15, .05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        if (self.cyclePoint > nums.length - 1) {
            self.cyclePoint = 0
        }

        var point = nums[self.cyclePoint];

        return point;

    }



}
