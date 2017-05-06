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
  },


  init: function(){
    // initialize variables
    // think of these as private
    // as opposed to the data as the public
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
      console.log('song ended');
    }

    analyserEl.addEventListener('audioanalyser-beat', function () {
      console.log('beat detected'); 
    });
  },

  tick: function (time) {
    // if the song has not ended
    if(!this.songEnded){
      // calculate the new Z
      this.containerZ = time * this.data.zSpeed;
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
