// turns the entity to the set color and rotates it with constant speed
/**
	* this.el is the entity element.
	* this.el.object3D is the three.js object of the entity.
	* this.data is the component's property or properties.
	*/
AFRAME.registerComponent('best-component', {
	// public values, accesible through HTML
  schema: {
  	color: {default: '#ff0000'},
  	speed: {default: 0.01}
  },

  // initialization function
  init: function () {
  	console.log(this.data.color);
  	this.el.object3D.children[0].material.color.set( new THREE.Color(this.data.color));
  },

  // called when initialized and component is updated via setAttribute
  update: function () {},

  // called per render loop
  tick: function () {
  	this.el.object3D.rotation.y += this.data.speed;
  },

  // called when component is removed
  remove: function () {},

  // called when entity/scene is paused
  pause: function () {},

  // called when entity/scene is played
  play: function () {}
});