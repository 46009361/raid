"use strict";
const imgForm = document.querySelector("#imgForm");
const lang = imgForm.lang;
const options = [...lang.options].map(option => option.value);
for (const language of navigator.languages) {
    if (options.includes(language)) {
        lang.value = language;
        break;
    }
    const langCode = language.match(/([a-z]{2,3})/)[1];
    if (options.includes(langCode)) {
        lang.value = langCode;
        break;
    }
}
const getImg = () => {
    event.preventDefault();
    const i = imgForm;
    const req = new Request(
        `https://proxy.corsfix.com/?${
            encodeURI(
                `https://share.redd.it/preview/user/${
                    i.user.value
                }/achievement/${i.trophy.value}${
                    i.show.checked ? "?show-user-info=true" : ""
                }`
            )
        }&cb=${Math.floor(Math.random()*1e6)}`,
        {
            method: "GET",
            headers: {
                "Accept-Language": lang.value,
                "x-corsfix-headers": JSON.stringify({
                    "User-Agent": "web:4600936.uno:v2.0 (by /u/46009361) contact {{EMAIL}}"
                })
            }
        }
    );
    let src;
    const earned = document.querySelector("#earned");
    earned.classList.add("hidden");
    fetch(req)
    .then((res) => {
        if (res.ok) {
            return res.blob();
        }
        throw new Error(
            "Either you're offline or this person doesn't exist or have that achievement."
        );
    })
    .then((blob) => {
        const file = new File([blob], `${i.trophy.value}.jpeg`, {type: 'image/jpeg'});
        const filesArray = [file];
        // I'm trying this, apparently the title can be ignored by the target?
        // source: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
            navigator.share({
                text: i.user.value,
                files: filesArray,
                title: i.trophy.label
            });
        }
        src = URL.createObjectURL(blob);
        earned.classList.remove("hidden");
        earned.addEventListener("load", URL.revokeObjectURL.bind(src), {
            once: true
        });
        earned.src = src;
    })
    .catch((err) => {
        alert(err.message);
    });
}
imgForm.addEventListener("submit", getImg);
