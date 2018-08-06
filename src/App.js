import React, { Component } from 'react';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

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
  state = { results: null, searchKey: '', searchTerm: DEFAULT_QUERY };

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  needsToSearchTopStories = (searchTerm) => !this.state.results[searchTerm];

  fetchSearchTopStories = (searchTerm, page = 0) => {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((err) => err);
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
    const { results, searchTerm, searchKey } = this.state;
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
        <Table list={list} onDismiss={this.onDismiss} />
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More stories
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <button type="submit">{children}</button>
    <input type="text" value={value} onChange={onChange} />
  </form>
);

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map((item) => (
      <div key={item.objectID} className="table-row">
        <span style={tinyColumn}>{item.objectID}</span>
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>{' '}
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>
          <Button className="button-inline" onClick={onDismiss(item.objectID)}>
            Remove
          </Button>
        </span>
      </div>
    ))}
  </div>
);

const Button = ({ className = '', onClick, children }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

export default App;
