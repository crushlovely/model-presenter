var assert         = require('assert'),
    should         = require('should'),
    expect         = require('chai').expect,
    fs             = require('fs'),
    Presenter      = require('../lib/model-presenter'),
    _              = require('underscore');




describe('model-presenter', function() {

  beforeEach( function( done ){

    // describe the presenter
    PersonPresenter = Presenter.extend({

      customAttributes: {

        salutation: function() {
          var salutationMap = {male: 'Mr', female: {married: 'Mrs', notMarried: 'Ms'}}
          var genderMap = salutationMap[ this.attributes.gender ]
          var marriedStatus = ( this.attributes.married ) ? 'married' : 'notMarried'
          var salutation = ( typeof genderMap === 'string' ) ? genderMap : genderMap[ marriedStatus ]
          return salutation
        }

      , fullName: function() {
          return [this.attributes.firstName, this.attributes.lastName].join(' ');
        }

      , fullNameWithSalutation: function() {
          return [this.customAttribute('salutation') + '.', this.customAttribute('fullName')].join(' ')
        }

      }

    , strategies: {

        stationery: {
          whitelist: ['firstName']
        , customAttributes: ['salutation', 'fullNameWithSalutation']
        }

      , whitelisted: {
          whitelist: ['firstName']
        }

      , blacklisted: {
          blacklist: ['ssn']
        }
      }
    })

    // describe the new model
    person = {
      firstName: 'John'
    , lastName: 'Smith'
    , gender: 'male'
    , married: true
    , ssn: '111-11-1111'
    };

    done();

  });


  var baseTests = function() {
    it('should return an object', function() {
      data.should.be.type('object');
    })
  }

  describe('present with a on-the-fly strategy', function() {

    beforeEach( function() {
      data = PersonPresenter.present( person, { customAttributes: ['fullName'], whitelist: ['lastName', 'ssn'] } )
    })

    it('should return the right properties', function() {
      var allKeys = ['lastName', 'ssn', 'fullName'];

      allKeys.forEach(function(key) {
        expect(data).to.have.property(key);
      });
      data.fullName.should.equal('John Smith');
    })

  })

  // presented using a strategy
  describe('present with an empty object', function() {

    beforeEach( function() {
      data = PersonPresenter.present( {} );
    });

    it( 'should return a null object', function() {
      data.should.be.empty;
    })
  })

  // presented using a strategy
  describe('present with a null model', function() {

    beforeEach( function() {
      data = PersonPresenter.present( null );
    });

    it( 'should return a null object', function() {
      expect(data).to.be.null;
    })
  })

  // presented using a strategy
  describe('present with an undefined model', function() {

    beforeEach( function() {
      data = PersonPresenter.present( undefined );
    });

    it( 'should return a null object', function() {
      expect(data).to.be.undefined;
    })
  })

  // presented using a strategy
  describe('present using a strategy', function() {


    // using a strategy that has a whitelist defined
    describe('with a whitelist strategy', function() {

      beforeEach( function() {
        data = PersonPresenter.present( person, 'whitelisted');
      })


      baseTests.call( this );

      it('should have only one property', function() {
        data.should.have.keys('firstName');
      })

    })


    // using a strategy that has a blacklist defined
    describe('with a blacklist strategy', function() {

      beforeEach( function() {
        data = PersonPresenter.present( person, 'blacklisted');
      })


      baseTests.call( this );

      it('should not have blacklisted property', function() {
        data.should.not.have.property('ssn');
      })

    })


    // using a strategy that has a combination of whitelist, blacklist and customAttributes
    describe('with a complex strategy', function() {

      beforeEach( function() {
        data = PersonPresenter.present( person, 'stationery');
      })


      baseTests.call( this );

      it('has the right properties', function() {
        var allKeys = ['firstName', 'salutation', 'fullNameWithSalutation'];

        allKeys.forEach(function(key) {
          expect(data).to.have.property(key);
        });
      })

      it('should not have omitted properties', function() {
        data.should.not.have.property('ssn')
      })

      it('should have a value for the custom attributes', function() {
        data.salutation.should.equal('Mr');
        data.fullNameWithSalutation.should.equal('Mr. John Smith');
      })

    })

  })


  // if the customAttributes property is not defined on the presenter object
  describe('present without using a strategy', function() {

    beforeEach( function() {
      data = PersonPresenter.present( person );
    })


    baseTests.call( this );

    it('has the right properties', function() {
      var modelKeys = Object.keys( person );
      var presenterKeys = Object.keys( PersonPresenter.prototype.customAttributes );

      var allKeys = modelKeys.concat(presenterKeys);

      allKeys.forEach(function(key) {
        expect(data).to.have.property(key);
      });
    })
  })


  // // if the strategies property is not defined on the presenter object
  describe('without defined strategies', function() {

    beforeEach( function() {
      delete PersonPresenter.prototype.strategies;
      data = PersonPresenter.present( person );
    })


    baseTests.call( this );

    it('has the right properties', function() {
      var modelKeys = Object.keys( person );
      var presenterKeys = Object.keys( PersonPresenter.prototype.customAttributes );

      var allKeys = modelKeys.concat(presenterKeys);

      allKeys.forEach(function(key) {
        expect(data).to.have.property(key);
      });
    })

  })


  // // if the customAttributes property is not defined on the presenter object
  describe('without defined customAttributes', function() {

    beforeEach( function() {
      delete PersonPresenter.prototype.customAttributes;
      data = PersonPresenter.present( person );
    })


    baseTests.call( this );

    it('has the right properties', function() {
      var modelKeys = Object.keys( person );

      modelKeys.forEach(function(key) {
        expect(data).to.have.property(key);
      });
    })

  })





  // // if the customAttributes property is not defined on the presenter object
  describe('passing in a collection', function() {

    beforeEach( function() {
      data = PersonPresenter.present( [person, person, person] );
    })


    it('should return an object', function() {
      data.should.be.an.Array
    })

    it('should return a collection', function() {
      data.should.have.length(3)
    })

    it('has the right properties', function() {
      var modelKeys = Object.keys( person );
      var presenterKeys = Object.keys( PersonPresenter.prototype.customAttributes );
      var allKeys = modelKeys.concat(presenterKeys);

      allKeys.forEach(function(key) {
        expect(data[0]).to.have.property(key);
      });
      allKeys.forEach(function(key) {
        expect(data[1]).to.have.property(key);
      });
      allKeys.forEach(function(key) {
        expect(data[2]).to.have.property(key);
      });
    })

  })

});