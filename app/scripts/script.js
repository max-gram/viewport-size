var popup = {
  init: function(){
    var DIV_ID    = 'ViewportSizeExtension';
    var dom       = document.getElementById(DIV_ID);

    if(!dom){
      var el      = document.createElement('div');
      el.id       = DIV_ID;
      this.el     = document.body.appendChild( el );
    }else{
      this.el     = dom;
    }

    this.popupTimeout = null;
    this.destroy      = this.destroy.bind(this);
    this.resizeEvent  = this.resizeEvent.bind(this);
    this.updatePopup  = this.updatePopup.bind(this);

    window.addEventListener( 'resize', this.resizeEvent );
  },
  destroy: function(){
    window.clearTimeout( this.popupTimeout );
    window.removeEventListener( 'resize', this.resizeEvent );

    this.el.parentNode.removeChild(this.el);
  },

  resizeEvent: function(){
    this.updatePopup();
    if(this.el.className !== 'visible') this.el.className  = 'visible';

    window.clearTimeout( this.popupTimeout );
    this.popupTimeout = window.setTimeout( function() {
      this.el.className = '';
    }.bind(this), 1000 );
  },
  updatePopup: function(){
    this.el.innerHTML = window.innerWidth + ' x ' + window.innerHeight;
  }
};


window.addEventListener('message', function(event) {
  if (event.source !== window) { return; }

  var message = event.data;
  if (typeof message !== 'object' || message === null || message.key !== 'injected-vs-event') { return; }

  if(message.type === 'init-vs-popup') popup.init();
  else if(message.type === 'destroy-vs-popup') popup.destroy();
});
