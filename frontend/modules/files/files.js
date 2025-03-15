explorerContent = document.getElementById("explorer-content");
selected_index = 0;
cached_items = [];

async function refresh_items() {
    tab_path = get_current_path();
    cached_items = await (await fetch(`/files?path=${tab_path}`)).json();
}

async function populate_explorer() {
    explorerContent.innerHTML = cached_items.map((i, indx) => `
        <div class="explorer-item type-${i.type} ${indx === selected_index ? 'active' : ''}">
            <span id="name">
                <i class="material-icons">${i.type == "dir" ? "folder" : "description" }</i>
                ${i.name}
            </span>
            <span id="size">
                ${i.size ?? ""}
            </span>
        </div>
    `).join("");

    ensure_active_item_in_view()
}

function get_current_path() {
    const current_tab = document.querySelector(".section-tab.active #tab-name");
    return current_tab.innerHTML;
}

async function go_into_folder(folder) {
    const current_tab = document.querySelector(".section-tab.active #tab-name");
    current_tab.innerHTML += folder + "/"

    await refresh_items();
    await populate_explorer();
}

async function go_up() {
    const current_tab = document.querySelector(".section-tab.active #tab-name");
    const path_parts = current_tab.innerHTML.split("/").filter(x => x !== "");
    path_parts.pop();
    let new_path = ("/" + path_parts.join("/") + "/");

    if (new_path == "//")
        new_path = "/";

    current_tab.innerHTML = new_path;
    await refresh_items();
    await populate_explorer();
}

function handle_input(event) {
    const items = document.querySelectorAll('.explorer-item');

    if (event.key === "ArrowDown") {
        if (selected_index < items.length - 1) {
            selected_index++;
        }
    } else if (event.key === "ArrowUp") {
        if (selected_index > 0) {
            selected_index--;
        }
    } else if (event.key === "ArrowRight") {
        if (document.querySelector(".explorer-item.active i").innerHTML == "folder") {
            const active_item = document.querySelector(".explorer-item.active #name").innerHTML.replaceAll(/\<i.+i\>/g, "").trim();
            go_into_folder(active_item);
            selected_index = 0;
        }
    } else if (event.key === "ArrowRight") {
        if (document.querySelector(".explorer-item.active i").innerHTML == "folder") {
            const active_item = document.querySelector(".explorer-item.active #name").innerHTML.replaceAll(/\<i.+i\>/g, "").trim();
            go_into_folder(active_item);
            selected_index = 0;
        }
    } else if (event.key === "ArrowLeft") {
        go_up();
    }

    populate_explorer()
}

function ensure_active_item_in_view() {
    const activeElement = document.querySelector('.explorer-item.active');
    if (activeElement) {
        const container = explorerContent;

        // Get the position of the active element relative to the container
        const elementTop = activeElement.offsetTop - 140;
        const elementBottom = elementTop + activeElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        // Scroll up if the active element is above the container's visible area
        if (elementTop < containerTop) {
            container.scrollTop = elementTop;
        }

        else if (elementBottom + 20 > containerBottom) {
            container.scrollTop = elementBottom - container.clientHeight + 20;
        }
    }
}

if (!document._fileKeyListenerAdded == true) {
    document._fileKeyListenerAdded = true;
    document.addEventListener("keydown", handle_input);
}

(async () => {
    await refresh_items();
    await populate_explorer();
})();
