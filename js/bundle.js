(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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


},{"../constants/todoConstants":9,"../dispatcher/appDispatcher":11}],2:[function(require,module,exports){
module.exports=require(1)
},{"../constants/todoConstants":9,"../dispatcher/appDispatcher":11}],3:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var TodoStore = require('../stores/todoStore');
var TodoAction = require('../actions/todoAction');

var TodoHeader = require('./todoHeader');
var TodoList = require('./todoList');
var TodoFooter = require('./todoFooter');

function getAllData(){
    return {
            allTodos: TodoStore.getAll(),
            allComplete: TodoStore.isAllComplete()
    }
}

var TodoApp = React.createClass({displayName: 'TodoApp',
    getInitialState: function(){
        return getAllData();
    },
    componentDidMount: function() {
        var self = this;
        TodoStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        TodoStore.removeChangeListener(this._onChange);
    },
    render: function(){
        // header中的input负责新建,
        // list渲染所有
        // item负责complete一个todo
        // footer负责显示多少完成多少未完成
        return (
            React.DOM.div(null, 
                TodoHeader(null), 
                React.DOM.section({id: "main"}, 
                    React.DOM.input({
                        id: "toggle-all", 
                        type: "checkbox", 

                        checked: this.state.allComplete, 
                        onClick: this._toggleAll}
                    ), 
                    React.DOM.label({htmlFor: "toggle-all"}, "Mark all as complete"), 
                    TodoList({allTodos: this.state.allTodos})
                ), 
                TodoFooter({allTodos: this.state.allTodos})
            )
        );
    },
    _onChange: function(){
        this.setState(getAllData());
    },
    _toggleAll: function(){
        TodoAction.toggleAll();
    }
});


module.exports = TodoApp;
},{"../actions/todoAction":2,"../stores/todoStore":14,"./todoFooter":4,"./todoHeader":5,"./todoList":8}],4:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var TodoStore = require('../stores/todoStore');
var TodoAction = require('../actions/todoAction');

function getAllTodos(){
    return {
        allTodos: TodoStore.getAll()
    };
}

var TodoFooter = React.createClass({displayName: 'TodoFooter',
    getInitialState: function(){
        return {
            allTodos: this.props.allTodos
        };
    },
    render: function() {
        var todoCount = 0;
        var completeCount = 0;
        var allTodos = this.state.allTodos;
        for( var i in allTodos){
            todoCount++;
            if(allTodos[i].complete === true){
                completeCount++
            }
        }
        var leftCount = todoCount - completeCount;

        var node = [React.DOM.span({id: "todo-count"}, React.DOM.span(null, leftCount), " items left.")];
        if(completeCount > 0){
            node.push(React.DOM.span({id: "clear-completed", onClick: this._clearCompleted}, "Clear completed(", React.DOM.span(null, completeCount), ")"))
        }
        return (
            React.DOM.footer({id: "footer"}, 
                node
            )
        );
    },
    _clearCompleted: function(){
        TodoAction.clearCompleted();
    }

});

module.exports = TodoFooter;
},{"../actions/todoAction":2,"../stores/todoStore":14}],5:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var TodoAction = require('../actions/todoAction');
var todoInput = require('./todoInput');


/*
 * Listen to keydown/keyup event check 13 code
 * send an action to create a new todo
 * 
 * 
 * 
 */

function tempOnSave(t){
    console.log(t);
}

var todoHeader = React.createClass({displayName: 'todoHeader',

    render: function(){
        return (
            React.DOM.header({id: "header"}, 
                React.DOM.h1(null, "todos"), 
                todoInput({onSave: this._create})
            )
        );
    },
    _create: function(text){
        // console.log(t);
        if(text.trim()){
            TodoAction.create(text);
        } 
    }
});

