import React, { Component } from 'react';
import Codemirror from 'react-codemirror';

export default class CodeMirror extends Component {

  constructor () {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    // if (!this.content) {
    //   console.log('CoreMirror - Initial content loaded');
    //   this.content = nextProps.content;
    // }
  }

  componentWillUnmount() {
    // this.content = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props, nextProps)
    //return true;
    return !this.props.value || nextProps.isDark !== this.props.isDark;
  }

  getCMTheme() {
    return this.props.isDark?' dark':' light';
  }

  handleChange(content) {
    if (this.props.onChange) {
      this.props.onChange(content);
    }
  }

  render() {
    return <Codemirror
      ref="editor"
      value={this.props.value}
      onChange={this.handleChange}
      options={this.props.options}
      className={'editor' + this.getCMTheme() }
      style= {{border: '1px solid black'}}/>;
  }
}
