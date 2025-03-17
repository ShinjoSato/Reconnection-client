import './App.css';
import AppxPNet from './pocketnet/App.jsx'
import { createContext, useState } from 'react';

export const StoreContext = createContext();

function App() {
  // 自分のみを指すのはaccount, 任意の人物を指すのはuserに方針
  const [account, setAccount] = useState({ id: '', name: '', image: 0, mail: '', authority: false })
  const [socket, setSocket] = useState(null)
  const [address, setAddress] = useState({ip: null, port: null})
  // entireRoom → allRoom
  const [allRoom, setAllRoom] = useState({})
  // entireRoomMember → allRoomMember
  const [allRoomMember, setAllRoomMember] = useState({})
  // eintireTweet → allTweet
  const [allTweet, setAllTweet] = useState({})
  // entireAlbums → allAlbum
  const [allAlbum, setAllAlbum] = useState({})
  // timeline
  const [timeline, setTimeline] = useState([])

  const setInitialize = () => {
    setAccount({ id: 'none', name: 'none', image: 0 })
    setSocket(null)
    setAddress({ip: null, port: null})
    setAllRoom({})
    setAllRoomMember({})
    setAllTweet({})
    setAllAlbum({})
    setTimeline([])
  }

  return (
    <StoreContext.Provider
      value={{
        setInitialize, account, setAccount, socket, setSocket, address, setAddress, allRoom, setAllRoom, allRoomMember, setAllRoomMember, allTweet, setAllTweet, allAlbum, setAllAlbum, timeline, setTimeline,
      }}
    >
      <AppxPNet />
    </StoreContext.Provider>
  );
}

export default App;
