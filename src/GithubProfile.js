import axios from "axios";
import React from "react";

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
        {this.state.loading && <h1>Loading...</h1>}
        {this.state.error && <h1>"No user found!!"</h1>}
        {!this.state.loading && !this.state.error && (
          <div className="profile">
            <div className="profile-img">
              <img src={this.state.user.avatar_url} alt="profile" />
            </div>
            <h1>{this.state.user.name}</h1>
            <p onClick={this.fetchRepos}>
              Repos: {this.state.user.public_repos}
            </p>
            <p>Followers: {this.state.user.followers}</p>
            <p>Following: {this.state.user.following}</p>
          </div>
        )}

        <div className="repos">
          {this.state.repos.map((repo) => (
            <div className="repo" key={repo.id}>
              <h3>{repo.name}</h3>
              <p>Language: {repo.language}</p>
              <p>
                Repo on Github: <a href={repo.html_url}>{repo.html_url}</a>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default GithubProfile;
