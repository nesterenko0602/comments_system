export default (app) => {
    app.controller('mainController', ['$scope', '$location', '$anchorScroll', ($scope, $location, $anchorScroll) => {        
        
        const buildTree = function(curr_comment) {
            if (!curr_comment) {
                let result = [];
                for(let comment of $scope.comments_flat){
                    result.push(buildTree(comment));
                }
                return result.filter( element => {
                   return element !== undefined;
                });
            } else {
                let replies = $scope.comments_flat.filter(comment => {
                    return comment.parent_id == curr_comment.id;
                });

                for (let reply of replies){
                    reply.reply_for = curr_comment.author;
                }

                curr_comment.replies = replies;
                curr_comment.avatar_color = color_from_string(curr_comment.author);

                if (!curr_comment.parent_id){
                    return curr_comment;
                }
            }
        }
        
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

        $scope.comments_flat = JSON.parse(localStorage.getItem('comments')) || [];
        $scope.comments = buildTree();
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
            $scope.comments_flat.push(new_comment);
            $scope.save_to_storage(true);
            
            // Скролл вниз
            if (!this.parent_id) {
                $location.hash('comment_'+new_comment.id);
                $anchorScroll();
            }
        }
        $scope.remove_tree = function(){
            $scope.comments_flat.splice(this.comments_flat.indexOf(this.comment), 1);
            remove_childs(this.comments_flat, this.comment);
            $scope.save_to_storage(true);
        }
        $scope.toggle_reply = function(){
            // При необходимости можно чистить значения полей при открытии формы
            let current_state = this.comment.reply && this.comment.reply.enable;
            this.comment.reply = {};
            for(let comment of this.comments_flat){
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

            $scope.save_to_storage();
        }
        $scope.save_to_storage = function(render){
            for(let comment of $scope.comments_flat){
                for(let field of ['edit_mode', 'error', 'reply', 'enable']){
                    delete comment[field];
                }
            }
            localStorage.setItem('comments', JSON.stringify($scope.comments_flat));
            if (render){
                $scope.comments = buildTree();
            }
            return true;
        }
        
    }]);
}
