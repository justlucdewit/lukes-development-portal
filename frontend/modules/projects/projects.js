window.actions = {};
project_data = [];

function download_file(filename, content) {
    // Create a Blob with the content
    const blob = new Blob([content], { type: "text/plain" });

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;

    // Append to the document, trigger click, and remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the URL to free memory
    URL.revokeObjectURL(a.href);
}

function download_overview() {
    const template = document.getElementById("overview-template").innerHTML;
    const template_el = document.createElement("div");
    template_el.innerHTML = template;

    const mount_point = template_el.querySelector("main");

    // Fill the template with the project entries
    mount_point.innerHTML = "";
    project_data.forEach((p) => {
        if (!p.active) {
            return
        }

        const label = p.code.replace(/^demo-/g, "").replace(/^website-/g, "");
        const el = document.createElement("section");
        const repo = `https://bitbucket.org/xingredient/${p.repo}`

        const site_links = Object.entries(p.sites).map(([key, value]) => `<a href="${value}">${key}</a> `).join("");
        const forge_links = Object.entries(p.forgeIds).map(([key, value]) => `<a href="https://forge.laravel.com/servers/${value.server}/sites/${value.site}/application">${key}</a> `).join("");

        el.innerHTML = `
            <h1>${label}</h1>
            <b>Forge servers:</b> ${forge_links}
            <b>Websites:</b> ${site_links}
            <b>Repository: </b> <a href="${repo}">${repo}</a>
        `;

        mount_point.appendChild(el);
    });

    download_file("project_overview.html", template_el.innerHTML);
}

search_for_project = () => {
    const query = document.getElementById("name-filter").value;

    const mount_point = document.querySelector("#projects");

    mount_point.innerHTML = "";

    let i = 0;
    project_data.forEach((p) => {
        const project_entry = document.createElement("section");
        const label = p.code.replace(/^demo-/g, "").replace(/^website-/g, "");

        if (!p.active) {
            return
        }

        if (query !== "" && ((!label.includes(query)) && (!p.repo.includes(query)))) {
            return
        }

        project_entry.innerHTML = `
            <h1>
                ${label}
            </h1>

            ${p.logo ? `<img src="${p.logo}" id="logo" />` : ""}

            <br />

            <b>Actions</b>
            <div id="button-list">
                ${render_button("open code", "code", `open-code-${p.code}`, () => {
                    action_service.execute_action("open-code", [p.dir]);
                })}
                ${render_button("open directory", "folder", `open-folder-${p.code}`, () => {
                    action_service.execute_action("open-project", [p.dir]);
                })}
                ${render_button("open repository", "flowchart", `open-repo-${p.code}`, () => {
                    const url = `${userdata.default_repo_prefix}${p.repo}`;
                    window.open(url, '_blank')
                })}
                ${render_button("start project", "play_arrow")}
            </div>

            <br />

            <div id="links">
                <div id="button-list">
                    <b>Environments</b>
                    ${p.sites ? Object.keys(p.sites).map(site => render_button(site, "language", `open-environment-${p.code}-${site}`, () => {
                        window.open(p.sites[site], '_blank');
                    })).join("") : "*no environments*"}
                </div>

                <div id="button-list">
                    <b>Forge</b>
                    ${p.forgeIds ? Object.keys(p.forgeIds).map(forgeSite => render_button(forgeSite, "host", `open-forge-${p.code}-${forgeSite}`, () => {
                        window.open(`https://forge.laravel.com/servers/${p.forgeIds[forgeSite].server}/sites/${p.forgeIds[forgeSite].site}`, '_blank');
                    })).join("") : "*no environments*"}
                </div>
            </div>
        `;

        mount_point.appendChild(project_entry);
        i+=1;
    });
}

render_button = (text, icon, action_id, action) => {
    window.actions[`action-${action_id}`] = action ?? (() => {});

    return `
        <div class="project-action" onclick="window.actions['action-${action_id}']()">
            ${icon ? `<i class="material-symbols-outlined">${icon}</i>` : "" }
            
            ${text}
        </div>
    `;
}

(async () => {
    await action_service.execute_action("sync-projects");
    project_data = JSON.parse(await (await fetch("data/projects.json")).text());
    search_for_project();
})()