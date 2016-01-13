let React = require('react');
let Router = require('react-router');
let { MenuItem, LeftNav, Mixins, Styles, Avatar } = require('material-ui');
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

const SelectableList = SelectableContainerEnhance(List);
let { Colors, Spacing, Typography } = Styles;
let { StylePropable } = Mixins;
// Stores
import AuthStore from '../stores/AuthStore';

let menuItems = [
    { route: '/posts', text: 'Posts' },
    { route: '/settings', text: 'Settings' },
    { route: '/logout', text: 'Logout' }
  ];


let AppLeftNav = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.func,
  },

  getStyles() {
    return {
      cursor: 'pointer',
      //.mui-font-style-headline
      fontSize: '24px',
      color: Typography.textFullWhite,
      lineHeight: Spacing.desktopKeylineIncrement + 'px',
      fontWeight: Typography.fontWeightLight,
      //backgroundColor: Colors.cyan500,
      paddingTop: '10px',
      marginBottom: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    };
  },

  getInitialState() {
    return {
      leftNavOpen: false,
    };
  },

  render() {
    let author = AuthStore.getAuthor() || {};

    let header = (
      <div style={this.getStyles()} onTouchTap={this._onHeaderClick}>
        <Avatar src={author.image} size={80} style={{display:'block',margin: '0 auto', border: 'solid 1px rgba(255,255, 255, 0.7)'}} />
        <p style={{textAlign:'center', margin: '12px auto'}} >{author.name}</p>
      </div>
    );

    let menus = (
      <SelectableList
          valueLink={{
            value: this.props.location.pathname,
            requestChange: this.handleRequestChangeList,
          }}
        >
          <ListItem
            value="/posts"
            primaryText="Posts"
          />
          <ListItem
            value="/settings"
            primaryText="Settings"
          />
          <ListItem
            value="/logout"
            primaryText="Logout"
          />
        </SelectableList>
    );

    return (
      <LeftNav
        ref="leftNav"
        docked={false}
        open={this.state.leftNavOpen}
        onRequestChange={this.handleChangeRequestLeftNav}
        >
        {header}
        {menus}
      </LeftNav>
    );
  },

  toggle() {
    this.setState({
      leftNavOpen: !this.state.leftNavOpen,
    });
  },

  handleRequestChangeList(e, value) {
    this.props.history.pushState(null, value);
    this.setState({
      leftNavOpen: false,
    });
  },

  handleChangeRequestLeftNav(open) {
    this.setState({
      leftNavOpen: open,
    });
  },

  _onHeaderClick() {
    this.props.history.pushState(null, '/');
    this.setState({
      leftNavOpen: false,
    });
  },

});

module.exports = AppLeftNav;