module.exports = todoHeader;
},{"../actions/todoAction":2,"./todoInput":6}],6:[function(require,module,exports){
/**
 * 
 * @jsx React.DOM
 */

var ENTER_KEY = 13;


 var todoInput = React.createClass({displayName: 'todoInput',
    getInitialState: function(){
        return {
            value: this.props.value || ''
        };
    },
    // 在enter, blur后都执行新建的操作
    // 在store触发change事件后进行相应
    

    // 如果设定了value='', 就会出现: 键入,不出内容的情况
    // 因为value一直是空
    // 所以才有了onChange的绑定, 再把值付给this.state.value
    render: function(){
        return (
            React.DOM.input({
                id: "new-todo", 
                placeholder: this.props.placeholder, 
                type: "text", 
                value: this.state.value, 
                autoFocus: true, 

                onChange: this._onChange, 
                onKeyDown: this._onKeyDown, 
                onBlur: this._onSave}
            )
        );
    },
    // 为什么叫onSave...
    // 因为input一般的submit操作是save吗... 为了让组件更通用...
    _onSave: function(){
        // 执行上层组件赋给的callback
        this.props.onSave(this.state.value);
        this.setState({
            value: ''
        });
    },
    _onChange: function(e){
        this.setState({
            value: e.target.value
        });
    },
    _onKeyDown: function(e){
        if(e.keyCode === ENTER_KEY){
            this._onSave()
        }
    }
 });


 module.exports = todoInput;
},{}],7:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var TodoAction = require('../actions/TodoAction');
var TodoTextInput = require('./todoInput');

var ENTER_KEY = 13;


var todoItem = React.createClass({displayName: 'todoItem',
    // todoItem
    //      checkbox to complete
    //      label to display todo text
    //      button to distroy a todo
    //      
    //      

    getInitialState: function(){
        // 不需要维护太多state...
        return {
            editing: false
        };
    },
    render: function() {
        var todo = this.props.todo;
        var itemClass = null;
        var inputEle = null;
        if(todo.complete){
            itemClass = 'completed';
        }
        if(this.state.editing){
            itemClass = 'editing';
            // 使用现成的todoInput, enter键保存/blur保存/onChange同步等事件都绑好了
            inputEle = TodoTextInput({
                value: todo.text, 
                onSave: this._updateText}
            );
        }
        return (
            React.DOM.li({className: itemClass, 'data-todoid': todo.id}, 
                React.DOM.div({className: "view"}, 
                    React.DOM.input({
                        className: "toggle", 
                        type: "checkbox", 
                        checked: todo.complete, 

                        onClick: this._toggleComplete}
                    ), 
                    React.DOM.label({onDoubleClick: this._startEditing}, 
                        todo.text
                    ), 
                    React.DOM.button({className: "destroy", onClick: this._distroy})
                ), 
                inputEle
            )
        );
    },
    _startEditing: function(){
        this.setState({
            editing: true
        });
    },
    _updateText: function(text){
        // 发出更新的action 不用管了
        TodoAction.update(this.props.todo.id, {
            text: text
        });
        this.setState({editing: false});
    },
    _toggleComplete: function(){
        TodoAction.toggleComplete(this.props.todo.id);
    },
    _distroy: function(){
        TodoAction.distroy(this.props.todo.id);
    }
});

module.exports = todoItem;
},{"../actions/TodoAction":1,"./todoInput":6}],8:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

 var TodoItem = require('./todoItem');

var todoList = React.createClass({displayName: 'todoList',
    render: function() {
        var allTodos = this.props.allTodos;
        var node = [];
        for( var i in allTodos){
            node.push( TodoItem({key: i, todo: allTodos[i]}) )
        }
        if( node.length === 0){
            var noTodoState = {
                id: 000,
                text: 'No todo yet',
                complete: false
            };
            node = [React.DOM.li(null, " ", React.DOM.label(null, "No todo yet."), " ")];
        }

        return (
            React.DOM.ul({id: "todo-list"}, node)
        );
    }
});

