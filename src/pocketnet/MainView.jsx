import React, { useEffect, useState, useContext, memo } from 'react'
// import { hot } from 'react-hot-loader/root'
import { useHistory } from 'react-router-dom';
import './App.css'
import clsx from 'clsx'
// import { makeStyles, useTheme } from '@material-ui/core/styles'
import { createTheme, makeStyles, withStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Avatar from '@material-ui/core/Avatar'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import PublicIcon from '@material-ui/icons/Public'
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Badge from '@material-ui/core/Badge';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from '@material-ui/lab/Skeleton';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import SignalCellular4BarIcon from '@material-ui/icons/SignalCellular4Bar';
import SignalCellularOffIcon from '@material-ui/icons/SignalCellularOff';
import { useSnackbar } from 'notistack';

import { RoomSetModal } from './RoomSet';
import { SettingsModal } from './room/Settings';
import SimpleBarReact from "simplebar-react";
import "simplebar/src/simplebar.css";
import { MemberListModal, FriendListModal } from './MemberList';
import { SignOnModal } from './account/SignOn';
import { PictureListModal } from './PictureList'
import RoomLineList from './RoomLineList';

import { StoreContext } from '../App';
import TalkroomView from './TalkroomView';
import Timeline from './Timeline';
// import useStyles01 from '../style/halloween-night';
import useStyles01 from '../style/christmas';
import RestAPIView, { RestAPIDetailView } from './RestAPIView';

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  topBarSpace: {
    marginTop: '25px',
  },
  bottomBarSpace: {
    height: 'calc(100% - 25px - 25px)', // TopBar=25px, BottomBar=25px
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    marginTop: '64px', // NavigationBarが64px
    // padding: theme.spacing(3)
  },
  imageList: {
    width: '100%',
    height: 200,
  },
}))


const theme = createTheme({
  palette: {
    primary: blue
  }
})

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const TimelineViewItem = memo(({}) => {
  return (<Timeline />)
})

const RoomViewItem = memo(({roomId, prev_tweet, setPrevTweet, setOpenPictureList}) => {
  const { allRoom, allTweet } = useContext(StoreContext);

  return (<TalkroomView
    room={allRoom[roomId]}
    roomid={roomId}
    tweets={allTweet[roomId]}
    prev_tweet={prev_tweet}
    setPrevTweet={setPrevTweet}
    setOpenPictureList={setOpenPictureList}
  />)
})

