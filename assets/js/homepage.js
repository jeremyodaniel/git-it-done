var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons")

 
var formSubmitHandler = function(event) {
  event.preventDefault();
// get value from input element
var username = nameInputEl.value.trim();

if (username) {
  getUserRepos (username);
  nameInputEl.value = "";
}  else {
  alert("Please enter a Github username");
}
  console.log(event);
};
 
var getUserRepos = function(user) {
//format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
//make a request to the url
fetch(apiUrl)
  .then(function(response) {
    // Request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data, user);
      });
    } else {
      alert("Error: Github User Not Found");
    }
  })
  .catch(function(error) {
    // Notice this '.catch()' getting chained onto the end of the '.then'() method
    alert("Unable to connect to Github");
  });
};

var displayRepos = function(repos,searchTerm) {
  console.log(repos);
  console.log(searchTerm);
// Check if api returned any repos
if (repos.length === 0) {
  repoContainerEl.textContent = "No repositories found.";
  return;
}
// Clear old content
repoContainerEl.textContent = "";
repoSearchTerm.textContent = searchTerm;
// Loop over the repos
for (var i = 0; i < repos.length; i++) {
  // Format repo name
  var repoName = repos[i].owner.login + "/" + repos[i].name;

  // create a container for each repo
  var repoEl = document.createElement("a");
  repoEl.classList = "list-item flex-row justify-space-between align-center";
  repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

  // Create a span element to hold repository name
  var titleEl = document.createElement("span");
  titleEl.textContent = repoName;

  // Append to container
  repoEl.appendChild(titleEl);

  // Create a status element
  var statusEl = document.createElement("span");
  statusEl.classList = "flex-row align-center";

  // Check if current repo has issues or not
  if (repos[i].open_issues_count > 0) {
    statusEl.innerHTML = 
      "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
  } else {
    statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
  }

  // Append to container
  repoEl.appendChild(statusEl);

  // Append container to the DOM
  repoContainerEl.appendChild(repoEl);
}
};

var getFeaturedRepos = function(language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data.items, language);
      });
    } else {
      alert('Error: GitHub User Not Found');
    }
  });
};

var buttonClickHandler = function(event) {
  var language = event.target.getAttribute("data-language");
  console.log(language);

  if (language) {
    getFeaturedRepos(language);
  
    // clear old content
    repoContainerEl.textContent = "";
  }
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);