module.exports = todoList;
},{"./todoItem":7}],9:[function(require,module,exports){
var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
    TODO_CREATE: null,
    TODO_COMPLETE_TOGGLE: null,
    TODO_UPDATE: null,
    TODO_DISTROY: null,
    CLEAR_COMPLETED: null,

    TODO_COMPLETE_ALL: null,
    TODO_: null
});
},{"react/lib/keyMirror":19}],10:[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload)) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload)) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {"use strict";
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {"use strict";
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {"use strict";
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {"use strict";
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {"use strict";
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {"use strict";
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {"use strict";
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {"use strict";
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {"use strict";
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":12}],11:[function(require,module,exports){
var Dispatcher = require('./Dispatcher');


// dispatcher 真的很简单, 对于现在的todoapp来说
// 添加一个处理viewaction的方法, 进行分发... 分发的参数可以称作payload
// 在相应的store中, 将action的handler注册在dispatcher上

var copyProperties = require('react/lib/copyProperties');

var AppDispatcher = copyProperties(new Dispatcher(), {
    handleViewAction: function(action){
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    }
});

module.exports = AppDispatcher;
},{"./Dispatcher":10,"react/lib/copyProperties":17}],12:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],13:[function(require,module,exports){
/**
 * jsx comments: start with slice and two stars
 * 
 * @jsx React.DOM
 * 
 * it can be everwhere
 */

console.log('js file change will trigger: bundle by browserify & then trigger live reload');

var TodoApp = require('./components/todoApp');

React.renderComponent(TodoApp(null), document.getElementById('todoapp'));
},{"./components/todoApp":3}],14:[function(require,module,exports){
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
        case TodoConstants.TODO_COMPLETE_ALL:
            // 没有全部完成的话, 就全部置为true
            // 都完成了的话, 全部置为false
            updateAll( {
                complete: !TodoStore.isAllComplete() 
            });
        default:
            console.log('no store handler registed on this action: ', action.actionType)
            break;
    }

    TodoStore.emitChange();

    return true;
});


module.exports = TodoStore;

},{"../constants/todoConstants":9,"../dispatcher/appDispatcher":11,"events":15,"react/lib/merge":20}],15:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],16:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],17:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule copyProperties
 */

/**
 * Copy properties from one or more objects (up to 5) into the first object.
 * This is a shallow copy. It mutates the first object and also returns it.
 *
 * NOTE: `arguments` has a very significant performance penalty, which is why
 * we don't support unlimited arguments.
 */
function copyProperties(obj, a, b, c, d, e, f) {
  obj = obj || {};

  if ("production" !== process.env.NODE_ENV) {
    if (f) {
      throw new Error('Too many arguments passed to copyProperties');
    }
  }

  var args = [a, b, c, d, e];
  var ii = 0, v;
  while (args[ii]) {
    v = args[ii++];
    for (var k in v) {
      obj[k] = v[k];
    }

    // IE ignores toString in object iteration.. See:
    // webreflection.blogspot.com/2007/07/quick-fix-internet-explorer-and.html
    if (v.hasOwnProperty && v.hasOwnProperty('toString') &&
        (typeof v.toString != 'undefined') && (obj.toString !== v.toString)) {
      obj.toString = v.toString;
    }
  }

  return obj;
}

module.exports = copyProperties;

}).call(this,require("1YiZ5S"))
},{"1YiZ5S":16}],18:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require("1YiZ5S"))
},{"1YiZ5S":16}],19:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require("1YiZ5S"))
},{"./invariant":18,"1YiZ5S":16}],20:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule merge
 */

"use strict";

var mergeInto = require("./mergeInto");

/**
 * Shallow merges two structures into a return value, without mutating either.
 *
 * @param {?object} one Optional object with properties to merge from.
 * @param {?object} two Optional object with properties to merge from.
 * @return {object} The shallow extension of one by two.
 */
var merge = function(one, two) {
  var result = {};
  mergeInto(result, one);
  mergeInto(result, two);
  return result;
};

module.exports = merge;

},{"./mergeInto":22}],21:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeHelpers
 *
 * requiresPolyfills: Array.isArray
 */

"use strict";

var invariant = require("./invariant");
var keyMirror = require("./keyMirror");

/**
 * Maximum number of levels to traverse. Will catch circular structures.
 * @const
 */
var MAX_MERGE_DEPTH = 36;

/**
 * We won't worry about edge cases like new String('x') or new Boolean(true).
 * Functions are considered terminals, and arrays are not.
 * @param {*} o The item/object/value to test.
 * @return {boolean} true iff the argument is a terminal.
 */
var isTerminal = function(o) {
  return typeof o !== 'object' || o === null;
};

