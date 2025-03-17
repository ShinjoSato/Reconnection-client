import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useLocation } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import BackgroundImage from "./tgs111s.png";

const io = require('socket.io-client');

const animationStyle = {
  from: {transform: 'translateY(0px)', color: 'red'},
  to: [
    {transform: 'translateY(10px)', color: 'rgb(14,26,19)'},
    {transform: 'translateY(-10px)', color: 'rgb(14,26,19)'},
    {transform: 'translateY(0px)', color: 'rgb(14,26,19)'}
  ],
  config: {
    duration: 300,
    velocity: 5,
    loop: true
  }
}

// width : 660px 推奨！
const useStyles = makeStyles((theme) => ({
  leftTextBox: {
    fontSize: '20px',
    // textAlign: 'center',
    wordBreak: 'break-word',
    margin: '30px',
    padding: '8px',
    backgroundColor: 'white',
    clipPath: 'polygon(5% 0, 100% 0, 96% 100%, 0 87%)',
  },
  rightTextBox: {
    fontSize: '20px',
    // textAlign: 'center',
    wordBreak: 'break-word',
    margin: '30px',
    padding: '8px',
    backgroundColor: 'white',
    clipPath: 'polygon(0 0, 95% 0, 100% 95%, 3% 100%)',
  },
  leftTextBlackBox: {
    padding: '5px 25px', 
    backgroundColor: 'black', 
    color: 'white',
    minHeight: '62px',
    clipPath: 'polygon(6% 0, 100% 0, 95% 100%, 0 87%)',
  },
  rightTextBlackBox: {
    padding: '5px 20px', 
    backgroundColor: 'black', 
    color: 'white',
    minHeight: '62px',
    clipPath: 'polygon(0 0, 95% 6%, 100% 93%, 5% 100%)',
  },
  leftWhiteArrow: {
    backgroundColor: '#fff',
    position: 'absolute',
    width: '10%',
    height: '55px',
    bottom: '10px',
    left: '-2px',
    zIndex: 0,
    clipPath: 'polygon(30% 43%, 51% 60%, 100% 10%, 100% 61%, 53% 86%, 30% 70%, 0 100%)',
  },
  rightWhiteArrow: {
    backgroundColor: 'white',
    position: 'absolute',
    width: '13%',
    height: '55px',
    bottom: '10px',
    right: '-18px',
    zIndex: -1,
    clipPath: 'polygon(45% 54%, 61% 39%, 100% 100%, 65% 71%, 44% 92%, 0 68%, 0 11%)',
  },
  rightInnerArrow: {
    backgroundColor: 'black',
    position: 'absolute',
    width: '13%',
    height: '32px',
    bottom: '17px',
    right: '-12px',
    zIndex: 1,
    clipPath: 'polygon(45% 54%, 61% 39%, 100% 100%, 65% 71%, 44% 92%, 0 68%, 0 11%)',
  },
  leftInnerArrow: {
    backgroundColor: 'black',
    position: 'absolute',
    width: '10%',
    height: '32px',
    bottom: '17px',
    left: '1px',
    zIndex: 1,
    clipPath: 'polygon(30% 43%, 51% 60%, 100% 10%, 100% 61%, 53% 86%, 30% 70%, 0 100%)',
  }
}))

const UserInterface = (props) => {
  const classes = useStyles()
  const [animation, set] = useSpring(() => (animationStyle));
  const [text, setText] = useState("最新のテキストを表示");
  const [latestUser, setLatestUser] = useState({user_id: "", user_name: "", picture: null});
  const [users, setUsers] = useState([{user_id: "", user_name: "", picture: null}]);

  useEffect(() => {
    props.socket.emit("select-users-in-room", {room_id: props.room_id}, (response) => {
      setUsers(response.rows);

      props.socket.on('receive-notification', (data) => {
        console.log(data);
        updateText(props.room_id, data.room_id, data.user_id, data.tweet);
      });

      props.socket.on('send-update-room', (data) => {
        updateText(props.room_id, data.room_id, data.user_id, data.tweet);
      });
    });
  }, []);

  const updateText = (room, target_room, user, text) => {
    if(room == target_room){
      setText(text);
      setUsers(prevUsers => {
        setLatestUser(prevUsers.filter((x, index) => x.user_id==user)[0])
        return prevUsers;
      })

      set(startAnimation());
    }
  }

  const startAnimation = () => {
    return animationStyle;
  }

  return(
    <Box
      position={"relative"}
      height={"180px"}
      width={"100%"}
      style={{
        // backgroundColor: '#aae0d5',
        backgroundColor: 'transparent',
        // backgroundImage: `url(${ BackgroundImage })`,
        // backgroundSize: "cover",
      }}
    >
      <Box position={"absolute"} width={"100%"} height={"100%"} style={{ webkitAppRegion: "drag", }}>
        <Grid container style={{ height: '100%' }}>
          {(props.accountId!=latestUser.user_id)&&(
            <Grid item xs={(props.accountId==latestUser.user_id)? 0: 3} height={'100%'}>
              <Box padding={"20px"} textAlign={(props.accountId==latestUser.user_id)? "right" : "left"} /*hidden={(user.user_id == latestUser)? false: true}*/>
                <img src={latestUser.picture} width={'100%'} />
              </Box>
            </Grid>
          )}
          <Grid item xs={9}>
            <animated.div style={animation}>
              {(latestUser.user_id !=props.accountId)&&( // 自分以外
                <Box className={classes.leftWhiteArrow}></Box>
              )}
              {(latestUser.user_id !=props.accountId)&&( // 自分以外
                <Box className={classes.leftInnerArrow}></Box>
              )}
              <Box className={(latestUser.user_id ==props.accountId)? classes.rightTextBox: classes.leftTextBox}>
                <Box className={(latestUser.user_id ==props.accountId)? classes.rightTextBlackBox: classes.leftTextBlackBox}>
                  {text}
                </Box>
              </Box>
              {(latestUser.user_id==props.accountId)&&( // 自分のみ
                <Box className={classes.rightWhiteArrow}></Box>
              )}
              {(latestUser.user_id==props.accountId)&&( // 自分のみ
                <Box className={classes.rightInnerArrow}></Box>
              )}
            </animated.div>
          </Grid>
          {(props.accountId==latestUser.user_id)&&(
            <Grid item xs={(props.accountId==latestUser.user_id)? 3: 0}>
              <Box padding={"20px"} textAlign={(props.accountId==latestUser.user_id)? "right" : "left"} /*hidden={(user.user_id == latestUser)? false: true}*/>
                <img src={latestUser.picture} width={'100%'} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

const MangaChatWindow = (props) => {
  const query = new URLSearchParams(useLocation().search);
  const ip = query.get("ip");
  const port = query.get("port");
  const room_id = query.get("room_id");
  const user_id = query.get("user_id");
  const socket = io([ip, port].join(':'), { transports: ['websocket', 'polling', 'flashsocket'] });
  const [accountId, setAccountId] = useState(query.get("user_id"))

  socket.emit('/socket/server', { rest:'/first-login-room', data:{ id: user_id } }, (response) => {
    console.log(response);
  })

  return(
    <UserInterface
      socket={socket}
      room_id={room_id}
      accountId={accountId}
    />
  );
}

export default MangaChatWindow;