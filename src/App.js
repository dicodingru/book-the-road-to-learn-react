import React, { Component } from 'react';

const list = [
  {
    id: 1,
    title: 'google',
    url: 'google.com',
    author: 'brin',
  },
  {
    id: 2,
    title: 'yandex',
    url: 'yandex.ru',
    author: 'alex',
  },
  {
    id: 3,
    title: 'yahoo',
    url: 'yahoo.com',
    author: 'jim',
  },
];

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

const Search = ({ value, onChange, children }) => (
  <form>
    {children} <input type="text" value={value} onChange={onChange} />
  </form>
);

const Table = ({ list, pattern, onDismiss }) => (
  <div className="table">
    {list.filter(isSearched(pattern)).map((item) => (
      <div key={item.id} className="table-row">
        <span style={tinyColumn}>{item.id}</span>
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>{' '}
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>
          <Button className="button-inline" onClick={onDismiss(item.id)}>
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

class App extends Component {
  state = { list, searchTerm: '' };

  onDismiss = (removeId) => (e) => {
    this.setState(({ list }) => {
      const updatedList = list.filter(({ id }) => id !== removeId);
      return { list: updatedList };
    });
  };

  onSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    const { list, searchTerm } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange}>
            Search
          </Search>
        </div>
        <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}

export default App;
