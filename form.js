"use strict";
const imgForm = document.querySelector("#imgForm");
imgForm.lang.placeholder = navigator.languages;
const getImg = () => {
    event.preventDefault();
    const i = imgForm;
    const lang = i.lang;
    const req = new Request(
        `https://corsproxy.io/?${
            new URLSearchParams({
                "url": `https://share.redd.it/preview/user/${
                    i.user.value
                }/achievement/${i.trophy.value}${
                    i.show.checked ? "?show-user-info=true" : ""
                }`,
                "key": 46009361,
                // cache busting
                "cb": Math.floor(Math.random()*1e6)
            })
        }`,
        {
            method: "GET",
            headers: {
                "Accept-Language": lang.value || lang.placeholder
            }
        }
    );
    let src;
    fetch(req)
    .then((res) => res.blob())
    .then((blob) => {
        src = URL.createObjectURL(blob);
        const earned = document.querySelector("#earned");
        earned.classList.remove("hidden");
        earned.addEventListener("load", URL.revokeObjectURL.bind(src), {
            once: true
        });
        earned.src = src;
    });
}
imgForm.addEventListener("submit", getImg);