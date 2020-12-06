(function() {
            
    // Get Query String Params
    let params = window.getQueryParams();
    
    // Set this value if you want to hard code a src value
    let externalSrc = '';
    let externalTitle = '';

    // Set the dom ID where the Promethean TV SDK will mount.
    params.domId = 'ptv-root';

    // Set the channel &/or stream id for Unit Test 1 Default Stream if not passed into embed
    if(!params.channel) {          
      params.channel  = '5eb5f340a8dc106a89cbe590';        
    }

    if(!params.stream) {
      params.stream = '5eb5f45049fd126a900c7d8c';
    }

    // console.log('Query Params', params);

    const videoElement = document.getElementById('video');
    const containerElement = document.getElementById('video-container')
    const player = new shaka.Player(videoElement);

    //Setting UI configuration JSON object
    const uiConfig = {};

    //Configuring elements to be displayed on video player control panel
    uiConfig['controlPanelElements'] = ['play_pause', 'mute', 'volume', 'time_and_duration', 'fullscreen', 'overflow_menu' ];
		  
    //Setting up shaka player UI
    const ui = new shaka.ui.Overlay(player, containerElement, videoElement);

    ui.configure(uiConfig); //configure UI

    const controls = ui.getControls();

    const app = new PTV(null, params);

    // Store objects in global scope for easy access.
    window.player = player;
    window.ptvSdk = app;
    window.params = params;

    // Check to see if we should load the video src via params or hard coded value.
    if(params.src || externalSrc) {
      document.title = params.title | externalTitle;
      player.load(params.src || externalSrc);
    } else {
      // SDK load config callback event
      app.on(PTV.EventType.CONFIG_READY, data => {  
        console.log("SHAKA Player Load", data.src);
        document.title = data.stream.name || 'PrometheanTV Shaka Video Player'
        player.load(data.src);
      });
    }
    
    // Error callback events
    player.addEventListener('error', (error) => {
      console.log('SHAKA PLAYER ERROR', error)
      app.stop();
    });
    controls.addEventListener('error', (error) => {
      console.log('SHAKA PLAYER CONTROLS ERROR', error)
      app.stop();
    });
    videoElement.addEventListener('error', () => {
      console.log('SHAKA VIDEO ERROR', error);
      app.stop();
    });
    
    // Player callback events
    videoElement.addEventListener('play', function firstplay () {
      app.start();
      videoElement.removeEventListener('play', firstplay);
    });
    videoElement.addEventListener('ended', () => app.stop());    
    videoElement.addEventListener('pause', () => app.hide());
    videoElement.addEventListener('play', () => app.show());
    videoElement.addEventListener('timeupdate', () =>
      app.timeUpdate(videoElement.currentTime)
    );
        
  })();