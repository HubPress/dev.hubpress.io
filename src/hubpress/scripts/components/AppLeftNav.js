import React from 'react';
import {Router, Link} from 'react-router';
import { connect } from 'react-redux';
import { MenuItem, LeftNav, Mixins, Styles, Avatar } from 'material-ui';
import ListDivider from 'material-ui/lib/lists/list-divider';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Payment from 'material-ui/lib/svg-icons/action/payment';
import Update from 'material-ui/lib/svg-icons/action/update';
import Subject from 'material-ui/lib/svg-icons/action/subject';
import Settings from 'material-ui/lib/svg-icons/action/settings';
import PowerSettingsNew from 'material-ui/lib/svg-icons/action/power-settings-new';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

const SelectableList = SelectableContainerEnhance(List);
let { Colors, Spacing, Typography } = Styles;
let { StylePropable } = Mixins;

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
    const author = {
      id: this.props.userInfos.id,
      name: this.props.userInfos.name,
      location:this.props.userInfos.location,
      website:this.props.userInfos.blog,
      image:this.props.userInfos.avatar_url
    };

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
            leftIcon={<Subject />}
          />
          <ListItem
            value="/settings"
            primaryText="Settings"
            leftIcon={<Settings />}
          />
          <ListItem
            value="/logout"
            primaryText="Logout"
            leftIcon={<PowerSettingsNew />}
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
        <ListDivider />
        <SelectableList
            valueLink={{
              value: "",
              requestChange: this.handleRequestChangeLink,
            }}
          >
          <ListItem
            value="https://www.paypal.me/anthonny/5"
            primaryText="Donation PayPal"
            leftIcon={<Payment />}
          />
          <ListItem
            value="https://gratipay.com/hubpress/"
            primaryText="Donation Gratipay"
            leftIcon={<Payment />}
          />
        </SelectableList>
        <ListDivider />
        <SelectableList
          valueLink={{
            value: "",
            requestChange: this.handleRequestChangeLink,
          }}
          >
          <ListItem
            value={`https://github.com/${this.props.config.meta.username}/${this.props.config.meta.repositoryName}/compare/${this.props.config.meta.branch}...HubPress:${this.props.config.meta.branch}`}
            primaryText="Check for upgrade"
            leftIcon={<Update />}
            />
        </SelectableList>
        <div style={{position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', marginBottom:'8px'}} >version {this.props.config.version}</div>
      </LeftNav>
    );
  },

  toggle() {
    this.setState({
      leftNavOpen: !this.state.leftNavOpen,
    });
  },

  handleRequestChangeLink(event, value) {
    window.location = value;
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

export default AppLeftNav;
