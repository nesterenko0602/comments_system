var angular = require('angular');
var app = angular.module('app', []);

import mainController from './components/mainController.js';
import './assets/css/index.less';
import './assets/fonts/fonts.css';

mainController(app);
