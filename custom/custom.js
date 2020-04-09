(function() {
    // variables
    var button = document.getElementById('play-stop-icon');

    var url = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc&outSR=102100&resultOffset=0&resultRecordCount=190&cacheHint=true';
    
    var countries = [ 'Italy', 'China', 'Japan', 'France', 'Canada', 'Australia', 'Brazil' ],
        playInterval,
        stopInterval,
        countryIndex = 0,
        stopCounter = 0, 
        PLAYSPEED = 300000,
        STOPSPEED = 30000;
    

    // functions
    var play = function() {
        var country = countries[countryIndex];
        update(country);
        countryIndex++;
        
        if ( countryIndex === countries.length ) countryIndex = 0;
    }

    var stop = function() {
        stopCounter++;
        if( stopCounter === (PLAYSPEED / 100) ) button.click();
    }

    var update = function(country) {
        var title = document.getElementById('top-title'),
            confirmed = document.getElementById('confirmed');

        selectVisualization( timeBins, '2010', [country], [], [] );

        title.innerText = customConfig.korean[country.toUpperCase()];
        confirmed.innerText = Math.floor( Math.random() * 10000 );
    }

    var toggleButton = function(target) {
        switch ( target ) {
            case 'fa-play':
                button.classList.remove('fa-play');
                button.classList.add('fa-stop');
                button.title = '중지';
                break;

            case 'fa-stop':
                button.classList.remove('fa-stop');
                button.classList.add('fa-play');
                button.title = '재생';
                break;
        }
    }

    var handleClick = function(event) {
        console.log(':::handleClick')
        var target = event.target.classList[1];
        stopCounter = 0;

        switch ( target ) {
            case 'fa-play':
                isPlay = true;
                toggleButton(target);
                clearInterval(stopInterval);
                playInterval = setInterval(play, PLAYSPEED);
                break;

            case 'fa-stop':
                isPlay = false;
                toggleButton(target);
                clearInterval(playInterval);
                stopInterval = setInterval(stop, STOPSPEED);
                break;
        }
    }

    var requestData = function() {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if( xhr.readyState === 4 && xhr.status === 200 ) {
                var data = JSON.parse(xhr.response).features;
                processData(data);
            }
        }

        xhr.open('GET', url);
        xhr.send();
    }

    var processData = function(data) {
        var countries = [ 'Italy', 'China', 'Japan', 'France', 'Canada', 'Australia', 'Brazil', 'Korea, South' ];
        var filteredData = data.filter( d => countries.includes(d.attributes.Country_Region) );
        console.log(filteredData);  
    }
    
    var animateCircle = function() {
        var tl = new TimelineLite({
            repeat:-1,
            onReverseComplete:function() { tl.reverse(0) },
            onComplete:function() { tl.restart() },
        });
    
        var animate = function() {
            tl.set("#circle", {scale:0, opacity:0})
           
            tl.set("#circle", {scale:0, opacity:0})
            tl.to("#circle", 0.7, { scale:1, opacity:1 })
              .to("#circle", 0.7, { scale:1.5, opacity:0 })
        }

        animate();
    }

    var drawChart = function() {
        var countryIndex = 1;

        var margin = { left: 10, right: 10, top: 50, bottom: 10 };

        var width = 300 - margin.left - margin.right,
            height = 100 - margin.top - margin.bottom;

        var t = d3.transition().duration(750);

        var g = d3.select("#custom-chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        var xAxisGroup = g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0, " + height + ")");

        var yAxisGroup = g.append("g")
            .attr("class", "y-axis");

        // X Scale
        var x = d3.scaleTime()
            .range([0, width])
        // Y Scale
        var y = d3.scaleLinear()
            .range([height, 0]);

        // X Label
        g.append("text")
            .attr("y", height + 50)
            .attr("x", width / 2)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle");

        // Y Label
        var yLabel = g.append("text")
            .attr("y", -60)
            .attr("x", -(height/2))
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)");

        var yFormat = d3.format(",");

        d3.json("/custom/covid19.json").then( data => {
            var countries = Object.keys(data);
            var target = data[countries[0]];
            console.log(data);

            // d3.interval( () => {
            //     var countries = Object.keys(data);
            //     var target = data[countries[countryIndex]];
            //     update(target);
            //     countryIndex++;

            //     if(countryIndex === countries.length) countryIndex = 0;
            // }, 1000);

            update(target);
        });

        var update = function(data) {
            var data = data.map(d => Object.assign({}, d)),
                dateRange;
            
            data.forEach( d => {
                d.date = d3.timeParse("%m/%d/%y")(d.date);
                d.date = new Date(d.date);
                d.confirmed = +d.confirmed;
            });

            dateRange = d3.extent(data, d => d.date);
            x.domain(dateRange);
            y.domain([0, d3.max(data, d => d.confirmed ) ]);

            var xAxisCall = d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%y-%m-%d'));
            xAxisGroup.transition(t).call(xAxisCall)
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            var yAxisCall = d3.axisLeft(y)
                .tickFormat( d =>yFormat(d) );
            yAxisGroup.transition(t).call(yAxisCall);
            
            var rects = g.selectAll("rect")
                .data( data, d => d.date );
            
            rects.exit()
                .attr("fill", "red")
            .transition(t)
                .attr("y", y(0))
                .attr("height", 0)
                .remove();

            rects.enter()
                .append("rect")
                    .attr("fill", "yellow")
                    .attr("y", y(0))
                    .attr("height", 0)
                    .attr("x", d => x(d.date) )
                    .attr("width", 2)
                    .merge(rects)
                    .transition(t)
                        .attr("x", d => x(d.date) )
                        .attr("width", 2)
                        .attr("y", d => y(d.confirmed))
                        .attr("height", d => height - y(d.confirmed));
        }
    }

    // EventHandler
    button.addEventListener('click', handleClick);

    // Executions
    playInterval = setInterval(play, PLAYSPEED);
    drawChart();
    //requestData();
    //animateCircle();
}());



var setPositionOfCircle = function( x, y, z ) {
    var circle = document.getElementById('circle-wrapper');
   
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
    circle.style.zIndex = z;
}
