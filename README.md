# Model Presenter

![https://travis-ci.org/createbang/model-presenter.png](https://travis-ci.org/createbang/model-presenter.png)

A lightweight model wrapper to prepare your data for the view layer.

## Example

```js
var Presenter = require('model-presenter');

var PersonPresenter = Presenter.extend({

  customAttributes: {
    fullName: function() {
      return this.attributes.firstName + ' ' + this.attributes.lastName;
    },
    fullNameAllCaps: function() {
      return this.customAttribute('fullName').toUpperCase();
    }
  },

  strategies: {
    avatar: {
      whitelist: ['image', 'username'],
      customAttributes: ['fullNameAllCaps']
    },
    profile: {
      blacklist: ['ssn'],
      customAttributes: ['fullName']
    },
    chat: {
      whitelist: ['image', 'username', 'memberSince']
    }
  }

})

var person = {
    image: 'image.jpeg',
    username: 'createbang',
    firstName: 'Michael',
    lastName: 'Phillips',
    ssn: '111-11-1111',
    memberSince: '2013-01-01'
};

PersonPresenter.bind( person );

person.present() // returns full representation of object including custom attributes
person.present('avatar') // returns {image: 'image.jpeg', username: 'createbang', fullNameAllCaps: 'MICHAEL PHILLIPS'}
person.present('profile') // returns all model data except ssn and adds fullName custom attribute
person.present('chat') // returns just the whitelisted keys
```

## Adapters

Presenters can be used out of the box, or you can use any of the adapters listed below for the framework you use:

* [backbone-presenter](https://github.com/createbang/backbone-presenter) for [Backbone.js](https://github.com/jashkenas/backbone/)

## Installation

via npm

```bash
$ npm install model-presenter
```

## Presenter Properties

Presenters constructors are defined as extensions of the base `Presenter` object, defining custom attributes or display strategies.

Presenters have two primary properties:

### customAttributes

The `customAttributes` property allows you to specify presentation-only model values.

Each attribute is defined as a function.  The returned value will be used as the value of that attribute.  The scope for each function contains two properties:

#### attributes

surfaces all properties of the native model (delegates to the `serializer` method, if defined, to generate values).

#### customAttribute

A function that allows access to other custom attributes.  Takes the name of the custom attribute as the argument.

### strategies

The `strategies` object allows you to define specific representation strategies for the presenter.  This lets the developer define a presentation for the model once and easily use it elsewhere in the application.

Each strategy accepts three properties:

#### whitelist

An array of keys to pick from the original model data.

#### blacklist

An array of keys to omit from the original model data.

#### customAttributes

An array of custom attribute keys to add to the resulting object

## Model

### present

Binding the presenter constructor to the model exposes a `present` method on the model.  This method returns the resulting presenter attributes.  Takes an optional `strategy` string argument, using that strategy to build the resulting object.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Running tests

```bash
$ npm install
$ npm test
```
