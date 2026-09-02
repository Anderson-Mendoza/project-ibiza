export default function hamburgerMenu(panelBtn, panel, menuLink) {
    const d = document;
    const panelElement = d.querySelector(panel);
    const panelButton = d.querySelector(panelBtn);

    d.addEventListener("click", (e) => {
        const target = e.target;

        if (target.matches(panelBtn) || target.matches(`${panelBtn} *`)) {
            panelElement.classList.toggle("is-active");
            panelButton.classList.toggle("is-active");
        }

        if (target.matches(menuLink)) {
            panelElement.classList.remove("is-active");
            panelButton.classList.remove("is-active");
        }
    });
}