'use strict';

/**
 * Dependencies
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import { loadRepositories } from '../lib/github';
import DashboardWrapper from '../components/dashboard-wrapper';
import Actions from '../actions';
import Button from '../components/button';
import Link from '../components/link';


/**
 * New project page
 */

const NewProjectPage = React.createClass({
	getInitialState: function () {
		return {
			query: null,
			repos: []
		};
	},

	componentWillMount: function () {
		loadRepositories(this.props.user.githubAccessToken, repos => {
			this.setState({ repos });
		});
	},

	componentDidMount: function () {
		document.title = 'New project - OhCrash';
	},

	render: function () {
		let repos = this.state.repos;

		if (this.state.query) {
			repos = repos.filter(repo => {
				return repo.full_name.indexOf(this.state.query) >= 0;
			});
		}

		let repositories = repos.map(repo => {
			return <li key={ repo.id }>
				<a href="#" onClick={ this.chooseRepo.bind(this, repo) }>
					{ repo.full_name }
				</a>
			</li>;
		});

		return <DashboardWrapper>
			<div className="clearfix">
				<h3 className="mt0 left">New project</h3>

				<div className="right">
					<Link to="/projects" className="btn red pr0">Cancel</Link>
				</div>
			</div>

			<p className="mt3">
				Select a repository, where OhCrash should open issues for reported errors.
			</p>

			<div className="mt2">
				<input type="text" className="field" placeholder="Enter a repository name" value={ this.state.query } onChange={ this.setQuery }/>
			</div>

			<ul className="mt3 list-reset">
				{ repositories }
			</ul>
		</DashboardWrapper>
	},

	chooseRepo: function (repo, e) {
		e.preventDefault();

		this.props.actions.createProject({
			githubId: repo.id,
			fullName: repo.full_name,
			name: repo.name
		});
	},

	setQuery: function (e) {
		this.setState({
			query: e.target.value
		});
	}
});


/**
 * Build props
 */

function mapStateToProps (state) {
	return {
		user: state.user
	};
}

function mapDispatchToProps (dispatch) {
	return {
		actions: bindActionCreators(Actions, dispatch)
	};
}


/**
 * Expose page
 */

export default connect(mapStateToProps, mapDispatchToProps)(NewProjectPage);