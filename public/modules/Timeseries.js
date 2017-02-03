function Timeseries(selection){
	// selection.datum() 	//call function to get the array back of the function
							//when using advanced function calling

	var m = {t:20, r:20, b:20, l:20},
		w = selection.node().clientWidth - m.l - m.r,
		h = selection.node().clientHeight - m.t - m.b;

	var arr = selection.datum() || []; //anticipating people not binding data to the function

	var T0 = new Date(2011, 0, 1),
		T1 = new Date(2013, 11, 31);

	// ---- layout and transform the data ----
	var histogram = d3.histogram()
		.domain([T0, T1]) //defines window to discard outliers
		.value(function(d) { return d.startTime; })
		.thresholds(d3.timeDay.range(T0, T1, 1)); //generates an array from T0 to T1, jumps every day

	var binDays = histogram(arr); //this generates the array of data! (bins)


	// ---- Scales ----
	var scaleX = d3.scaleTime().domain([T0, T1]).range([0, w]),
		scaleY = d3.scaleTime().domain([
			0,
			d3.max(binDays, function(d) { return d.length;}
			)])
		.range([h, 0]);


	// ---- Line and Area generators ----
	var line = d3.line()
		.x(function(d) { return scaleX(d.x0); })
		.y(function(d) { return scaleY(d.length); });

	var area = d3.area()
		.x(function(d) { return scaleX(d.x0); })
		.y(function(d) { return scaleY(d.length); });


	// --- Represent ----
	var svg = selection.selectAll('svg')
		.data([binDays]); //UPDATE

	var svgEnter = svg.enter()
		.append('svg'); //ENTER

	svgEnter
		.merge(svg) //ENTER + UPDATE
		.attr('width', w + m.l + m.r)
		.attr('height', h + m.t + m.b);

	var plotEnter = svgEnter.append('g').attr('class', 'plot')
		.attr('transform', 'translate(' + m.l + ',' + m.t + ')');

	plotEnter.append('path').attr('class', 'line');
	plotEnter.append('g').attr('class', 'axis axis-x');
	plotEnter.append('path').attr('class', 'area');
	plotEnter.append('g').attr('class', 'axis axis-y');

	// UPDATE
	var plotUpdate = svg.select('g').merge(plotEnter); //this emcompasses the update and also the first time (plotEnter)

	plotUpdate.select('area').datum(binDays).attr('d', line);
	plotUpdate.select('.axis-y');
	plotUpdate.select('line').datum(binDays).attr('d', line);
	plotUpdate.select('axis-x');









}