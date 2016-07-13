(function() {
  'use strict';

  angular
    .module('open', [
      'ui.router',
      'ngMaterial',
      'ngStorage',
      'angular-filepicker',
      'open.landing',
      'open.login',
      'open.signup',
      'open.dashboard',

    ]);
})();