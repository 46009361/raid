"use strict";
const imgForm = document.querySelector("#imgForm");
// auto-populates from URL
imgForm.user.value = location.hash.slice(1).split(":~:")[0];
window.addEventListener("hashchange", function() {
    // .split(":~:")[0] prevents text fragments from being affected
    imgForm.user.value = location.hash.slice(1).split(":~:")[0];
})
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
        `https://46009361.page/preview/user/${
            i.user.value
        }/achievement/${i.trophy.value}${
            i.show.checked ? "?show-user-info=true" : ""
        }&cb=${Math.floor(Math.random()*1e6)}`,
        {
            method: "GET",
            headers: {
                "Accept-Language": lang.value
            }
        }
    );
    let src;
    const earned = document.querySelector("#earned");
    const btns = document.querySelector("#btns");
    earned.classList.add("hidden");
    btns.classList.add("hidden");
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
        globalThis.blob = blob;
        src = URL.createObjectURL(blob);
        earned.classList.remove("hidden");
        btns.classList.remove("hidden");
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
const dl = document.querySelector("#dl");
const download = () => {
    const i = imgForm;
    const blob = globalThis.blob;
    const src = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = src;
    a.download = `${i.trophy.value}.jpeg`;
    document.body.appendChild(a);
    // todo: add "your download should start soon, if not click here"
    a.click();
    a.remove();
    // occasional Safari quirk
    setTimeout(()=>{URL.revokeObjectURL(src)},1000);
}
dl.addEventListener("click", download);
const sh = document.querySelector("#sh");
const share = () => {
    const i = imgForm;
    const blob = globalThis.blob;
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
    } else {
        prompt("Sorry, the share button may not work in your browser. Learn more about compatible browsers:",
               "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#browser_compatibility");
    }
}
sh.addEventListener("click", share);
