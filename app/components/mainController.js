export default (app) => {
    app.controller('mainController', ['$scope', '$location', '$anchorScroll', ($scope, $location, $anchorScroll) => {
        $scope.comments = JSON.parse(localStorage.getItem('comments')) || [];
        $scope.new_comment = {};

        $scope.add_new_comment = function(){
            let new_comment = Object.assign({}, this.model, {
                id: (Math.random() * 0x10000000000000).toString(16),
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

            // Если коммент - ответ на другой коммент, задаем parent_id
            this.parent_id && (new_comment.parent_id = this.parent_id);
            this.comments.push(new_comment);
            
            // Скролл вниз
            if (!this.parent_id) {
                $location.hash('comment_'+new_comment.id);
                $anchorScroll();
            }

            save_to_storage(this.comments);
        }
        $scope.remove_tree = function(){
            $scope.comments.splice(this.comments.indexOf(this.comment), 1);
            remove_childs(this.comments, this.comment);
            save_to_storage(this.comments);
        }
        $scope.toggle_reply = function(){
            // При необходимости можно чистить значения полей при открытии формы
            let current_state = this.comment.reply && this.comment.reply.enable;
            this.comment.reply = {};
            for(let comment of this.comments){
                !comment.reply && (comment.reply = {});
                if (comment.id !== this.comment.id) {
                    comment.reply.enable = false;
                }
            }
            this.comment.reply.enable = !current_state;
        }
        $scope.edit_comment = function(){
            this.comment.edit_mode = true;
        }
        $scope.finish_editing = function(save){
            if (save){
                this.comment.text = this.comment.editable_text;
            }

            delete this.comment.editable_text;
            delete this.comment.edit_mode;

            save_to_storage(this.comments);
        }


        const save_to_storage = new_data => {
            if (!new_data){ return false; }

            for(let comment of new_data){
                for(let field of ['edit_mode', 'error', 'reply']){
                    delete comment[field];
                }
            }
            localStorage.setItem('comments', JSON.stringify(new_data));

            return true;
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
        
    }]);
}
