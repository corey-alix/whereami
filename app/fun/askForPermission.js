export async function askForPermission(title) {
    return new Promise((good, bad) => {
        const button = document.createElement("button");
        button.className = "ol-control big";
        button.innerText = title;
        document.body.appendChild(button);
        button.onclick = () => {
            good(true);
            button.remove();
        };
    });
}
