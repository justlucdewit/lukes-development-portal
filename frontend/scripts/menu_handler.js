// Handle menu navigation events
const handle_menu_navigation = async (module_to_load) => {
    console.info("Loading module: " + module_to_load);
    
    const html_url = `/modules/${module_to_load}/${module_to_load}.html`;
    const css_url = `/modules/${module_to_load}/${module_to_load}.css`;
    const js_url = `/modules/${module_to_load}/${module_to_load}.js`; // JavaScript URL for the module

    const main_section = document.getElementById("main-section");

    // Load and inject HTML from html_url
    const html_response = await fetch(html_url);
    const html_text = await html_response.text();
    main_section.innerHTML = html_text;

    // Remove any previously loaded module's CSS
    const allModuleStyles = document.querySelectorAll('[id^="module-css-"]');
    allModuleStyles.forEach(style => style.remove());

    // Inject the current module's CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = css_url;
    link.id = `module-css-${module_to_load}`;
    document.head.appendChild(link);

    // Dynamically load the JavaScript file for the current module
    const existingScript = document.getElementById(`module-js-${module_to_load}`);
    if (existingScript) {
        existingScript.remove(); // Remove existing script if it exists
    }

    const script = document.createElement('script');
    script.src = js_url;
    script.id = `module-js-${module_to_load}`; // Unique ID for the script tag

    document.body.appendChild(script); // Append the new JavaScript script to the body
}


let default_location = window.location.hash.replace("#", "");
default_location = default_location === "" ? "dashboard" : default_location

handle_menu_navigation(default_location);

const menu_list = [...document.getElementsByClassName("menu-item")]
menu_list.forEach(menu_item => {
    const module_item = menu_item.href.split("#").at(-1);
    
    menu_item.onclick = () => {
        menu_list.forEach(menu_item_ => {
            menu_item_.classList.remove("active")
        });
        menu_item.classList.add("active")
        
        handle_menu_navigation(module_item)
    }

    if (default_location === module_item)
        menu_item.onclick();
});