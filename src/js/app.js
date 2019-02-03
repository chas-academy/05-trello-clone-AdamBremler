import $ from 'jquery';
require('webpack-jquery-ui');
import moment from 'moment';
import '../../node_modules/jquery-ui/themes/base/all.css';
import '../css/styles.css';

import './list';
import './card';

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function() {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$listDialog = $('#list-creation-dialog');
    DOM.$cardInfoDialog = $('#card-info-dialog');
    DOM.$columns = $('.column');
    DOM.$lists = $('.list');
    DOM.$cards = $('.card');
    
    DOM.$newListButton = $('button#new-list');
    DOM.$deleteListButton = $('.list-header > button.delete');

    DOM.$newCardForm = $('form.new-card');
    DOM.$deleteCardButton = $('.card > button.delete');

    DOM.$cardDatepicker = $('#card-info-dialog .datepicker');
  }

  function createTabs() {}
  function createWidgets() {
    DOM.$cardInfoDialog.dialog({
      autoOpen: false,
      modal: true,
      buttons: [
        {
          text: 'OK',
          click: function() {
            $(this).data('card').option('description', $(this).find('.description').val());
            
            let deadline = moment($(this).find('.datepicker').val());
            if(deadline.isValid()) {
              $(this).data('card').option('deadline', deadline);
            }

            $(this).dialog('close');
          }
        }
      ],
      show: 'fade',
      hide: 'puff'
    });

    DOM.$cardDatepicker.datepicker({ dateFormat: 'yy-mm-dd' });

    DOM.$lists.list();
    DOM.$cards.card();

    DOM.$cards.each(function() {
      $(this).card('option', 'infoDialog', DOM.$cardInfoDialog);
      // Default deadline is one week from now
      $(this).card('option', 'deadline', moment().add(1, 'week'));
    });
  }

  /*
  *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
  *  createList, deleteList, createCard och deleteCard etc.
  */
  function bindEvents() {
    DOM.$newListButton.on('click', createList);
    DOM.$deleteListButton.on('click', deleteList);

    DOM.$newCardForm.on('submit', createCard);
    DOM.$deleteCardButton.on('click', deleteCard);
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function createList() {
    event.preventDefault();
    console.log("This should create a new list");
  }

  function deleteList() {
    $(this).closest('.list').data('jtrello-list').destroy();
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    console.log("This should create a new card");
  }

  function deleteCard() {
    $(this).closest('.card').data('jtrello-card').destroy();
  }

  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(':::: Initializing JTrello ::::');
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    createWidgets();

    bindEvents();
  }

  // All kod här
  return {
    init: init
  };
})();

//usage
$("document").ready(function() {
  jtrello.init();
});
