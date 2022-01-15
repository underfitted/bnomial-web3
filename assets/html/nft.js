function init() {
    const urlParams = new URLSearchParams(window.location.search)
    const badges = urlParams.get("badges")

    document.getElementById("badges").innerHTML = badges
}

window.addEventListener("load", init)
