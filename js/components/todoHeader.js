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

var todoHeader = React.createClass({

    render: function(){
        return (
            <header id="header">
                <h1>todos</h1>
                <todoInput onSave={this._create}/>
            </header>
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