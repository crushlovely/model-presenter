# Backbone Presenter

![https://travis-ci.org/createbang/backbone-presenter.png](https://travis-ci.org/createbang/backbone-presenter.png)

A lightweight model wrapper to prepare your data for the view layer.

## Example

```js
var PersonPresenter = Backbone.Presenter.extend({

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

var Person = Backbone.Model.extend({

  presenter: PersonPresenter

, initialize: function() {
    this.presenter.bind( this );
  }

})

var person = new Person({
    image: 'image.jpeg',
    username: 'createbang',
    firstName: 'Michael',
    lastName: 'Phillips',
    ssn: '111-11-1111',
    memberSince: '2013-01-01'
});

person.present() // returns full representation of object including custom attributes
person.present('avatar') // returns {image: 'image.jpeg', username: 'createbang', fullNameAllCaps: 'MICHAEL PHILLIPS'}
person.present('profile') // returns all model data except ssn and adds fullName custom attribute
person.present('chat') // returns just the whitelisted keys
```



## Installation

Extends the `Backbone` global with the constructor `Presenter`.

via npm"

```bash
$ npm install backbone-presenter
```


``` javascript
var PersonPresenter = Backbone.Presenter;
```

## Usage

Backbone Presenters are defined as an attribute on the applicable model and are bound to the model in the initialize method:

```js
var Person = Backbone.Model.extend({

  presenter: PersonPresenter,

  initialize: function() {
    this.presenter.bind( this );
  }

})
```


Backbone Presenters have two primary attributes.

### attributes

The `attributes` property allows you to specify presentation-only model values.

```js
var PersonPresenter = Backbone.Presenter.extend({

  customAttributes: {
    fullName: function() {
      return this.attributes.firstName + ' ' + this.attributes.lastName;
    },
    fullNameAllCaps: function() {
      return this.customAttribute('fullName').toUpperCase();
    }
  }

})
```

Each attribute is defined as a function.  The returned value will be used as the value of that attribute.  The scope for each function contains two properties:

#### customAttributes

surfaces all properties of the native model (delegates to `model.toJSON()` to generate values).

#### customAttribute

A function that allows access to other custom attributes.  Takes the name of the custom attribute as the argument.

### strategies

The `strategies` object allows you to define specific representation strategies for the presenter.  This lets the developer define a presentation for the model once and easily use it elsewhere in the application.

```js
var PersonPresenter = Backbone.Presenter.extend({

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
```

Each strategy accepts three properties:

#### whitelist

An array of keys to pick from the original model data.

#### blacklist

An array of keys to omit from the original model data.

#### customAttributes

An array of custom attribute keys to add to the resulting object

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Running tests

```bash
npm install
npm test
```
