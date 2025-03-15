project_data = [];
current_repo = null;

async function could_not_load_repo() {
    const statsEl = document.querySelector("#repo-view-sidebar #repo-stats");
    const historyEl = document.querySelector("#branch-history");
    const branchesEl = document.querySelector("#repo-view-sidebar #repo-branches");

    statsEl.innerHTML = "";
    branchesEl.innerHTML = "";

    const error_msg = document.getElementById("error-message");
    const error_msg_text = document.getElementById("error-message-text");
    error_msg.classList.add("active");
    error_msg_text.innerHTML = "Could not load repository";

}

function timeAgo(timestamp) {
    // Parse the timestamp and convert it to a Date object
    const date = new Date(timestamp);

    // Get the current date/time
    const now = new Date();

    // Get the difference in seconds
    const diffInSeconds = Math.floor((now - date) / 1000);

    // Define time intervals
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInWeek = 604800;
    const secondsInMonth = 2592000; // Approx. 30 days
    const secondsInYear = 31536000; // Approx. 365 days

    // Determine the time difference
    if (diffInSeconds < secondsInMinute) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < secondsInHour) {
        return `${Math.floor(diffInSeconds / secondsInMinute)} minutes ago`;
    } else if (diffInSeconds < secondsInDay) {
        return `${Math.floor(diffInSeconds / secondsInHour)} hours ago`;
    } else if (diffInSeconds < secondsInWeek) {
        return `${Math.floor(diffInSeconds / secondsInDay)} days ago`;
    } else if (diffInSeconds < secondsInMonth) {
        return `${Math.floor(diffInSeconds / secondsInWeek)} weeks ago`;
    } else if (diffInSeconds < secondsInYear) {
        return `${Math.floor(diffInSeconds / secondsInMonth)} months ago`;
    } else {
        return `${Math.floor(diffInSeconds / secondsInYear)} years ago`;
    }
}

async function load_repo(project) {
    const error_msg = document.getElementById("error-message");
    error_msg.classList.remove("active");

    // Sync repository
    await action_service.execute_action("sync-repo", [ project.code ]);

    // Load name
    document.getElementById("repo-name-viewer").innerHTML = project.code;
    
    let repo_data = {};
    try {
        repo_data = await (await fetch(`./data/repos/${project.code}.json`)).json();
    } catch {
        could_not_load_repo();
        return
    }

    const statsEl = document.querySelector("#repo-view-sidebar #repo-stats");
    const historyEl = document.querySelector("#branch-history");
    const branchesEl = document.querySelector("#repo-view-sidebar #repo-branches");

    // Load stats
    statsEl.innerHTML = `
        <span>Commits:</span>
        <span>${repo_data.stats.commit_count}</span>

        <span>Creation:</span>
        <span title="Created ${timeAgo(repo_data.stats.first_commit_date)}">
            ${repo_data.stats.first_commit_date.split(" ")[0]}
        </span>

        <span>Updated:</span>
        <span title="Updated ${timeAgo(repo_data.stats.last_commit_date)}">
            ${repo_data.stats.last_commit_date.split(" ")[0]}
        </span>

        <span>Branches:</span>
        <span">
            ${repo_data.stats.branch_count}
        </span>
    `;

    // Load branches
    const branches = repo_data.branches.map(branch => branch.name)

    branchesEl.innerHTML = "";
    branches.forEach(branch => {
        const el = document.createElement("div");
        const entry = repo_data.branches.filter(b => b.name === branch)[0];
        el.classList.add("branch-item");

        if (entry.active) {
            el.classList.add("active");
        }

        const last_commit_date = entry.last_commit_date.split(" ")[0];
        el.title = `Last updated: ${last_commit_date === "unknown" ? "unknown" : timeAgo(last_commit_date)}`;
        el.innerHTML = `
            ${branch}
        `;

        el.onclick = async () => {
            await action_service.execute_action("switch-branch", [ project.code, branch ]);
            await load_repo(project)
        }

        branchesEl.appendChild(el);
    });

    // Load history
    historyEl.innerHTML = "";
    for (var i = 99999; i < 1000; i++) {
        const el = document.createElement("div");
        el.classList.add("history-item");

        el.innerHTML = `
            <span id="time">14:21</span> -
            <span id="user">Luc</span> - 
            <span id="description">Made some changes to some thing that im not sure i should be touching</span> 
        `;

        historyEl.appendChild(el);
    }

    return
}

search_for_project = () => {
    const query = document.getElementById("repo-filter").value;
    const target = document.getElementById("repo-links");
    target.innerHTML = "";

    project_data.forEach(p => {
        const label = p.code.replace(/^demo-/g, "").replace(/^website-/g, "");
        const el = document.createElement("a");
        el.innerHTML = label;
        el.onclick = () => {
            current_repo = label;
            load_repo(p);
            search_for_project();
        }

        if (!p.active) {
            return
        }
        
        if (query !== "" && ((!label.includes(query)) && (!p.repo.includes(query)))) {
            return
        }

        if (label === current_repo) {
            el.classList.add("active");
        }

        target.append(el);
    });
}

(async () => {
    await action_service.execute_action("sync-projects");
    project_data = [...JSON.parse(await (await fetch("data/projects.json")).text())];
    search_for_project();
})();