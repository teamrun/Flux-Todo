/**
 * jsx comments: start with slice and two stars
 * 
 * @jsx React.DOM
 * 
 * it can be everwhere
 */

console.log('js file change will trigger: bundle by browserify & then trigger live reload');

var TodoApp = require('./components/todoApp');

React.renderComponent(<TodoApp/>, document.getElementById('todoapp'));