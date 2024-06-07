import axios from "axios";
import React from "react";
import GitHubCalendar from "react-github-calendar";
import "./card.css";

class GithubProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      username: "ramazan-shira",
      user: "",
      repos: [],
      followers: [],
      loading: false,
      error: false,
      showFollowers: false,
      showRepos: false,
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

  fetchData = async () => {
    this.setState({ loading: true });
    try {
      const response = await axios.get(
        `https://api.github.com/users/${this.state.username}`
      );
      this.setState({
        user: response.data,
        showFollowers: false,
        showRepos: false,
        error: false,
      });
    } catch (error) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
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

  fetchRepos = async () => {
    this.setState({ loading: true });
    const repos = await axios.get(
      `https://api.github.com/users/${this.state.username}/repos`
    );
    this.setState({
      repos: repos.data,
      loading: false,
      showFollowers: false,
      showRepos: true,
    });
  };

  fetchFollowers = async () => {
    this.setState({ loading: true });
    const resp = await axios.get(
      `https://api.github.com/users/${this.state.username}/followers`
    );
    if (resp.data) {
      this.setState({
        followers: resp.data,
        showFollowers: true,
        showRepos: false,
        loading: false,
      });
    }
  };

  handleUser(login) {
    this.setState({
      username: login,
      input: login,
      showFollowers: false,
      showRepos: false,
      loading: true,
    });
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

        {this.state.error && <h1 className="error">No user found!!!</h1>}
        {!this.state.loading && !this.state.error && (
          <div className="profile">
            <div className="user-profile">
              <div className="profile-img">
                <img src={this.state.user.avatar_url} alt="profile" />
              </div>
              <div className="profile-info">
                <h1>{this.state.user.name}</h1>
                <p onClick={this.state.repos && this.fetchRepos}>
                  <span className="info-title click">Repos:</span>{" "}
                  {this.state.user.public_repos}
                </p>
                <p onClick={this.state.followers && this.fetchFollowers}>
                  <span className="info-title click">Followers:</span>{" "}
                  {this.state.user.followers}
                </p>
                <p>
                  <span className="info-title">Following:</span>{" "}
                  {this.state.user.following}
                </p>
              </div>
            </div>
            {this.state.loading && <h1>Loading...</h1>}
            {!this.state.loading && (
              <div className="graph">
                <p>
                  <span className="info-title">Github contribution graph:</span>
                </p>
                <GitHubCalendar
                  className="github-graph"
                  username={this.state.username}
                  colorScheme="light"
                />
              </div>
            )}
          </div>
        )}
        {this.state.loading && <h1>Loading...</h1>}
        {!this.state.loading && this.state.showRepos && (
          <div className="repos">
            {this.state.repos.map((repo) => (
              <div className="repo" key={repo.id}>
                <h3>{repo.name}</h3>
                <p>
                  <span className="info-title">Language:</span> {repo.language}
                </p>
                <p>
                  <span className="info-title">Repo on Github:</span>{" "}
                  <a href={repo.html_url}>{repo.html_url}</a>
                </p>
              </div>
            ))}
          </div>
        )}

        {!this.state.loading && this.state.showFollowers && (
          <div className="followers">
            {this.state.followers.map((follower) => (
              <div className="followers-profile" key={follower.id}>
                <div className="profile-img">
                  <img src={follower.avatar_url} alt="profile" />
                </div>
                <div className="follower-profile-info">
                  <h1 onClick={() => this.handleUser(follower.login)}>
                    {follower.login}
                  </h1>

                  <p onClick={() => this.handleUser(follower.login)}>
                    <span className="info-title click">View Profile</span>
                  </p>
                  <p>
                    <span className="info-title">Github Link:</span>{" "}
                    <a href={follower.html_url}>{follower.html_url}</a>
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

export default GithubProfile;
