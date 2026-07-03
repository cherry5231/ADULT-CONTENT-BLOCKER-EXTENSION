const params = new URLSearchParams(location.search);
const site = params.get("site");
document.getElementById("site-line").textContent = site ? `(${site})` : "";
