project_data = [];
current_repo = null;
current_branch = "master";

function load_repo(project) {
    // Sync repository
    action_service.execute_action("sync-repo", [ project.code ]);

    const historyEl = document.querySelector("#branch-history");
    const branchesEl = document.querySelector("#repo-view-sidebar #repo-branches");

    // Load name
    document.getElementById("repo-name-viewer").innerHTML = project.code;

    // Load stats

    // Load branches
    const branches = ["master", "development", "feature/test" ];
    branchesEl.innerHTML = "";
    branches.forEach(branch => {
        const el = document.createElement("div");
        el.classList.add("branch-item");

        if (branch === current_branch) {
            el.classList.add("active");
        }

        el.innerHTML = `
            ${branch}
        `;

        branchesEl.appendChild(el);
    });

    // Load history
    historyEl.innerHTML = "";
    for (var i = 0; i < 1000; i++) {
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