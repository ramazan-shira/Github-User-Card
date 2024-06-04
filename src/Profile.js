import axios from "axios";
import React from "react";
import "./card.css";

class Profiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      username: "",
      user: "",
    };
    this.handleInput = this.handleInput.bind(this);
    this.setUsername = this.setUsername.bind(this);
  }

  handleInput(e) {
    this.setState({ input: e.target.value });
  }

  setUsername() {
    this.setState({ username: this.state.input });
  }

  fetchData = async () => {
    const response = await axios.get(
      `https://api.github.com/users/${this.state.username}`
    );
    this.setState({ user: response.data });
  };

  componentDidMount() {
    if (this.state.username === "") {
      <h1>No data</h1>;
    } else {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.username !== this.state.username) {
      this.fetchData();
    }
  }

  render() {
    return (
      <div className="profiles">
        <div className="user-form">
          <input
            type="text"
            placeholder="Username"
            value={this.state.input}
            onChange={this.handleInput}
          />
          <button onClick={this.setUsername}>Search</button>
        </div>
        {this.state.user && (
          <div className="profile-card">
            <div className="profile-img">
              <img
                src={this.state.user.avatar_url}
                width={150}
                height={150}
                alt="profile"
              />
            </div>
            <div className="profile-info">
              <h1>{this.state.user.name}</h1>
              <p>Profile URL:{this.state.user.url} </p>
              <p>Public repos: {this.state.user.public_repos}</p>
              <p>Followers: {this.state.user.followers}</p>
              <p>Following: {this.state.user.following}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Profiles;
