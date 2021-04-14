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
     <div className="google-btn" onClick={signInWithGoogle}>
       <div class="google-icon-wrapper">
    <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
  </div>
  <p class="btn-text"><b>Sign in with google</b></p>
     </div> 
   )
}

function SignOut() {
  return auth.currentUser && (
    <div className="signout-btn" onClick={() => auth.signOut()}>
       <div class="google-icon-wrapper">
    <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
  </div>
  <p class="btn-text"><b>Sign Out</b></p>
     </div> 
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
    <SignOut />
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
    <div className={'chat'}><p>{text}</p>
</div>
    </div>
  
) 

}
export default App;
