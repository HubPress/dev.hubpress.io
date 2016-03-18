import React from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/lib/icon-button';
import Menu from 'material-ui/lib/svg-icons/navigation/menu';
import AppLeftNav from './AppLeftNav';

class TopBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._onLeftIconButtonTouchTap = this._onLeftIconButtonTouchTap.bind(this);
  }

  _onLeftIconButtonTouchTap() {
    this.refs.leftNav.toggle();
  }

  render() {
    let style = {
      topbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '48px',
        padding: '0px 5px 0px 5px',
        lineHeight: '48px',
        backgroundColor: '#eb653a'
      }
    };

    return (
      <div>
        <div style={style.topbar}>
            <IconButton onClick={this._onLeftIconButtonTouchTap} style={{float: 'left'}} iconStyle={{color: '#fff'}} iconClassName="material-icons">menu</IconButton>

            {this.props.children}

        </div>
        <AppLeftNav ref="leftNav" history={this.props.history} location={this.props.location} userInfos={this.props.userInfos}/>
      </div>
    );
  }

}


const mapStateToProps = (state/*, props*/) => {
  return {
    userInfos: state.authentication.userInformations
  };
}

const ConnectedTopBar = connect(mapStateToProps)(TopBar)

module.exports = ConnectedTopBar;
