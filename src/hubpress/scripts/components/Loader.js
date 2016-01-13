import React from 'react';

import RefreshIndicator from 'material-ui/lib/refresh-indicator';

class Loader extends React.Component {

  render() {
    if (!this.props.loading)
      return (<div></div>);

    return (
      <div className={'loader-container'}>
        <div className={'loader'}>
          <RefreshIndicator className={'loader'} size={40} left={0} top={0} status="loading" />
        </div>
      </div>

    );
  }
}

module.exports = Loader;
