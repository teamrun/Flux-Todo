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

var TodoApp = React.createClass({
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
            <div>
                <TodoHeader />
                <section id="main">
                    <input
                        id="toggle-all"
                        type="checkbox"

                        checked={this.state.allComplete}
                        onClick={this._toggleAll}
                    />
                    <label htmlFor="toggle-all">Mark all as complete</label>
                    <TodoList allTodos={this.state.allTodos}/>
                </section>
                <TodoFooter allTodos={this.state.allTodos}/>
            </div>
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