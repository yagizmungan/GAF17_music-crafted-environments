/**
 * Create city blocks and environment based on music
 * by Yagiz Mungan for Gray Area Festival 2017
 * inspired by  audioanalyser-levels-scale from Kevin Ngo
 *
 */
AFRAME.registerComponent('song-city', {
  // the options for this component
  // we can also define defaults here
  schema: {
    analyserEl: {type: 'selector'},
    maxScale: {default: 20},
    multiplier: {default: 100},
    frequencyDivisions: {default: 128},
    buildingMixin: {default: ''},
    layout: {default: ''},
    fancyLightsEl: {type: 'selector'},
    zSpeed: {default: 0.01},
  },


  init: function(){
    // initialize variables
    // think of these as private
    // as opposed to the data as the public
    this.containerZ = 0;
    this.songEnded = false;
    this.postSongProcessing = false;

    // reference this inside events
    var self = this;
    var analyserEl = this.data.analyserEl || this.el;
    var el = this.el;
    var data = this.data;

    // detect the end of music file
    document.getElementById('song').onended = function(){
      self.songEnded = true;
    }

    // Create magic


    // On beat create buildings
    // Create a line of buildings along X
    // their size will be based on the frequency spectrum
    // they will spread through Z (time)
    analyserEl.addEventListener('audioanalyser-beat', function () {
      // we can create a-frame components like regular HTML elements
      var container_entity = document.createElement('a-entity');
      // we can set attributes in the way similar to HTML elements
      container_entity.setAttribute('position', {
        x: 0,
        y: 0,
        z: self.containerZ
      });

      // this is the frequency response from the music
      // spread of volume through frequencies
      var levels = analyserEl.components.audioanalyser.levels;

      var levelsCompressionRate = levels.length/data.frequencyDivisions;

      // initialize position.x of the first building to 0
      var xPosition = 0;
      for (var i = data.frequencyDivisions - 1; i >= 0; i--) {

        
        var volumeScale = 0;
        for(var j = i * levelsCompressionRate; j < (i+1) * levelsCompressionRate; j++){
          // clamping the scale (optional)
          volumeScale += Math.min(data.maxScale, Math.max(levels[i] * data.multiplier, 0.05));
        };

        volumeScale = volumeScale/levelsCompressionRate;       
        

        // do not do anything if it is too small (optional)
        if(volumeScale < 0.1){
          return;
        }      

        // this will be our building
        var entity = document.createElement('a-entity');
        // the mixin is defined in HTML
        entity.setAttribute('mixin', data.buildingMixin);

        // size
        entity.setAttribute('scale', {
          x: volumeScale,
          y: volumeScale * 3,
          z: volumeScale
        });

        // position
        entity.setAttribute('position', {
          x: xPosition,
          y: volumeScale * 3/2,
          z: volumeScale/2
        });

        // spread along the X axis (for the next one)
        xPosition += volumeScale + 3;

        // same as HTML
        container_entity.appendChild(entity);
      }
      el.appendChild(container_entity);
    });
   
  },

  tick: function (time) {
    // if the song has not ended
    if(!this.songEnded){
      // calculate the new Z
      this.containerZ = time * this.data.zSpeed;

      // get the current position of fancyLights
      var fancyLightPosition = this.data.fancyLightsEl.getAttribute('position');
      // get the current average volume
      var averageVolume = this.data.analyserEl.components.audioanalyser.volume;
      
      var lightYScale = 10;
      var lightXScale = 1;
      var lightZScale = 1;

      // move fancyLights along the time line with Z
      // set fancyLights height with the average volume
      this.data.fancyLightsEl.setAttribute('position',{
        x : fancyLightPosition.x * lightXScale,
        y : averageVolume * lightYScale,
        z : this.containerZ * lightZScale
      });

      
      // Let's draw some "mountains" to frame our scene
      // Mountains will be composed vertical lines roofed by a line 
      // defining the mountain skyline
      // Optional you can turn this into a curved visuals
      // the code below will be traditional THREE.JS

      // Colors do not need to be realistic
      // materials for the mountain, defines styling
      var materialMountainTop = new THREE.LineBasicMaterial({
        color: 0xeeeeee
      });
      var materialMountainLine = new THREE.LineBasicMaterial({
        color: 0x888888
      });

      var mountainYScale = 0.9;
      var mountainXScale = 1;
      var mountainZScale = 5;

      for(var i = 0; i < this.data.fancyLightsEl.children.length; i++){
        // this is the mountain top skyline
        // we will create a basic line from the previous position of the fancy light to current
        var positionPreviousMountainTop = new THREE.Vector3(this.data.fancyLightsEl.children[i].getAttribute('position').x * mountainXScale, fancyLightPosition.y * mountainYScale, fancyLightPosition.z * mountainZScale);
        var positionCurrentMountainTop = new THREE.Vector3(this.data.fancyLightsEl.children[i].getAttribute('position').x * mountainXScale, averageVolume * lightYScale * mountainYScale, this.containerZ * mountainZScale);
        
        // simple geometry composed of two dots in space (enough for a line)
        var geometryMountainTop = new THREE.Geometry();
        geometryMountainTop.vertices.push(
          positionPreviousMountainTop,
          positionCurrentMountainTop
        );

        // create a mesh from geometry and material as usual
        var lineMountainTop = new THREE.Line(geometryMountainTop, materialMountainTop );
        // document.querySelector('a-scene').object3D is "scene" from three.js point of view
        document.querySelector('a-scene').object3D.add(lineMountainTop );

        // THREE.Vector3.clone() gives us an original copy not the reference
        var positionPreviousMountainLine = positionPreviousMountainTop.clone(); //new THREE.Vector3(mountainPrevious);
        var positionCurrentMountainLine = positionCurrentMountainTop.clone(); //new THREE.Vector3(mountainCurrent);
        // we are drawing these as vertical lines so fro ground
        positionPreviousMountainLine.y = 0;

        var geometryMountainLine = new THREE.Geometry();
        geometryMountainLine.vertices.push(
          positionPreviousMountainLine,
          positionCurrentMountainLine
        );

        var lineMountainLine = new THREE.Line(geometryMountainLine, materialMountainLine);
        document.querySelector('a-scene').object3D.add(lineMountainLine );
      }
    }
    else {
      // final processing after the song is over      
      if(!this.postSongProcessing) {
        // and lets make sure we run this once
        this.postSongProcessing = true;
      }
    }
  }
});
