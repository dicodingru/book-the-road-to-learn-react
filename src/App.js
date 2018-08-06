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
  state = { result: null, searchTerm: DEFAULT_QUERY };

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

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
    this.fetchSearchTopStories(searchTerm);
    e.preventDefault();
  };

  setSearchTopStories = (result) => {
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits];

    this.setState({ result: { hits: updatedHits, page } });
  };

  onDismiss = (id) => () => {
    this.setState(({ result }) => {
      const updatedHits = result.hits.filter(({ objectID }) => objectID != id);
      return { result: { ...result, hits: updatedHits } };
    });
  };

  onSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    const { result, searchTerm } = this.state;
    const page = (result && result.page) || 0;
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
        {result && <Table result={result} onDismiss={this.onDismiss} />}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
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

const Table = ({ result, onDismiss }) => (
  <div className="table">
    {result.hits.map((item) => (
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
