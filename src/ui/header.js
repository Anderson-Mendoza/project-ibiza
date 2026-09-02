const d = document;

export const bindHeaderBehavior = () => {
    const header = d.querySelector(".topbar");
    if (!header) return;

    let lastScrollY = window.scrollY;

    const revealHeader = () => {
        header.classList.remove("is-hidden");
    };

    window.addEventListener("scroll", () => {
        if (window.scrollY <= 20) {
            revealHeader();
        } else if (window.scrollY > lastScrollY) {
            header.classList.add("is-hidden");
        } else {
            revealHeader();
        }

        lastScrollY = window.scrollY;
    });

    window.addEventListener("mousemove", (event) => {
        if (event.clientY < 110) {
            revealHeader();
        }
    });

    header.addEventListener("mouseenter", revealHeader);
};