const MainView = (props) => {
  const classes = useStyles()
  const classes01 = useStyles01();
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [tweettext, setTweettext] = useState('')
  const [roomid, setRoomid] = useState(null);
  const [notification, setNotification] = useState({0:0})
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openMemberList, setOpenMemberList] = useState(false);
  const [openFriendList, setOpenFriendList] = useState(false);
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  // const [room, setRoom]=useState({id: 1, name: null, open_level: 3, post_level: 3, picture: "", picture_path: ""})
  const [prev_tweet, setPrevTweet] = useState({ id: null, user_name: null, text: null });
  const [openPictureList, setOpenPictureList] = useState(false);
  const [roomAuthority, setRoomAuthority] = useState(false);
  const [roomPosting, setRoomPosting] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [pageTitle, setPageTitle] = useState(null);
  const [pagePictures, setPagePictures] = useState([]);
  const [mainViewId, setMainViewId] = useState('/view/timeline')
  const [pageProps, setPageProps] = useState({})
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { setInitialize, account, socket, allRoom, setAllRoom, allRoomMember, setAllRoomMember, allTweet, setAllTweet, allAlbum, setAllAlbum, timeline, setTimeline } = useContext(StoreContext);

  useEffect(() => {
    if(socket == null) {
      console.warn('強制終了です。')
      setInitialize();
      history.push('/');
    }

    socket.on('/socket/client', (response) => {
      console.log('/socket/client')
      console.log(response)
      switch(response.rest) {
        case '/test': // 動作テスト
          console.log('受信テスト')
          break
        case '/tweet/update': // update-tweet-information
          console.log('/tweet/update');
          var data = response.rows; // {id,room_id,count}
          setAllTweet(x => {
            let row = x[data.room_id];
            row = row.map(v => { return { ...v, count:(v.id===data.id)? data.count: v.count, }; });
            return { ...x, [data.room_id]: row };
          })
          break
        case '/room/add':
        case '/room/update':
          console.log(response.rest)
          var { data } = response
          setAllRoom(allRoomPrev => {
            let ob = Object.assign({}, allRoomPrev);
            return { ...ob, [data.room_id]:data.single_room[0]  }
          })
          setAllTweetViaSocket(account.id, data.room_id)
          setAllAlbumViaSocket(data.room_id)
          setAllRoomMemberViaSocket(data.room_id)
          break
        case '/room/remove':
          console.log('/room/remove')
          var { data } = response
          openScreenView('/view/timeline', 'Timeline', [])
          removeRoom(String(data.room_id))
          break
        case '/room/member/update':
          console.log('/room/member/add')
          var { data } = response
          setAllRoomMemberViaSocket(data.room_id)
          break
        default:
          console.warn('登録されていないrestです')
      }

      var {request, status } = response
      switch(request.rest) {
        case '/room/tweet/id/count/update':
          var { rows } = response
          setAllTweet(allTweetPrev => {
            let ob = Object.assign({}, allTweetPrev);
            rows.map((row) => {
              ob[row.room_id] = ob[row.room_id].map(x => { return (x.id==row.id)? {...x, 'count':row.count} : x })
            })
            return ob
          })
          break
        default:
          console.warn('登録されていないrestです')
      }
    })

    socket.on('receive-notification', (data) => {
      console.log('receive-notification')
      setAllTweet(prevEntireTweet =>{
        let ob = Object.assign({}, prevEntireTweet);
        (data.room_id in ob)? (ob[data.room_id].unshift(data)): (ob[data.room_id] = [data]);
        ob[data.room_id][0].head = getHeadTweetList(ob[data.room_id][0].head, ob[data.room_id]);
        return ob;
      });
      var isCurrentRoom = null;
      setRoomid(prevState =>{
        isCurrentRoom = prevState;
        return prevState;
      })
      let approveMessage = false;
      setAllTweet(prevEntireTweet =>{
        for(const key of Object.keys(prevEntireTweet)){
          if(Number(key) === data.room_id){
            approveMessage = true;
            break;
          }
        }
        return prevEntireTweet;
      });
      if(approveMessage){
        console.log(data.user_id, account.id, isCurrentRoom, data.room_id);
        (data.picture) && setAllAlbum(prevAlbums => {
          let albs = Object.assign({}, prevAlbums);
          (data.room_id in albs)? (albs[data.room_id].unshift(data)): (albs[data.room_id] = [data]); 
          return albs;
        })
        // 取得したツイートが自身のものではない かつ 今見ている部屋宛ではない
        if(data.user_id != account.id && isCurrentRoom != data.room_id){
          setNotification(prevState =>{ return  {...prevState, [data.room_id]: prevState[data.room_id]+1 }; });
          new Notification(data.user, {
            body:data.tweet,
            icon: data.user_icon,
            tag:'タグ',
          })
        }
      }else{
        // 部屋の初めての呟きもここに入ってしまう。
        console.warn('知りえないデータを受け取りました。');
      }
    })

    // ログイン成功時に必要となるデータ一式を取得
    socket.emit('/socket/server', { rest: '/user/room', data: { user_id: account.id } }, (rooms) => {
      console.log('/socket/server')
      console.log(rooms)

      var ob = {}
      for(const room of rooms.rows){
        ob[room.id] = 0;
      }
      setNotification(ob)

      socket.emit('/socket/server', { rest: '/tweet/public', data: { user_id:account.id } }, (tweets) => {
        console.log('/tweet/public')
        const tweetsModify = tweets.rows.map((tweet, index) => {
          tweet.head = getHeadTweetList(tweet.head, tweets.rows)
          return tweet
        })
        setTimeline(tweetsModify)
      })

      rooms.rows.map((roomItem, index) => {
        setAllRoom(allRoomPrev => {
          let ob = Object.assign({}, allRoomPrev);
          return { ...ob, [roomItem.id]: roomItem  }
        })

        setAllTweetViaSocket(account.id, roomItem.id)
        setAllAlbumViaSocket(roomItem.id)
        setAllRoomMemberViaSocket(roomItem.id)
      })

      
    })

    // socket.emit('get-entire-login-set', { user_id: account.id }, (sets) => {
    //   // ここで全ての初期データを取得する！これを個別に変更させたい！
    //   let tmp_entire_tweet = { ...sets.et_tweet }
    //   let tmp_pictweet = { ...sets.et_pictweet };
    //   for(let key of Object.keys(tmp_entire_tweet)){
    //     for(var i=0; i<tmp_entire_tweet[key].length; i++){
    //       tmp_entire_tweet[key][i].head = getHeadTweetList(tmp_entire_tweet[key][i].head, tmp_entire_tweet[key]);
    //     }
    //   }
    //   console.log(sets.entire_room)
    //   for(const key of Object.keys(sets.entire_room)){
    //     (key in tmp_entire_tweet === false) && (tmp_entire_tweet[key] = []);
    //     (key in sets.et_pictweet === false) && (tmp_pictweet[key] = []);
    //   }
    //   setAllTweet(tmp_entire_tweet);
    //   console.log(tmp_entire_tweet)
    //   setAllAlbum(tmp_pictweet);
    //   setAllRoom(sets.entire_room);
    //   // console.log(sets.entire_room)

    //   var ob = {}
    //   for(const r of sets.init_room){
    //     ob[r.id] = 0;
    //   }
    //   console.log('setNoticicationのob')
    //   console.log(ob)
    //   setNotification(ob)
    //   setAllRoomMember(sets.entire_user);

    //   // ここまで完了

    //   changeChatroom(sets.init_room[0].id, account.id);  
    //   socket.on('send-update-room', (data) => {
    //     console.log('新たな呟きを取得しました')
    //     var isCurrentRoom = null
    //     setRoomid(prevState =>{
    //       let ob = prevState
    //       if(prevState == data.room_id){
    //         isCurrentRoom = prevState
    //       }
    //       return ob
    //     })
    //     let approveMessage = false;
    //     for(const key of Object.keys(sets.entire_room)){
    //       if(Number(key) == data.room_id){
    //         approveMessage = true;
    //         break;
    //       }
    //     }
    //     if(approveMessage){
    //       setAllTweet(prevEntireTweet =>{
    //         let ob = Object.assign({}, prevEntireTweet);
    //         ob[data.room_id].unshift(data);
    //         ob[data.room_id][0].head = getHeadTweetList(ob[data.room_id][0].head, ob[data.room_id]);
    //         return ob;
    //       });
    //       if(isCurrentRoom){
    //         changeChatroom(isCurrentRoom, account.id);
    //       }else{
    //         setNotification(prevState =>{ return { ...prevState, [data.room_id]: prevState[data.room_id]+1 }; })
    //       }
    //       // enqueueSnackbar('新たな呟きを取得しました', {})
    //     }else{
    //       console.warn('知りえないデータを受け取りました。');
    //     }
    //   })

    //   socket.on('update-room-user', (data) => {
    //     console.log('update room member.', data);
    //     setAllRoomMember(preMember =>{ return { ...preMember, [data.room_id]: data.rows }; });
    //   });

    //   socket.on('receive-invitation-from-room', (data) => {
    //     console.log(data, account.id);
    //     socket.emit('get-invited-room', { room_id: data.room_id }, (response) => {
    //       updateEntireRoom(response[0], account.id)
    //     })
    //   });

    //   socket.on('get-expelled-from-room', (data) => {
    //     console.log('get expelled from.', data);
    //     const room_id = data.room_id;
    //     setAllTweet(tweets => {
    //       const { [room_id]: {}, ...rest } = tweets;
    //       return rest;
    //     });
    //     setAllAlbum(albums => {
    //       const { [room_id]: {}, ...rest } = albums;
    //       return rest;
    //     });
    //     setAllRoom(rooms => {
    //       const { [room_id]: {}, ...rest } = rooms;
    //       return rest;
    //     })
    //     setAllRoomMember(members => {
    //       const { [room_id]: {}, ...rest } = members;
    //       return rest;
    //     })
    //   })
    // })

    socket.on('disconnect', (response) => {
      setIsConnected(false);
      enqueueSnackbar("disconnect from the server.", {});
    })
  }, [])

  /**
   * 一部屋の呟き全てを取得。
   * @param {string} account_id ユーザーID。
   * @param {number} room_id 部屋ID。
   */
  const setAllTweetViaSocket = (account_id, room_id) => {
    socket.emit('/socket/server', { rest: '/room/tweet', data: { user_id:account_id, room_id:room_id } }, (tweets) => {
      const tweetsModify = tweets.rows.map((tweet, index) => {
        tweet.head = getHeadTweetList(tweet.head, tweets.rows)
        return tweet
      })
      console.log(tweetsModify)
      setAllTweet(allTweetPrev => {
        let ob = Object.assign({}, allTweetPrev);
        return { ...ob, [room_id]: tweetsModify }
      })
    })
  }

  /**
   * 一部屋に属するユーザー全てを取得。
   * @param {number} room_id 部屋ID。
   */
  const setAllRoomMemberViaSocket = (room_id) => {
    socket.emit('/socket/server', { rest: '/room/user', data: { room_id:room_id } }, (users) => {
      console.log(users)
      setAllRoomMember(allRoomMemberPrev => {
        let ob = Object.assign({}, allRoomMemberPrev);
        return { ...ob, [room_id]: users.rows }
      })
    })
  }

  /**
   * 一部屋で投稿された画像全てを取得。
   * @param {number} room_id 部屋ID。 
   */
  const setAllAlbumViaSocket = (room_id) => {
    socket.emit('/socket/server', { rest: '/room/tweet/picture', data: { room_id:room_id } }, (tweets) => {
      console.log(tweets)
      setAllAlbum(allAlbumPrev => {
        let ob = Object.assign({}, allAlbumPrev);
        return { ...ob, [room_id]: tweets.rows }
      })
    })
  }

  const removeRoom = (room_id) => {
    setRoomid(null)
    setAllRoom(allRoomPrev => {
      let ob = Object.assign({}, allRoomPrev);
      delete ob[room_id]
      return ob
    })
    setAllTweet(allTweetPrev => {
      let ob = Object.assign({}, allTweetPrev);
      delete ob[room_id]
      return ob
    })
    setAllRoomMember(allRoomMemberPrev => {
      let ob = Object.assign({}, allRoomMemberPrev);
      delete ob[room_id]
      return ob
    })
    setAllAlbum(allAlbumPrev => {
      let ob = Object.assign({}, allAlbumPrev);
      delete ob[room_id]
      return ob
    })
  }

  /**
   * メイン画面のページ遷移を実行。
   * @param {string} page 
   * @param {string} title 
   * @param {any[]} pictures 
   */
  const openScreenView = (page, title, pictures) => {
    setMainViewId(page)
    setPageTitle(title)
    setPagePictures(pictures)
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const logout = () => {
    console.log('ログアウトします。');
    socket.emit('log-out', {}, (response) => {
      console.log(response);
    })
    setInitialize()
    history.push('/');
  }

  const changeChatroom =(id, user_id) => {
    /*var data = { room: room_id, text: tweet_text };

    // Updating the word in the Textarea before changing the room or the channel.
    window.myapi.getTextarea({room: room_id}).then(token => {
      if(0===token.length){
        window.myapi.addTextarea(data).then(add_token => {
          console.log('add token:', add_token)
        })
      }
    })

    window.myapi.updateTextarea({room: room_id}, data).then(update_token => {
      console.log('update token:' , true)
    }).catch(error => {
      console.log('error:', error)
    })

    // Receiving the latest words from NeDB
    window.myapi.getTextarea({room: id}).then(token => {
      setTweettext((token.length === 0)? '': token[0].text);
    }).catch(er => {
      console.log('er:', er)
    })*/
    console.log(id)
    console.log(user_id)
    console.log(allRoomMember)
    setRoomid(id)
    setRoomAuthority( allRoomMember[id].filter(member => member.user_id === user_id)[0].authority );
    setRoomPosting( allRoomMember[id].filter(member => member.user_id === user_id)[0].posting );
    setNotification(prevState =>{ return { ...prevState, [id]: 0 }; })
    setPrevTweet({ id: null, user_name: "", text: "" });
    setMainViewId('/view/room')
  }

  /**
   * allRoomMemberにnullが入った時のデータ再取得。（再帰的に行われそう？）
   * ※最初のデータ取得時にnull値の処理を行わせるのが理想。
   */
  useEffect(() => {
    console.log('allRoomMemberが更新されました')
    Object.keys(allRoomMember).forEach((key, index) => {
      if(allRoomMember[key] == null) {
        console.warn('値がnullでした！', key)
        socket.emit('/socket/server', { rest: '/room/user', data: { room_id:key } }, (users) => {
          console.log(users)
          setAllRoomMember(allRoomMemberPrev => {
            let ob = Object.assign({}, allRoomMemberPrev);
            return { ...ob, [key]: users.rows }
          })
        })
      }
    })
  }, [allRoomMember])

  useEffect(() => {
    if(roomid in allRoom) {
      setPageTitle(allRoom[roomid].name)
      setPagePictures(allRoomMember[roomid].map((room) => room.picture))
    }
  }, [roomid])

  const getHeadTweetList = (head_id, tweets) => {
    for(const val of tweets){
      if(val.id === head_id){
        if(Array.isArray(val.head)){
          let tmp_head = val.head.concat();
          tmp_head.unshift(val);
          return tmp_head;
        }else{
          return [val].concat(getHeadTweetList(val.head, tweets));
        }
      }
    }
    return [];
  }

  // 新規ルームを作成した後
  const updateEntireRoom = (data, user_id) => {
    console.log('update entire-room.', data, user_id);
    setAllRoom(prevRoom => { return {...prevRoom, [data.id]: [data]}; });
    socket.emit('get-single-room', { room_id: data.id, user_id}, (response) => {
      console.warn(response)
      setAllRoomMember(prevMembs => { return {...prevMembs, [data.id]: response.single_roommember}; });
      setAllTweet(prevTweet => { 
        let ptweets = {...prevTweet, [data.id]: response.single_tweet};
        for(var i=0; i<ptweets[data.id].length; i++){
          ptweets[data.id][i].head = getHeadTweetList(ptweets[data.id][i].head, ptweets[data.id]);
        }
        return ptweets;
      })
      setAllAlbum(prevAlbs => { return {...prevAlbs, [data.id]: response.single_pictweet}; })
      socket.emit('enter-new-room', { room_id: data.id }, (response) => {
        console.log(response);
      });
    });
  }

  /**
   * メイン画面に描画するViewを操作。
   * @param {string} page メイン画面エリアに描画する仮ページドメイン名。 
   * @param {object} object ページに与えるプロパティを含むオブジェクト型データ。
   * @param {int} room_id チャット画面を描画する時のチャットルームID。
   * @returns 画面に描画するView。
   */
  const changeScreenView = (page, object, room_id) => {
    switch(page){
      case '/view/room':
        if((room_id in allTweet && room_id in allRoomMember)) {
          return <RoomViewItem
            roomId={room_id} 
            prev_tweet={prev_tweet}
            setPrevTweet={setPrevTweet}
            setOpenPictureList={setOpenPictureList}
          />
        }
      case '/view/api':
        return <RestAPIView
          setPageProps={setPageProps}
          openScreenView={openScreenView}
        />
      case '/view/api/detail':
        return <RestAPIDetailView 
          webhook={object}
          setPageProps={setPageProps}
          openScreenView={openScreenView}
        />
      case '/view/timeline':
        return <TimelineViewItem />
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        color="default"
        position="fixed"
        className={clsx(classes.appBar, classes.topBarSpace, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar className={classes01.topBar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" noWrap>
            {pageTitle ? pageTitle : <Skeleton animation="wave" width={120} height={32} />}
          </Typography>
          {(setPagePictures) ? (
            <AvatarGroup max={4}>
              {pagePictures.map((obj, index) => (
                <Avatar key={index} src={ obj } />
              ))}
            </AvatarGroup>
          ) : (
            <Skeleton animation="wave" variant="circle" width={40} height={40} />
          )}
          {(roomAuthority && mainViewId=='/view/room') && (
            <Tooltip title="Room Settings" aria-label="room-setting">
              <IconButton
                style={{height: "40px", width: "40px"}}
                onClick={()=>{console.log('ここで表示させるはずです'); setOpenEditRoom(true);}}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}
          <div style={{ flexGrow: 1 }}></div>
          <div>
            {(isConnected)? <SignalCellular4BarIcon />: <SignalCellularOffIcon />}
          </div>
          <div>
            <IconButton edge="end" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={
                  <>{(account.authority) && (
                      <SmallAvatar alt="Remy Sharp">
                        <SettingsIcon style={{ width: "16px", height: "16px" }} />
                      </SmallAvatar>
                  )}</>
                }
              >
                <Avatar src={ account.image } />
              </Badge>
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {setOpenProfile(true);}}>
                {account.name}
              </MenuItem>
              <MenuItem onClick={()=>{setOpenCreateRoom(true)}}>
                <HomeIcon />
                Create Room
              </MenuItem>
              {account.authority && (
                <MenuItem onClick={()=>{setOpenMemberList(true);}}>
                  <PeopleAltRoundedIcon />
                  Member List
                </MenuItem>
              )}
              <MenuItem onClick={()=>{setOpenFriendList(true);}}>
                <EmojiPeopleIcon />
                Friend list
              </MenuItem>
              <MenuItem onClick={()=>{logout();}}>
                <PublicIcon />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [ [classes.drawerOpen, classes01.drawerOpen].join(' ') ]: open,
          [ [classes.drawerClose, classes01.drawerClose].join(' ') ]: !open
        })}
        classes={{
          paper: clsx(classes.topBarSpace, {
            [ [classes.drawerOpen, classes01.drawerOpen].join(' ') ]: open,
            [ [classes.drawerClose, classes01.drawerClose].join(' ') ]: !open
          }, classes.bottomBarSpace)
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <RoomLineList
          changeChatroom={changeChatroom}
          room_id={roomid}
          tweet_text={tweettext}
          notification={notification}
          setMainViewId={setMainViewId}
          setPageTitle={setPageTitle}
          setPagePictures={setPagePictures}
          openScreenView={openScreenView} 
          authority={account.authority}
        />
      </Drawer>
      <main className={classes.content+' '+classes01.content} style={{ height:'calc(100vh - 114px)',/* TopBer=25px, NavigationBar=64px, BottomBar=25px */ overflowY:'hidden' }}>
        <SimpleBarReact
            forceVisible="y"
            autoHide={true}
            style={{ 
              maxHeight: "100%",
            }}
            // ref={ref}
        >
          {changeScreenView(mainViewId, pageProps, roomid)}
        </SimpleBarReact>
      </main>
      <RoomSetModal
        open={openCreateRoom}
        openModal={setOpenCreateRoom}
        updateEntireRoom={updateEntireRoom}
      />
      <MemberListModal
        open={openMemberList}
        openModal={setOpenMemberList}
      />
      {(allRoomMember && roomid in allRoomMember) && (
        <SettingsModal
          open={openEditRoom}
          openModal={setOpenEditRoom}
          room={allRoom[roomid]}
          roomMember={allRoomMember[roomid]}
        />
      )}
      <SignOnModal
        open={openProfile}
        openModal={setOpenProfile}
      />
      {(allAlbum && roomid in allAlbum) && (
        <PictureListModal
          open={openPictureList}
          openModal={setOpenPictureList}
          albums={allAlbum[roomid]}
        />
      )}
      {account && (
        <FriendListModal
          open={openFriendList}
          openModal={openFriendList}
          setOpenModal={setOpenFriendList}
        />
      )}
    </div>
  )
}

export default MainView
