var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var AppDispatcher = require('../dispatcher/appDispatcher');
var TodoConstants = require('../constants/todoConstants');

var CHANGE_EVENT = 'change';

// var _todos = {}
var _todos = {
    111: {
        id: 111,
        complete: false,
        text: '创建一个新的todo, 保存在_todos中'
    },
    222: {
        id: 222,
        complete: false,
        text: '更新一个todo, update传需要(部分)更新的内容'
    }
};

// 创建一个新的todo, 保存在_todos中
function create(text){
    var id = Date.now();
    var todo = {
        id: id,
        complete: false,
        text: text
    };

    _todos[id] = todo;
}

// 更新一个todo, update传需要(部分)更新的内容
function update(id, updates){
    _todos[id] = merge(_todos[id], updates);
}
function updateAll( updates){
    for(var i in _todos){
        update(i, updates)
    }
}

// 完成一个todo
function completeToggle(id){
    update(id, {
        complete: !_todos[id].complete
    });
}
// 完成所有todo
function completeToggleAll(){
    for(var i in _todos){
        complete(i);
    }
}

// 销毁一个...
function distroy(id){
    delete _todos[id];
}
// 销毁全部已完成的
function clearCompleted(){
    for(var i in _todos){
        if(_todos[i].complete){
            delete _todos[i];
        }
    }
}
// function getAll(){
//     var allTodo = [];
//     for(var i in _todos){
//         allTodo.push(_todos[i]);
//     }
//     return allTodo;
// }

// function isAllComplete(){

// }

var TodoStore = merge(EventEmitter.prototype, {
    create: create,
    complete: completeToggle,
    completeAll: completeToggleAll,
    getAll: function(){
        return _todos;
    },
    isAllComplete: function(){
        for(var i in _todos){
            if(_todos[i].complete === false){
                return false;
            }
        }
        return true;
    },
    // 使用events模块EventEmmit对象的地方...
    // 看上去很简单, 应该可以自己实现吧, 抛弃又一个依赖库
    emitChange: function(){
        // 这个触发事件也会有更多种类吧~?
        // 现在只有单一的'change'事件
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback)
    },
    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback)
    }
});


// 在dispatcher 分发器上注册处理函数
// 针对不同的actionType调用不同的函数
// 最后统一做一次emitChange

// 注册更多的action handler: 完成/取消完成, 销毁一个, 完成/取笑完成所有... 
// 自己来写喽
AppDispatcher.register(function(payload){
    var action = payload.action;
    var text;

    switch(action.actionType){
        case TodoConstants.TODO_CREATE:
            text = action.text.trim();
            if( text !== '' ){
                create(text);
            }
            break;
        case TodoConstants.TODO_UPDATE:
            var id = action.id;
            if( action.update.text !== '' ){
                update(id, action.update);
            }
            break;
        case TodoConstants.TODO_COMPLETE_TOGGLE:
            var id = action.id;
            completeToggle(id);
            break;
        case TodoConstants.TODO_DISTROY:
            var id = action.id;
            distroy(id);
            break;
        case TodoConstants.CLEAR_COMPLETED:
            clearCompleted();
            break;
        case TodoConstants.TODO_COMPLETE_ALL:
            // 没有全部完成的话, 就全部置为true
            // 都完成了的话, 全部置为false
            updateAll( {
                complete: !TodoStore.isAllComplete() 
            });
            break;
        default:
            console.log('no store handler registed on this action: ', action.actionType)
            break;
    }

    TodoStore.emitChange();

    return true;
});


module.exports = TodoStore;
