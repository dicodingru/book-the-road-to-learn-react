import React, { Component } from 'react';
import axios from 'axios';
import cn from 'classnames';
import { sortBy } from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

library.add(faSpinner);

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
// const PATH_BASE = 'https://sdfkalgolia.com/api/v1'; // trigger an error
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  POINTS: (list) => sortBy(list, 'points').reverse(),
};

const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};
const smallColumn = {
  width: '20%',
};
const tinyColumn = {
  width: '10%',
};

class App extends Component {
  _isMounted = false;

  state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false,
  };

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  needsToSearchTopStories = (searchTerm) => !this.state.results[searchTerm];

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(
        (result) => this._isMounted && this.setSearchTopStories(result.data)
      )
      .catch((error) => this._isMounted && this.setState({ error }));
  };

  onSearchSubmit = (e) => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    this.needsToSearchTopStories(searchTerm) &&
      this.fetchSearchTopStories(searchTerm);

    e.preventDefault();
  };

  setSearchTopStories = (result) => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
      isLoading: false,
    });
  };

  onDismiss = (id) => () => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const updatedHits = hits.filter(({ objectID }) => objectID != id);

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
    });
  };

  onSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    const { results, searchTerm, searchKey, error, isLoading } = this.state;

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        {error ? (
          <p>Something went wrong...</p>
        ) : (
          <div>
            <Table list={list} onDismiss={this.onDismiss} />
            <div className="interactions">
              <ButtonWithLoading
                isLoading={isLoading}
                onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                More stories
              </ButtonWithLoading>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class Search extends Component {
  componentDidMount() {
    this.input && this.input.focus();
  }
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <button type="submit">{children}</button>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(node) => {
            this.input = node;
          }}
        />
      </form>
    );
  }
}

const Sort = ({ sortKey, children, onSort, activeSortKey }) => {
  const sortClass = cn('button-inline', {
    'button-active': sortKey === activeSortKey,
  });
  return (
    <Button className={sortClass} onClick={() => onSort(sortKey)}>
      {children}
    </Button>
  );
};

class Table extends Component {
  state = {
    sortKey: 'NONE',
    isSortReverse: false,
  };

  onSort = (sortKey) => {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  };

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span style={tinyColumn}>ID</span>
          <span style={largeColumn}>
            <Sort
              onSort={this.onSort}
              sortKey={'TITLE'}
              activeSortKey={sortKey}>
              Title
            </Sort>
          </span>{' '}
          <span style={smallColumn}>
            <Sort
              onSort={this.onSort}
              sortKey={'AUTHOR'}
              activeSortKey={sortKey}>
              Author
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              onSort={this.onSort}
              sortKey={'POINTS'}
              activeSortKey={sortKey}>
              Points
            </Sort>
          </span>
          <span style={tinyColumn}>Remove</span>
        </div>
        {reverseSortedList.map((item) => (
          <div key={item.objectID} className="table-row">
            <span style={tinyColumn}>{item.objectID}</span>
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>{' '}
            <span style={smallColumn}>{item.author}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={tinyColumn}>
              <Button
                className="button-inline"
                onClick={onDismiss(item.objectID)}>
                Remove
              </Button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}

const Button = ({ className = '', onClick, children }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

const Loading = () => (
  <div>
    <FontAwesomeIcon icon="spinner" rotation={90} spin size="lg" />
  </div>
);

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

export default App;

export { Button, Search, Table, SORTS };
