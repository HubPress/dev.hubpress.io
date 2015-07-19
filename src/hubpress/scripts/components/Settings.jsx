const React = require('react');
const LinkedStateMixin = require("react/lib/LinkedStateMixin");
const assign = require('object-assign');
const Router = require('react-router');
const Loader = require('./Loader');
import Authentication from './Authentication';
import SettingsStore from '../stores/SettingsStore';
import PostsStore from '../stores/PostsStore';
import SettingsActionCreators from '../actions/SettingsActionCreators';

function _getState() {
  let config = SettingsStore.config();

  return {
    // Meta
    username : config.meta.username,
    repositoryName : config.meta.repositoryName,
    branch : config.meta.branch,
    cname : config.meta.cname,
    delay : config.meta.delay,

    // site
    title: config.site && config.site.title,
    description: config.site && config.site.description,
    logo: config.site && config.site.logo,
    cover: config.site && config.site.cover,
    postsPerPage: config.site && config.site.postsPerPage,
    googleAnalytics: config.site && config.site.googleAnalytics,
    disqus: config.site && config.site.disqus,

    //socialnetwork
    email: config.socialnetwork && config.socialnetwork.email,
    twitter: config.socialnetwork && config.socialnetwork.twitter,
    googleplus: config.socialnetwork && config.socialnetwork.googleplus,
    linkedin: config.socialnetwork && config.socialnetwork.linkedin,
    github: config.socialnetwork && config.socialnetwork.github,
    facebook: config.socialnetwork && config.socialnetwork.facebook,
    flickr: config.socialnetwork && config.socialnetwork.flickr,
    pinterest: config.socialnetwork && config.socialnetwork.pinterest,
    instagram: config.socialnetwork && config.socialnetwork.instagram,

    // theme
    theme: config.theme.name,
    loading: false
  };
}

