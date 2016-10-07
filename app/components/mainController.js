export default (app) => {
    app.controller('mainController', ['$scope', '$location', '$anchorScroll', 'REST', ($scope, $location, $anchorScroll, REST) => {
        
        const color_from_string = function(string){
            const hashCode = function(str) { // java String#hashCode
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                   hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }
                return hash;
            } 

            const intToRGB = function(i){
                let c = (i & 0x00FFFFFF)
                    .toString(16)
                    .toUpperCase();

                return "00000".substring(0, 6 - c.length) + c;
            }
            return intToRGB(hashCode(string))
        }

        const remove_childs = (comments, comment) => {
            let id = comment.id;
            let child_comments = comments.filter(elem => {
                return elem.parent_id == id;
            });

            if (child_comments.length) {
                for(let current_child of child_comments){
                    comments.splice(comments.indexOf(current_child), 1);
                    comments = remove_childs(comments, current_child);
                }
            }
            
            return comments;
        }

        $scope.fetching = true;
        $scope.add_new_comment = function(){
            let new_comment = Object.assign({}, this.model, {
                id: (Math.random() * 0x10000000000000).toString(16),
                new: true,
                date: Date.now()
            });

            // Проверка на пустые поля
            let error = {
                author: !new_comment.author,
                text: !new_comment.text
            };

            if (error.author || error.text){
                this.model.error = error;
                return;
            } else {
                delete this.model.error;
            }

            this.model = {};

            // Добавляем цвет кружка
            new_comment.avatar_color = color_from_string(new_comment.author);

            // Если коммент - ответ на другой коммент, задаем parent_id
            this.parent_id && (new_comment.parent_id = this.parent_id);
            $scope.comments.push(new_comment);
            REST.set($scope.comments)
            .catch(msg => {
                alert(msg);
            });
            
            // Скролл вниз
            this.comment && (this.comment.reply = false);
            if (!this.parent_id) {
                $location.hash('comment_'+new_comment.id);
                $anchorScroll();
            }
        }
        $scope.remove_tree = function(){
            $scope.comments.splice($scope.comments.indexOf(this.comment), 1);
            remove_childs($scope.comments, this.comment);
            REST.set($scope.comments)
            .catch(msg => {
                alert(msg);
            });
        }
        $scope.toggle_reply = function(){
            let current_state = this.comment.reply;
            for(let comment of $scope.comments){
                if (comment.id !== this.comment.id) {
                    comment.reply = false;
                }
            }
            this.comment.reply = !current_state;
        }
        $scope.edit_comment = function(){
            this.comment.edit_mode = true;
        }
        $scope.finish_editing = function(save){
            if (save){
                this.comment.text = this.comment.editable_text;
                REST.set($scope.comments)
                .catch(msg => {
                    alert(msg);
                });
            }

            delete this.comment.editable_text;
            delete this.comment.edit_mode;
        }

        REST.get()
        .then(results => {
            for(let comment of results) {
                for(let field of ['edit_mode', 'new', 'error', 'reply', 'enable']) {
                    delete comment[field];
                }
            }
            $scope.comments = results;
            $scope.fetching = false;
        })
        .catch(msg => {
            alert(msg);
        });
        
    }]);
}
