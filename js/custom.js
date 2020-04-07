(function() {
    var button = document.getElementById('play-stop-icon');

    var countries = [ 'Italy', 'China', 'Japan', 'France', 'Canada', 'Australia', 'Brazil' ],
        playInterval,
        stopInterval,
        countryIndex = 0,
        stopCounter = 0, 
        PLAYSPEED = 30000,
        STOPSPEED = 30000;
    
    var play = function() {
        var conutry = countries[countryIndex];
        //selectVisualization( timeBins, '2010', [conutry], ['Military Weapons','Civilian Weapons', 'Ammunition'], ['Military Weapons','Civilian Weapons', 'Ammunition'] );
        selectVisualization( timeBins, '2010', [conutry], [], [] );
        countryIndex++;
        
        if ( countryIndex === countries.length ) countryIndex = 0;
    }    

    var stop = function() {
        stopCounter++;
        if( stopCounter === (PLAYSPEED / 100) ) button.click();
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

    button.addEventListener('click', handleClick);

    playInterval = setInterval(play, PLAYSPEED);
}());


// myFunc();

// var mapCountryName = function(country) {
//     var mappedCountry = '';

//     switch(country) {
//         case 'KOREA, REPUBLIC OF':
//             mappedCountry = '한국';
//             break;

//     }

//     return mappedCountry;
// }