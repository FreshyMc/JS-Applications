export default function ce(type, attributes, ...childs) {
    let el = document.createElement(type);

    Object.entries(attributes || {}).map(([attr, val]) => {
        if (attr == 'text') {
            el.textContent = val;
        } else if (attr == 'inner') {
            el.innerHTML = val;
        } else if (attr.substring(0, 2) == 'on') {
            el.addEventListener(attr.substring(2).toLowerCase(), val);
        } else {
            el.setAttribute(attr, val);
        }
    });

    childs.forEach(c => el.appendChild(c));

    return el;
}