import angular from 'angular';
import '../../index.js'
import 'angular-mocks';

describe('Test main controller', function () {
	let $scope,
		deferred,
		REST;

	beforeEach(angular.mock.module('app'));

	beforeEach(inject(function($controller, _$rootScope_, _$q_, _$location_, _$anchorScroll_, _REST_) {
		[$scope, deferred, REST] = [_$rootScope_, _$q_.defer(), _REST_]
		
		spyOn(REST, 'get').and.returnValue(deferred.promise);
		spyOn(REST, 'set').and.returnValue(_$q_.defer().promise);

		$controller('mainController', {
		  $scope: $scope, 
		  $location: _$location_,
		  $anchorScroll: _$anchorScroll_,
		  REST: REST
		});
	}));


	// Добавление комментария
	it('Add comment', () => {
		// Инициализация данных
		deferred.resolve([]);
		$scope.$apply();

		// Обработка данных
		let form_data = {
			"author":"Дмитрий",
			"text":"Мой коммент"
		};
		let comment_fields = {
			"author":"Дмитрий",
			"text":"Мой коммент",
			"id":"9af4128b37fb8",
			"date":1475773525723,
			"avatar_color":"22064F"
		};
		$scope.add_new_comment.call({model: form_data});
		$scope.$apply();

		// Проверка
		var tester = {
			asymmetricMatch: function(data) {
				let comment = data[0];
				for (let key of ['author', 'text', 'id', 'avatar_color']) {
					expect(comment[key]).toBeString();
				}
				expect(comment['date']).toBeNumber();
				
				return true;
			}
		};
		expect(REST.set).toHaveBeenCalledWith(any.arrayOfSize(1));
		expect(REST.set).toHaveBeenCalledWith(tester);
	});

	// Удаление комментария
	it('Remove comment', () => {
		// Инициализация данных
		let comment_one = {
			"author":"Дмитрий",
			"text":"Мой коммент",
			"id":"9af4128b37fb8",
			"date":1475773525723,
			"avatar_color":"22064F"
		};
		let comment_two = {
			"author":"Василий",
			"text":"Еще коммент",
			"id":"9af43233234b8",
			"date":1475773599999,
			"avatar_color":"42060F"
		};
		let comments = [comment_one, comment_two];
		deferred.resolve(comments);
		$scope.$apply();

		// Обработка данных
		$scope.remove_tree.call({comment: comment_one});

		// Проверка
		expect(REST.set).toHaveBeenCalledWith([comment_two]);
	});

	// Удаление комментария с ответами
	it('Remove comment with replies', () => {
		// Инициализация данных
		let parent_comment = {
			"author": "Дмитрий",
			"text": "Комментарий",
			"id": "4be0c5e3dd71b",
			"date": 1475846517944,
			"avatar_color": "22064F"
		};
		let child_comment = {
			"author": "Иван",
			"text": "Ответ",
			"id": "e4bbdd621eafa",
			"date": 1475847655092,
			"avatar_color": "ECAAA7",
			"parent_id": "4be0c5e3dd71b"
		};
		let comments = [parent_comment, child_comment];
		deferred.resolve(comments);
		$scope.$apply();

		// Обработка данных
		$scope.remove_tree.call({comment: parent_comment});

		// Проверка
		expect(REST.set).toHaveBeenCalledWith(any.emptyArray());
	});

});
