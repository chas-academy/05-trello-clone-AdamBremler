import $ from 'jquery';
require('webpack-jquery-ui');

$.widget('jtrello.list', {
    options: {},
  
    _create: function() {
        this.element.droppable({
            accept: '.card',
            drop: function(event, ui) {
                $(ui.draggable).prependTo($(this).find('.list-cards'));
            }
        });
    },

    remove: function() {
        this.destroy();
        this.element.parent().remove();
    }
});