class Settings extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.mixins = [ Authentication ];
    this.state = _getState();
    this.linkState = (context, item) => {
      return {
        value: context.state[item],
        requestChange: (value) => {
          let obj = {};
          obj[item] = value;
          context.setState(obj);
        }
      };
    };
  }

  componentDidMount() {
    PostsStore.addChangeListener(this._onPostsStoreChange.bind(this));
    SettingsStore.addChangeListener(this._onSettingsStoreChange.bind(this));
  }

  componentWillUnmount() {
    PostsStore.removeChangeListener(this._onPostsStoreChange.bind(this));
    SettingsStore.removeChangeListener(this._onSettingsStoreChange.bind(this));
  }

  _onPostsStoreChange() {
    this.setState(assign(this.state, {loading: PostsStore.isLoading()}));
  }

  _onSettingsStoreChange() {
  }

  getSiteUrl() {
    return SettingsStore.getSiteUrl({
      username: this.state.username,
      repositoryName: this.state.repositoryName,
      cname: this.state.cname,
      branch: this.state.branch
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const settings = {
      meta: {
        username: this.state.username,
        repositoryName: this.state.repositoryName,
        branch:this.state.branch,
        cname:this.state.cname,
        delay:this.state.delay
      },
      site: {
        title: this.state.title,
        description: this.state.description,
        logo: this.state.logo,
        cover: this.state.cover,
        postsPerPage: this.state.postsPerPage,
        googleAnalytics: this.state.googleAnalytics,
        disqus: this.state.disqus
      },
      socialnetwork:{
        email: this.state.email,
        twitter: this.state.twitter,
        googleplus: this.state.googleplus,
        linkedin: this.state.linkedin,
        facebook: this.state.facebook,
        flickr: this.state.flickr,
        instagram: this.state.instagram,
        pinterest: this.state.pinterest,
        github: this.state.github
      },
      theme:{
        name: this.state.theme,
        url: SettingsStore.getThemeUrl(this.state.theme)
      }
    }
    SettingsActionCreators.saveAndPublish(settings);

    this.setState(assign(this.state, {loading: true}));
  }

  render() {
    return (
      <div>
        <Loader loading={this.state.loading}></Loader>
        <div className="container settings">
        <form name="settingsForm" noValidate onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
        <legend>Meta</legend>

        <ol>
        <li>
        <label htmlFor="username">Git username</label>
        <p>{this.state.username}</p>
        </li>
        <li>
        <label htmlFor="repositoryName">Git repository name</label>
        <p>{this.state.repositoryName}</p>
        </li>
        <li>
        <label htmlFor="branch">Git branch</label>
        <p>{this.state.branch}</p>
        </li>
        <li>
        <label htmlFor="cname">Git CNAME</label>
        <input type="text" name="cname" valueLink={this.linkState(this,'cname')}  className="form-control" />
        <p>{this.getSiteUrl()}</p>
        </li>
        <li>
        <label htmlFor="delay">Live Preview Render Delay (ms)</label>
        <input type="text" name="delay" valueLink={this.linkState(this,'delay')}  className="form-control" placeholder="Default value 200"/>
        </li>
        </ol>

        </fieldset>
        <fieldset>
        <legend>Site</legend>

        <ol>
        <li>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" valueLink={this.linkState(this,'title')}  className="form-control" required />
        </li>
        <li>
        <label htmlFor="description">Description</label>
        <textarea name="description" cols="30" rows="10" valueLink={this.linkState(this,'description')} className="form-control" required></textarea>
        </li>
        <li>
        <label htmlFor="logo">Logo</label>
        <input type="text" name="logo" valueLink={this.linkState(this,'logo')}  className="form-control" required />
        </li>
        <li>
        <label htmlFor="cover">Cover image</label>
        <input type="text" name="cover" valueLink={this.linkState(this,'cover')}  className="form-control" required />
        </li>
        <li>
        <label htmlFor="theme">Theme</label>
        <input type="text" name="theme" valueLink={this.linkState(this,'theme')}  className="form-control" required />
        </li>
        <li>
        <label htmlFor="postsPerPage">Posts per page</label>
        <input type="text" name="postsPerPage" valueLink={this.linkState(this,'postsPerPage')} className="form-control" required />
        </li>
        <li>
        <label htmlFor="googleAnalytics">Google analytics</label>
        <input type="text" name="googleAnalytics" valueLink={this.linkState(this,'googleAnalytics')} className="form-control" />
        </li>
        <li>
        <label htmlFor="disqus">Disqus shortname</label>
        <input type="text" name="disqus" valueLink={this.linkState(this,'disqus')} className="form-control" />
        </li>
        </ol>

        </fieldset>
        <fieldset>
        <legend>Social network</legend>

        <ol>
        <li>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" valueLink={this.linkState(this,'email')} className="form-control" />
        </li>
        <li>
        <label htmlFor="twitter">Twitter</label>
        <input type="text" name="twitter" valueLink={this.linkState(this,'twitter')} className="form-control" />
        </li>
        <li>
        <label htmlFor="facebook">Facebook</label>
        <input type="text" name="facebook" valueLink={this.linkState(this,'facebook')} className="form-control" />
        </li>
        <li>
        <label htmlFor="googleplus">Google+</label>
        <input type="text" name="googleplus" valueLink={this.linkState(this,'googleplus')} className="form-control" />
        </li>
        <li>
        <label htmlFor="instagram">Instagram</label>
        <input type="text" name="instagram" valueLink={this.linkState(this,'instagram')} className="form-control" />
        </li>
        <li>
        <label htmlFor="pinterest">Pinterest</label>
        <input type="text" name="pinterest" valueLink={this.linkState(this,'pinterest')} className="form-control" />
        </li>
        <li>
        <label htmlFor="flickr">Flickr</label>
        <input type="text" name="flickr" valueLink={this.linkState(this,'flickr')} className="form-control" />
        </li>
        <li>
        <label htmlFor="linkedin">LinkedIn</label>
        <input type="text" name="linkedin" valueLink={this.linkState(this,'linkedin')} className="form-control" />
        </li>
        <li>
        <label htmlFor="github">Github</label>
        <input type="text" name="github" valueLink={this.linkState(this,'github')} className="form-control" />
        </li>
        </ol>

        </fieldset>

        <button type="submit" className="button success">Submit</button>

        </form>

        </div>
      </div>

    )
  }
}

export default Settings;
