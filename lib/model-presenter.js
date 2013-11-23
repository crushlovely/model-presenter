var _ = require('underscore');




Presenter = function() {}

Presenter.extend = function( obj ) {
  return _(this).extend( obj );
}

Presenter.extend({


  bind: function( model ) {
    var self = this;

    model.present = function( strategy ) {
      var attributes = (self.serializer) ? self.serializer( model ) : model;
      return self.build( attributes, strategy );
    }
  }


, build: function( attributes, strategy ) {
    var self = this;
    var strategy = this.strategies ? this.strategies[strategy] : null;
    var result = _.clone( attributes );
    var attributesWrapper = {
      attributes: attributes
    , customAttribute: function( key ) {
        return self.customAttributes[key].call( this )
      }
    }

    // if the user has specified a strategy
    if ( strategy ) {

      // keep only the attributes we want
      if ( strategy.whitelist) {
        result = _( result ).pick( strategy.whitelist )
      }

      // remove attributes we don't want
      if ( strategy.blacklist) {
        result = _( result ).omit( strategy.blacklist )
      }

      // calculate any custom values we specified for this strategy
      if ( strategy.customAttributes ) {
        _( strategy.customAttributes ).each( function( value ) {
          result[value] = self.customAttributes[value].call( attributesWrapper )
        })
      }

    } else {

      // calculate all custom values for the presenter
      if ( self.customAttributes ) {
        _( this.customAttributes ).each( function( value, key ) {
          result[key] = self.customAttributes[key].call( attributesWrapper )
        })
      }

    }

    return result;
  }


})

module.exports = Presenter;