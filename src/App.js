import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import { useState } from 'react';

// initializes the firebase
firebase.initializeApp({
  apiKey: "AIzaSyCNHModHZdHH9jEuANxI1GzCjZ1GGt2-lk",
    authDomain: "chat-app-d7094.firebaseapp.com",
    projectId: "chat-app-d7094",
    storageBucket: "chat-app-d7094.appspot.com",
    messagingSenderId: "59855527866",
    appId: "1:59855527866:web:3d648f5b8abd6b62f34783",
    measurementId: "G-G04BFBK1CV"

})

const auth =firebase.auth();
const firestore = firebase.firestore();
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      {user ? <SignOut /> : ''}

      </header>
      <section>
      
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    console.log('clicked');
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
   return (
     <button className={'btn'} onClick={signInWithGoogle}>Sign in with google</button> 
   )
}

function SignOut() {
  return auth.currentUser && (
    <button className={'btn'} onClick={() => auth.signOut()}>signout</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, photoURL
    });

    setFormValue('');
  }
  return (
    <>
    <div className={'Messages'}>
{messages && messages.map(msg => <ChatMessage className={'submit'} key={msg.id} message={msg} />)}
    </div>

    <form className={'form'}onSubmit={sendMessage}>
      <input className={'input'} value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
<button  className={'submit'} type='submit'>send</button>

    </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

return (
  <div className={`message ${messageClass}`}>
    <img src={photoURL} alt='' />
    <p>{text}</p>

    </div>
  
) 

}
export default App;
