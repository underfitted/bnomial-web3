function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get("level");

    document.getElementById(
        "badge-image"
    ).src = `https://gateway.pinata.cloud/ipfs/QmfFSMhxwq4JESi3179nK54ydhUbrpAxDwaDJMUHC253tg/${level}.png`;
}

window.addEventListener("load", init);
