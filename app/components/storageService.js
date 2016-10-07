export default (app) => {

    app.factory('REST', ['$timeout', '$q', ($timeout, $q) => {
        
        return {
            get: () => {
                var deferred = $q.defer();
                $timeout(function() {
                    try {
                        let data = JSON.parse(localStorage.getItem('comments')) || [];
                        deferred.resolve(data);
                    } catch(e) {
                        deferred.reject(new Error("Ошибка чтения данных", e.message));
                    }
                    return;
                }, 2 * 1000);

                return deferred.promise;
            },
            set: (new_data) => {
                var deferred = $q.defer();

                $timeout(function() {
                    try {
                        for(let comment of new_data) {
                            comment.new && delete comment.new;
                        }
                        localStorage.setItem('comments', JSON.stringify(new_data));
                        deferred.resolve(new_data);
                    } catch(e) {
                        deferred.reject(new Error("Ошибка записи данных", e.message));
                    }
                    return;
                }, 2 * 1000);

                return deferred.promise;
            }
        }
    }])
}
