import React, { Component } from 'react';

class App extends Component {
  render() {
    const {
      user: { firstName, lastName },
    } = this.props;
    const hello = 'Hello, ';
    return (
      <div className="App">
        <h2>Sample header</h2>
        <p>
          {hello}
          {`${firstName} ${lastName}`}
        </p>
      </div>
    );
  }
}

export default App;
