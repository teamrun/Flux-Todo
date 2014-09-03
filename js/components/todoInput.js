/**
 * 
 * @jsx React.DOM
 */

var ENTER_KEY = 13;


 var todoInput = React.createClass({
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
            <input 
                id="new-todo"
                placeholder={this.props.placeholder}
                type="text"
                value={this.state.value}
                autoFocus={true}

                onChange={this._onChange}
                onKeyDown={this._onKeyDown}
                onBlur={this._onSave}
            />
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