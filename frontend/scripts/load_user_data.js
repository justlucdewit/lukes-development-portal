(async () => {
    window.userdata = JSON.parse(await (await fetch("data/user.json")).text());
})();