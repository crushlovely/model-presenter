var Presenter = require('model-presenter');




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

PersonPresenter.bind( person );