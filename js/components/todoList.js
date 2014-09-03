/**
 * @jsx React.DOM
 */

 var TodoItem = require('./todoItem');

var todoList = React.createClass({
    render: function() {
        var allTodos = this.props.allTodos;
        var node = [];
        for( var i in allTodos){
            node.push( <TodoItem key={i} todo={allTodos[i]}/> )
        }
        if( node.length === 0){
            var noTodoState = {
                id: 000,
                text: 'No todo yet',
                complete: false
            };
            node = [<li> <label>No todo yet.</label> </li>];
        }

        return (
            <ul id="todo-list">{node}</ul>
        );
    }
});

module.exports = todoList;