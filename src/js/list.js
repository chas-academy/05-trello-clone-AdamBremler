import $ from 'jquery';
require('webpack-jquery-ui');

$.widget('jtrello.list', {
    options: {},
  
    _create: function() {},

    _destroy: function() {
        this.element.parent().remove();
    }
});
