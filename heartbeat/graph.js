var heartbeat = function() {

    var self = this;

    var n = 80,
        random = d3.random.normal(0, 0),
        data = d3.range(n).map(random);

    var margin = {
            top: 20,
            right: 100,
            bottom: 20,
            left: 0
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
    this.interval = 40;
    this.heartbeat = "normal"
    this.vals = [];
    this.isInBeat = false;
    this.inHistory = [];
    this.lastDelta = 0;

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

        evc = parseInt(evc);
        pvc = parseInt(pvc);

        //Weight the goal conversions
        evc = evc * 2;

        var delta = 0;
        var total = pvc + evc;

        if (this.lastPageViewCount < pvc) {
            delta += pvc - this.lastPageViewCount;
        }
        if (this.lastEventsCount < evc) {
            delta += evc - this.lastEventsCount;
        }

        this.vals.push(delta);
        //Newer Code using past data
        this.inHistory.push(delta);
        this.lastDelta = delta;

        if (this.vals.length > 10) {
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
            .ease("linear")
            .attr("transform", "translate(" + x(-1) + ",0)")
            .each("end", this.start);

        // pop the old data point off the front
        data.shift();

    }


      /****************************

	Gets average from history

	****************************/

    this.getAverage = function(){

        var sum = 0;
        for( var i = 0; i < this.inHistory.length; i++ ){
            sum += parseInt( this.inHistory[i], 10 ); //don't forget to add the base
        }

        var avg = sum/this.inHistory.length;

        return avg;

    }


    /****************************

	Gets max value from history

	****************************/
    this.getMax = function(){

        if(self.inHistory.length > 0){
        return Math.max.apply(null, self.inHistory);
        }
        else {
            return 0;
        }

    }


  /****************************

	Calls the Heart Beat

	****************************/

    this.start = function() {

        var func;
        var sum = 0;
        var avg = self.getAverage();
        var max = self.getMax();


        //Old code
        for (var x in self.vals) {
            sum += self.vals[x]
        }


      /*  if (sum >= 8 && sum <= 16) {
            func = _normal();
            self.heartbeat = "Normal";
            $('#type').text("Normal");
        }
        if (sum <= 2) {
            func = _asystole();
            self.heartbeat = "Asystole";
            $('#type').text("Asystole");
        }
        if (sum > 16) {
            func = _tachycardia();
            self.heartbeat = "Tachycardia";
            $('#type').text("Tachycardia");
        }
        if (sum < 8 && sum > 2) {
            func = _bradycardia();
            self.heartbeat="Bradycardia";
            $('#type').text("Bradycardia");
        }
        */

        if (self.inHistory.length==0 || self.lastDelta <= 0) {

            var sumLastThree = 0;

            if(self.inHistory.length>=3){
                var arrHolder = self.inHistory;
                var lastThree = arrHolder.slice(-3);
                sumLastThree = lastThree[0] + lastThree[1] + lastThree[2];
            }

            if(sumLastThree == 0){
                func = _asystole();
                self.heartbeat = "Asystole";
                $('#type').text("Asystole");
            } else{
                func = _bradycardia();
                self.heartbeat="Bradycardia";
                $('#type').text("Bradycardia");
            }

        }

        else if (self.lastDelta  > 0 && self.lastDelta <= (avg/2)) {
            func = _bradycardia();
            self.heartbeat="Bradycardia";
            $('#type').text("Bradycardia");
        }


        else if ( self.lastDelta > (avg/2) && self.lastDelta < (max/2) ) {
            func = _normal();
            self.heartbeat = "Normal";
            $('#type').text("Normal");
        }

       else if ( self.lastDelta >= (max/2) ) {
            func = _tachycardia();
            self.heartbeat = "Tachycardia";
            $('#type').text("Tachycardia");

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

        var nums = [0, .05, .08, .05, 0, 0, 0, -.2, .7, -.3, -.03, 0, 0, 0, 0, .06, .13, .15, .13, .06, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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

        var nums = [0, .05, .08, .05, 0, 0, 0, -.2, .7, -.3, -.03, 0, 0, 0, 0, .06, .13, .15, .13, .06];

        if (self.cyclePoint > nums.length - 1) {
            self.cyclePoint = 0
        }

        var point = nums[self.cyclePoint];


        return point;

    }

    var _bradycardia = function() {
        var nums = [0, .05, .08, .05, 0, 0, 0, -.2, .7, -.3, -.03, 0, 0, 0, 0, .06, .13, .15, .13, .06, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        if (self.cyclePoint > nums.length - 1) {
            self.cyclePoint = 0
        }

        var point = nums[self.cyclePoint];

        return point;

    }



}
