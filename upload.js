function bytesToSize(bytes) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) {
        return '0 Byte';
    }
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}
const element = (tag, classes = [], content) => {
    const el = document.createElement(tag);
    if (classes.length) {
        el.classList.add(...classes)
    }
    if (content) {
        el.textContent = content;
    }
    return el
};
const isContains = (array, obj) => {
   return array.some(elem => {
        return obj.name === elem.name
    });
};
const noop = function () {};
export function upload(selector, options = {}) {
    let files = [];
    const input = document.querySelector(selector);
    const open = element('button', ['btn'], 'Открыть');
    const upload = element('button', ['btn', 'primary'], 'Загрузить');
    const preview = element('div', ['preview']);
    upload.style.display = 'none';
    if (options.multi) {
        input.setAttribute('multiple', true)
    }
    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }
    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', open);
    const triggerInput = () => {
        input.click()
    };
    const changeHandler = event => {
        if (!event.target.files.length) {
            return
        }
        const filesObj = event.target.files;
        const newFiles = Object.keys(filesObj).map(key => {
            return filesObj[key]
        });
        preview.innerHTML = '';
        if (!files.length) {
            files = newFiles;
        } else {
            newFiles.forEach(file => {
                if (!isContains(files, file)) {
                    files.push(file)
                }
            });
        }
        upload.style.display = 'inline';
        files.forEach(file => {
            if (!file.type.match('image')) {
                return
            }
            const reader = new FileReader();
            reader.onload = ev => {
                preview.insertAdjacentHTML('afterbegin', `
                        <div class="preview-image">
                            <div class="preview-remove" data-name="${file.name}">&times;</div>
                            <img alt="${file.name}" src="${ev.target.result}"/>
                            <div class="preview-info">
                                <span>${file.name}</span>
                                ${bytesToSize(file.size)}
                            </div>
                        </div>
                    `);
            };
            reader.readAsDataURL(file);
        })
    };
    const clearPreview = el => {
       el.style.bottom = '0px';
       el.innerHTML = `<div class="preview-info-progress"></div>`
    };
    const removeHandler = event => {
        if (!event.target.dataset.name) {
            return
        }
        const {name} = event.target.dataset;
        files = files.filter(file => file.name !== name);
        if (!files.length) {
            upload.style.display = 'none';
        }
        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image');
        block.classList.add('removing');
        setTimeout(() => block.remove(), 300)
    };
    const uploadHandler = () => {
        const onUpload = options.onUpload ?? noop;
        preview.querySelectorAll('.preview-remove').forEach(el => el.remove());
        const previewInfo = preview.querySelectorAll('.preview-info');
        previewInfo.forEach(clearPreview);
        onUpload(files, previewInfo)
    };
    const clickHandler = (e) => {
        input.value = ''
    };
    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    input.addEventListener('click', clickHandler);
    preview.addEventListener('click', removeHandler);
    upload.addEventListener('click', uploadHandler)
}