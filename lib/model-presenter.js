var _ = require('underscore');




Presenter = function() {}

Presenter.extend = function( protoProps, staticProps ) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

Presenter.present = function() {
  var presenter = new this();
  return presenter.present.apply( presenter, arguments );
}


_(Presenter.prototype).extend({


  present: function( model, strategy, options ) {
    options = ( options || {} );
    if ( _(model).isEmpty() ) {
      return model;
    }

    var strategyIsCustom = ( typeof strategy === 'object' )

    // if we passed in a strategy value and it isn't custom and we have defined strategies
    // otherwise, just leave the value of strategy as it is.
    if ( strategy && !strategyIsCustom && this.strategies ) {
      strategy = this.strategies[strategy];
    }

    var self = this;
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
      , options: options
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