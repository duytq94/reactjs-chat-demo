import firebase from 'firebase'

const config = {
    apiKey: 'AIzaSyAC9ZSyvTxU2o5W0jcL0hDvzS4utLuicE8',
    authDomain: 'flutterchatdemo.firebaseapp.com',
    databaseURL: 'https://flutterchatdemo.firebaseio.com',
    projectId: 'flutterchatdemo',
    storageBucket: 'flutterchatdemo.appspot.com',
    messagingSenderId: '347976604232'
}
firebase.initializeApp(config)
firebase.firestore().settings({
    timestampsInSnapshots: true
})

export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()
