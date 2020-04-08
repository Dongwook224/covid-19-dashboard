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

    // EventHandler
    button.addEventListener('click', handleClick);

    // Executions
    playInterval = setInterval(play, PLAYSPEED);
    //requestData();
    //animateCircle();
}());



var setPositionOfCircle = function( x, y, z ) {
    var circle = document.getElementById('circle-wrapper');
   
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
    circle.style.zIndex = z;
}
