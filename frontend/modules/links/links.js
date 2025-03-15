function generate_link_list(list) {
    return list.map(link => `
        <a href="${link.url}" target="_blank">
            <i class="material-symbols-outlined">${link.icon}</i>
            ${link.title}
        </a>  
    `).join("");
}

(async () => {
    const mount_point = document.getElementById("links-wrapper");
    const links_categories = Object.keys(userdata.links);

    mount_point.innerHTML = "";

    links_categories.forEach((cat) => {
        const cat_element = document.createElement("section");
        cat_element.innerHTML = `
            <h1>${cat}</h1>

            <div id="link-list">
                ${generate_link_list(userdata.links[cat])}
            </div>
        `;

        mount_point.appendChild(cat_element);
    });
})();