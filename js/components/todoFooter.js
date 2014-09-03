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

var TodoFooter = React.createClass({
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

        var node = [<span id="todo-count"><span>{leftCount}</span> items left.</span>];
        if(completeCount > 0){
            node.push(<span id="clear-completed" onClick={this._clearCompleted}>Clear completed(<span>{completeCount}</span>)</span>)
        }
        return (
            <footer id="footer">
                {node}
            </footer>
        );
    },
    _clearCompleted: function(){
        TodoAction.clearCompleted();
    }

});

module.exports = TodoFooter;