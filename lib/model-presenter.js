var _ = require('underscore');




Presenter = function() {}

Presenter.extend = function( obj ) {
  return _(this.prototype).extend( obj );
}

Presenter.present = function() {
  var presenter = new this();
  return presenter.present.apply( presenter, arguments );
}


_(Presenter.prototype).extend({


  present: function( model, strategy ) {
    var self = this;
    var strategy = this.strategies ? this.strategies[strategy] : null;
    var isCollection = _( model ).isArray();
    var collection = ( isCollection ) ? model : [model];

    var attributes;
    var result;
    var attributesWrapper;

    var results = _( collection ).map( function( model ) {

      attributes = (self.serializer) ? self.serializer( model ) : model;
      result = _.clone( attributes );
      attributesWrapper = {
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
          _( self.customAttributes ).each( function( value, key ) {
            result[key] = self.customAttributes[key].call( attributesWrapper )
          })
        }

      }

      return result;

    });

    // if we passed in a single object, return a single object
    if ( !isCollection ) { results = results[0] }

    return results
  }


})

module.exports = Presenter;