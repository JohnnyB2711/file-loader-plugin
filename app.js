import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload'

const firebaseConfig = {
    apiKey: "AIzaSyDDTv5ZThSXv_pvQ42Qi3SrxSw9rNKmjqw",
    authDomain: "file-loader-34b47.firebaseapp.com",
    projectId: "file-loader-34b47",
    storageBucket: "file-loader-34b47.appspot.com",
    messagingSenderId: "122544333195",
    appId: "1:122544333195:web:ebbe0e42b142627c2e8f8e"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', 'jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`);
            const task = ref.put(file);
            task.on('state_changed', snapshot => {
                const percent = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)+ '%';
                const block = blocks[index].querySelector('.preview-info-progress');
                block.textContent = percent;
                block.style.width = percent;
            }, error => {
                console.log(error)
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log(url)
                })
            })
        })
    }
});