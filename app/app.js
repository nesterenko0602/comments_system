var angular = require('angular');
require('../node_modules/angular-i18n/angular-locale_ru-ru.js');
var app = angular.module('app', []);

import mainController from './components/mainController.js';
import './assets/css/index.less';
import './assets/fonts/fonts.css';


mainController(app);
