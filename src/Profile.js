import axios from "axios";
import React from "react";
import "./card.css";

class Profiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      username: "ramazan-shira",
      user: "",
      followers: [],
      repos: [],
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

  fetchFollowers = async () => {
    const resp = await axios.get(
      `https://api.github.com/users/${this.state.username}/followers`
    );

    this.setState({ followers: resp.data });
  };

  fetchRepos = async () => {
    const repos = await axios.get(
      `https://api.github.com/users/${this.state.username}/repos`
    );
    this.setState({ repos: repos.data });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.username !== this.state.username) {
      this.fetchData();
      this.fetchFollowers();
      this.fetchRepos();
    }
  }

  render() {
    return (
      <div className="github-profile">
        <div className="search-user">
          <input
            type="text"
            placeholder="Username"
            value={this.state.input}
            onChange={this.handleInput}
          />
          <button onClick={this.setUsername}>Search</button>
        </div>
        <div className="profile">
          <div className="profile-img">
            <img src={this.state.user.avatar_url} alt="profile" />
          </div>
          <div className="profile-info">
            <h1>{this.state.user.name}</h1>
            <p onClick={this.fetchRepos}>
              Repos: {this.state.user.public_repos}
            </p>
            <p onClick={this.fetchFollowers}>
              Followers: {this.state.user.followers}
            </p>
            <p>Following: {this.state.user.following}</p>
          </div>
        </div>
        <div className="followers">
          {this.state.followers?.map((follower) => (
            <div className="followers-profile" key={follower.id}>
              <div className="profile-img">
                <img src={follower.avatar_url} alt="profile" />
              </div>
              <div className="followers-info">
                <h1>{follower.login}</h1>
                <p>
                  Profile URL:{" "}
                  <a href={`https://api.github.com/users/${follower.url}`}>
                    {follower.url}
                  </a>
                </p>
                <p>
                  <a
                    href={`https://api.github.com/users/${follower.url}/repos`}
                  >
                    Repos: {follower.repos_url}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="repos">
          {this.state.repos.map((repo) => (
            <div className="repo">
              <div className="repo-img">
                <img src={repo.avatar_url} alt="repo" />
              </div>
              <div className="repo-info">
                <h3>{repo.name}</h3>
                <p>Language: {repo.language}</p>
                <p>
                  Repo on Github: <a href={repo.html_url}>{repo.html_url}</a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Profiles;
