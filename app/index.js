import angular from 'angular';
import '../node_modules/angular-i18n/angular-locale_ru-ru.js';
import storageService from './components/storageService.js';
import mainController from './components/mainController.js';
import './assets/css/index.less';
import './assets/fonts/fonts.css';

var app = angular.module('app', []);

storageService(app);
mainController(app);
