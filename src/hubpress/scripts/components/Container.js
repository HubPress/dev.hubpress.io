import React from 'react';

class Container extends React.Component {

  getStyles() {
    return {
      position: 'absolute',
      top: '48px',
      bottom: '0',
      left: '0',
      right: '0',
      boxSizing: 'border-box',
      width: '100%',
      overflowX: 'hidden',
      backgroundColor: '#fff'
      //backgroundColor: '#e5e5e5'
    };
  }

  render() {
    return (
      <div id={this.props.id} style={this.getStyles()}>
        {this.props.children}
      </div>
    );
  }
}

export default Container;
