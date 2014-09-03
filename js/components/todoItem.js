/**
 * @jsx React.DOM
 */

var TodoAction = require('../actions/TodoAction');
var TodoTextInput = require('./todoInput');

var ENTER_KEY = 13;


var todoItem = React.createClass({
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
            inputEle = <TodoTextInput
                value={todo.text}
                onSave={this._updateText}
            />;
        }
        return (
            <li className={itemClass} data-todoid={todo.id}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={todo.complete}

                        onClick={this._toggleComplete}
                    />
                    <label onDoubleClick={this._startEditing}>
                        {todo.text}
                    </label>
                    <button className="destroy" onClick={this._distroy}/>
                </div>
                {inputEle}
            </li>
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