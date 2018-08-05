import React, { Component } from 'react';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

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

const isSearched = (searchTerm) => (item) => item.title.includes(searchTerm);

class App extends Component {
  state = { result: null, searchTerm: DEFAULT_QUERY };

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  fetchSearchTopStories = (searchTerm) => {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((err) => err);
  };

  onSearchSubmit = () => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  };

  setSearchTopStories = (result) => {
    this.setState({ result });
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
        {result && (
          <Table
            result={result}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        )}
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

const Table = ({ result, pattern, onDismiss }) => (
  <div className="table">
    {result.hits.filter(isSearched(pattern)).map((item) => (
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