var mergeHelpers = {

  MAX_MERGE_DEPTH: MAX_MERGE_DEPTH,

  isTerminal: isTerminal,

  /**
   * Converts null/undefined values into empty object.
   *
   * @param {?Object=} arg Argument to be normalized (nullable optional)
   * @return {!Object}
   */
  normalizeMergeArg: function(arg) {
    return arg === undefined || arg === null ? {} : arg;
  },

  /**
   * If merging Arrays, a merge strategy *must* be supplied. If not, it is
   * likely the caller's fault. If this function is ever called with anything
   * but `one` and `two` being `Array`s, it is the fault of the merge utilities.
   *
   * @param {*} one Array to merge into.
   * @param {*} two Array to merge from.
   */
  checkMergeArrayArgs: function(one, two) {
    ("production" !== process.env.NODE_ENV ? invariant(
      Array.isArray(one) && Array.isArray(two),
      'Tried to merge arrays, instead got %s and %s.',
      one,
      two
    ) : invariant(Array.isArray(one) && Array.isArray(two)));
  },

  /**
   * @param {*} one Object to merge into.
   * @param {*} two Object to merge from.
   */
  checkMergeObjectArgs: function(one, two) {
    mergeHelpers.checkMergeObjectArg(one);
    mergeHelpers.checkMergeObjectArg(two);
  },

  /**
   * @param {*} arg
   */
  checkMergeObjectArg: function(arg) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !isTerminal(arg) && !Array.isArray(arg),
      'Tried to merge an object, instead got %s.',
      arg
    ) : invariant(!isTerminal(arg) && !Array.isArray(arg)));
  },

  /**
   * @param {*} arg
   */
  checkMergeIntoObjectArg: function(arg) {
    ("production" !== process.env.NODE_ENV ? invariant(
      (!isTerminal(arg) || typeof arg === 'function') && !Array.isArray(arg),
      'Tried to merge into an object, instead got %s.',
      arg
    ) : invariant((!isTerminal(arg) || typeof arg === 'function') && !Array.isArray(arg)));
  },

  /**
   * Checks that a merge was not given a circular object or an object that had
   * too great of depth.
   *
   * @param {number} Level of recursion to validate against maximum.
   */
  checkMergeLevel: function(level) {
    ("production" !== process.env.NODE_ENV ? invariant(
      level < MAX_MERGE_DEPTH,
      'Maximum deep merge depth exceeded. You may be attempting to merge ' +
      'circular structures in an unsupported way.'
    ) : invariant(level < MAX_MERGE_DEPTH));
  },

  /**
   * Checks that the supplied merge strategy is valid.
   *
   * @param {string} Array merge strategy.
   */
  checkArrayStrategy: function(strategy) {
    ("production" !== process.env.NODE_ENV ? invariant(
      strategy === undefined || strategy in mergeHelpers.ArrayStrategies,
      'You must provide an array strategy to deep merge functions to ' +
      'instruct the deep merge how to resolve merging two arrays.'
    ) : invariant(strategy === undefined || strategy in mergeHelpers.ArrayStrategies));
  },

  /**
   * Set of possible behaviors of merge algorithms when encountering two Arrays
   * that must be merged together.
   * - `clobber`: The left `Array` is ignored.
   * - `indexByIndex`: The result is achieved by recursively deep merging at
   *   each index. (not yet supported.)
   */
  ArrayStrategies: keyMirror({
    Clobber: true,
    IndexByIndex: true
  })

};

module.exports = mergeHelpers;

}).call(this,require("1YiZ5S"))
},{"./invariant":18,"./keyMirror":19,"1YiZ5S":16}],22:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeInto
 * @typechecks static-only
 */

"use strict";

var mergeHelpers = require("./mergeHelpers");

var checkMergeObjectArg = mergeHelpers.checkMergeObjectArg;
var checkMergeIntoObjectArg = mergeHelpers.checkMergeIntoObjectArg;

/**
 * Shallow merges two structures by mutating the first parameter.
 *
 * @param {object|function} one Object to be merged into.
 * @param {?object} two Optional object with properties to merge from.
 */
function mergeInto(one, two) {
  checkMergeIntoObjectArg(one);
  if (two != null) {
    checkMergeObjectArg(two);
    for (var key in two) {
      if (!two.hasOwnProperty(key)) {
        continue;
      }
      one[key] = two[key];
    }
  }
}

module.exports = mergeInto;

},{"./mergeHelpers":21}]},{},[13])