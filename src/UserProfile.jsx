/** @jsx React.DOM */

'use strict';

var moment = require('moment')
var React = require('react/addons')
var ReactFireMixin = require('reactfire')

var ItemStore =  require('./stores/ItemStore')
var Spinner = require('./Spinner')

var setTitle = require('./utils/setTitle')

// TODO User submissions

// TODO User comments

var UserProfile = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {user: {}}
  },
  componentWillMount: function() {
    this.bindAsObject(ItemStore.userRef(this.props.params.id), 'user')
  },
  componentWillUpdate: function(nextProps, nextState) {
    if (this.state.user.id != nextState.user.id) {
      setTitle('Profile: ' + nextState.user.id)
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.props.params.id != nextProps.params.id) {
      this.unbind('user')
      this.bindAsObject(ItemStore.userRef(nextProps.params.id), 'user')
    }
  },
  render: function() {
    var user = this.state.user
    if (!user.id) {
      return <div className="UserProfile UserProfile--loading">
        <h4>{this.props.params.id}</h4>
        <Spinner size="20"/>
      </div>
    }
    var createdMoment = moment(user.created * 1000)
    return <div className="UserProfile">
      <h4>{user.id}</h4>
      <dl>
        <dt>Created</dt>
        <dd>{createdMoment.fromNow()} ({createdMoment.format('LL')})</dd>
        <dt>Karma</dt>
        <dd>{user.karma}</dd>
        <dt>Delay</dt>
        <dd>{user.delay}</dd>
        {user.about && <dt>About</dt>}
        {user.about && <dd><div className="UserProfile__about" dangerouslySetInnerHTML={{__html: user.about}}/></dd>}
      </dl>
    </div>
  }
})

module.exports = UserProfile