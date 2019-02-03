import $ from 'jquery';
import 'webpack-jquery-ui';

$.widget('jtrello.list', {
    options: {},
  
    _create: function() {
        this.element.droppable({
            accept: '.card',
            drop: function(event, ui) {
                $(ui.draggable).prependTo($(this).find('.list-cards'));
            }
        });

        let form = $(this.element).find('form');
        this._on(form, {
            submit: 'submit'
        });

        let deleteButton = $(this.element).find('button.delete');
        this._on(deleteButton, {
            click: 'remove'
        });
    },

    submit: function(event) {
        this.options.createCard(event);
    },

    remove: function() {
        this.destroy();
        this.element.parent().remove();
    }
});
