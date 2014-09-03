
// 所有注册的action

var AppDispatcher = require('../dispatcher/appDispatcher');
var TodoConstants = require('../constants/todoConstants');

var TodoActions = {
    create: function(text){
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_CREATE,
            text: text
        })
    },
    update: function(id, update){
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_UPDATE,
            id: id,
            update: update
        })
    },
    toggleComplete: function(id){
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_COMPLETE_TOGGLE,
            id: id
        });
    },
    distroy: function(id){
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_DISTROY,
            id: id
        });
    },
    clearCompleted: function(){
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.CLEAR_COMPLETED
        })
    },
    toggleAll: function(){
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_COMPLETE_ALL
        });
    }
};


module.exports = TodoActions;

