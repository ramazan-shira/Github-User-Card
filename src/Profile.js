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
      showRepos: false,
      showFollowers: false,
      loading: false,
      error: "",
    };

    this.handleInput = this.handleInput.bind(this);
    this.setUsername = this.setUsername.bind(this);
  }

  handleInput(e) {
    this.setState({ input: e.target.value });
  }

  setUsername() {
    this.setState({
      username: this.state.input,
      showFollowers: false,
      showRepos: false,
    });
  }

  handleFollowers(login) {
    this.setState({
      username: login,
      input: login,
      showFollowers: false,
      showRepos: false,
    });
  }

  fetchData = async () => {
    this.setState({ loading: true });
    const response = await axios.get(
      `https://api.github.com/users/${this.state.username}`
    );

    if (response.data) {
      this.setState({
        user: response.data,
        showFollowers: false,
        showRepos: false,
        loading: false,
      });
    } else {
      this.setState({ error: "No user found!!" });
    }
  };

  fetchFollowers = async () => {
    this.setState({ loading: true });

    const resp = await axios.get(
      `https://api.github.com/users/${this.state.username}/followers`
    );
    if (resp.data)
      this.setState({
        followers: resp.data,
        showFollowers: true,
        showRepos: false,
        loading: false,
      });
  };

  fetchRepos = async () => {
    this.setState({ loading: true });

    const repos = await axios.get(
      `https://api.github.com/users/${this.state.username}/repos`
    );
    this.setState({
      repos: repos.data,
      showFollowers: false,
      showRepos: true,
      loading: false,
    });
  };

  componentDidMount() {
    this.fetchData();
    this.setState({ loading: false });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.username !== this.state.username) {
      this.fetchData();

      this.setState({
        showFollowers: false,
        showRepos: false,
        loading: false,
      });
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
        {this.state.loading && <h1 style={{ color: "red" }}>Loading...</h1>}
        {this.state.error !== "" ? (
          <h1>{this.state.error}</h1>
        ) : (
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
        )}
        {this.state.loading && <h1 style={{ color: "red" }}>Loading...</h1>}
        {this.state.showFollowers && (
          <div className="followers">
            {this.state.followers?.map((follower) => (
              <div className="followers-profile" key={follower.id}>
                <div className="profile-img">
                  <img src={follower.avatar_url} alt="profile" />
                </div>
                <div className="followers-info">
                  <h1>{follower.login}</h1>
                  <p onClick={() => this.handleFollowers(follower.login)}>
                    View Profile
                  </p>
                  <p>
                    Github Link:{" "}
                    <a href={follower.html_url}>{follower.html_url}</a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {this.state.showRepos && (
          <div className="repos">
            {this.state.repos.map((repo) => (
              <div className="repo" key={repo.id}>
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
        )}
      </div>
    );
  }
}

export default Profiles;
