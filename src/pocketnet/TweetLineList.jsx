import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import './App.css'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ReplyIcon from '@material-ui/icons/Reply';
import IconButton from '@material-ui/core/IconButton';
import MessageIcon from '@material-ui/icons/Message';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import FaceIcon from '@material-ui/icons/Face';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import { useInView } from 'react-intersection-observer';

import PictureTweet from "./PictureTweet";
import { StoreContext } from '../App'
// import useStyles01 from '../style/halloween-night'
import useStyles01 from '../style/christmas'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    margin: 'auto'
  },
  balloon: {
    display: 'inline-block',
    padding: '6px 10px',
    overflowWrap: 'anywhere',
    textAlign: 'left',
    borderRadius: '5px',
  },
  actionButtonBox: {
    fontSize: "12px",
  },
  actionButton: {
    width: "12px",
    height: "12px",
  },
  actionButtonSkeleton: {
    width: "24px",
    height: "24px",
  },
  pictureBalloon: {
    fontFamily: 'cursive',
    height: "100px",
  },
  userInfo: {
    position: 'absolute',
    top: '-60px',
    width: '200px',
    height: '50px',
    overflow: 'hidden',
  },
  userInfoContent: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoAvatar: {
    width: '40px',
    height: '40px',
  },
  iconBox: {
    position: 'relative',
  },
  iconBoxSkeleton: {
    padding: '6px 10px',
  },
  iconBoxAvatar: {
    width: '40px',
    height: '40px',
  },
  tweetData: {
    marginTop: "auto",
    display: "grid",
    textAlign: "right",
  },
  tweetHistory: {
    padding: "5px 10px",
  },
  pictureModal: {
    display: "flex",
    width: "60%",
    margin: "auto",
  },
  tweetLineClose: {
    backgroundColor: "pink",
    width: "90%",
  },
  tweetLineBox: {
    display: "flex",
    alignItems: "flex-end",
    gap: "6px",
  },
}))


const UserInformation = (props) => {
  const classes = useStyles();
  const classes01 = useStyles01();

  return (
    <Paper
      className={classes.userInfo+' '+classes01.userInfo}
      elevation={3}
      style={{
        display: (props.visible)? 'block': 'none',
        [props.align]: '0px'
      }}
    >
      <Grid container >
        <Grid className={classes.userInfoContent} item xs={4} >
          <Avatar className={classes.userInfoAvatar} src={props.image} variant="square" />
        </Grid>
        <Grid item xs={8} >
          <Box>
            <Typography variant="body1">
              {props.user_name}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}


const TweetLine = (props) => {
    const {socket} = useContext(StoreContext)
    const classes = useStyles()
    const classes01 = useStyles01();
    const [actionbar, setActionbar] = useState(true);
    const [reply, setReply] = useState(true);
    const [modal, setModal] = useState(false);
    const { ref, inView } = useInView({
      // rootMargin: '-50px', // ref要素が現れてから50px過ぎたら
      triggerOnce: true, // 最初の一度だけ実行
    });
    const {account} = useContext(StoreContext)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if(props.count==0 && props.align=='left'){
        // 未読 かつ 他ユーザーのツイートの時
        if(inView==true) {
          // 画面に表示された時
          socket.emit('/socket/server', { rest:'/room/tweet/user/read', data:{ user_id:props.account.id, tweet_id:props.tweet_id } }, (response) => {
            console.log(response);
            var { status, rows } = response
            if(status==true){
              // ここでツイートの取得と更新を行いたい
              socket.emit('/socket/server/room', { rest:'/room/tweet/id/count/update', data:{ room_id:props.room.id, tweet_id:props.tweet_id } }, (response) => {
                console.log(response)
              })
            }
          });
        }
      }
    }, [inView])
  
    const formatToDay = (date) => {
      var day = new Date(date.replace(' ', 'T'))
      return [day.getFullYear(), alignDigit(day.getMonth()+1, 2), alignDigit(day.getDate(), 2)].join('/')
    }
  
    const formatToTime = (date) => {
      var time = new Date(date.replace(' ', 'T'))
      return [alignDigit(time.getHours(), 2), alignDigit(time.getMinutes(), 2)].join(':')
    }
  
    const alignDigit = (value, num) => {
      return ('0'.repeat(num)+value).slice(-num);
    }
  
    const closeActionbar = (set) => {
      set(true);
    }

    const replyToTweet = (tweet_id, user_name, text) => {
      props.setPrevTweet({
        id: tweet_id,
        user_name: user_name,
        text: text
      })
    }

    // ユーザーのアイコン
    const getUserIcon = (user_name, image, align) => {
      return (
        <Box flexDirection="row">
          {image? (
            <Box className={classes.iconBox} >
              <UserInformation
                visible = {visible}
                user_name = {user_name}
                image = {image}
                align = {align}
              />
              <Avatar
                className={classes.iconBoxAvatar}
                src={image}
                variant="circular"
                onMouseOver={() => setVisible(true)}
                onMouseOut={() => setVisible(false)} 
              />
            </Box>
          ) : (
            <Skeleton className={classes.iconBoxSkeleton} animation="wave" variant="circle" width={40} height={40} />
          )}
        </Box>
      );
    }

    // テキスト
    const getTextBalloon = (tweet_id, user_name, text, is_main_tweet, head, reply, prev_tweet) => {
      return (<Paper elevation={3} style={{display: 'inline-block',}}>
      <Box>
        <div
          ref={ref} align={"right"} 
          className={classes.balloon+' '+classes01.balloon}
          style={{ border: (prev_tweet && prev_tweet.id == tweet_id)? "2px yellow solid": "none", }}
        >
          <Typography variant="body1">
            {text ? text : <Skeleton animation="wave" width={120} />}
          </Typography>
          {(is_main_tweet) && (
            <>
              <Divider />
              <Box
                className={classes.actionButtonBox+' '+classes01.actionButtonBox}
                style={{ display: (reply)? "flex": "hidden", }}
                hidden={ true }
              >
                {(head.length>0) && (
                  <Box paddingRight="7px" >
                    <Tooltip title={ `×${head.length}` } aria-label="reply">
                      <IconButton className={classes.actionButton} onClick={() => {setReply(false);}} >
                        <MessageIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                <Box paddingRight="7px">
                  <Tooltip title="Reply" aria-label="reply">
                    {text ? (
                      <IconButton className={classes.actionButton} onClick={(e) => {replyToTweet(tweet_id, user_name, text)}} >
                        <ReplyIcon />
                      </IconButton>
                    ) : (
                      <Skeleton className={classes.actionButtonSkeleton} animation="wave" variant="circle" />
                    )}
                  </Tooltip>
                </Box>
              </Box>
            </>
          )}
        </div>
      </Box>
    </Paper>)
    }

    const getPictureBalloon = (picture) => {
      return (
        <Box onClick={(e) => {setModal(true);}} >
          <div className={classes.pictureBalloon}>
            <img src={picture} height="100px" />
          </div>
        </Box>
      );
    }
    
    return (
      <Box elevation={3} className={classes.paper}>
        <Box className={classes.tweetLineClose} hidden={actionbar} >
          <Button onClick={(e)=>{ closeActionbar(setActionbar);}} >
            Close
          </Button>
        </Box>
  
        <Box className={classes.tweetLineBox} spacing={1} style={{ justifyContent: (props.align==="right")? "flex-end": "flex-start", }} >
          {props.align==='right' && (
            <Box className={classes.tweetData+' '+classes01.tweetData}>
              <Typography variant="caption">{props.time ? formatToDay(props.time) : <Skeleton animation="wave" width={64} />}</Typography>
              <Typography variant="caption">{props.time ? formatToTime(props.time) : <Skeleton animation="wave" width={64} />}</Typography>
              {(props.is_main_tweet && props.count>0) && (
                // 既読数の表示
                <div>
                  <DoneOutlineIcon style={{ width: '14px', height: '14px' }} />
                  {props.count}
                </div>
              )}
            </Box>
          )}
          {props.align==='left' && 
            getUserIcon(props.user_name, props.image, props.align)
          }
          <Box
            textAlign={props.align}
            maxWidth={"55%"}
          >
            <div>
              {getTextBalloon(props.tweet_id, props.user_name, props.text, props.is_main_tweet, props.head, reply, props.prev_tweet)}
            </div>
            {props.picture && getPictureBalloon(props.picture)}
          </Box>
          {props.align==='right' &&
            getUserIcon(props.user_name, props.image, props.align)
          }
          {props.align==='left' && (
            <Box className={classes.tweetData+' '+classes01.tweetData} >
              {(props.is_main_tweet && props.count>0) && (
                // 既読チェックの表示
                <div>
                  <DoneOutlineIcon style={{ width: '14px', height: '14px' }} />
                </div>
              )}
              <Typography variant="caption">{props.time ? formatToDay(props.time) : <Skeleton animation="wave" width={64} />}</Typography>
              <Typography variant="caption">{props.time ? formatToTime(props.time) : <Skeleton animation="wave" width={64} />}</Typography>
            </Box>
          )}
        </Box>
        {(props.head.length>0 && props.is_main_tweet) && (
          <Paper
            className={classes.tweetHistory+' '+classes01.tweetHistory}
            elevation={2}
            hidden={reply}
            onClick={() => {setReply(true);}}
          >
            {(!reply) && props.head.map((val, index) => (
              <TweetLine
                key={index}
                room={props.room}
                // tweettext={props.tweettext}
                // setTweettext={props.setTweettext}
                user_name={val.user}
                user_id={val.user_id}
                image={val.user_icon}
                picture={val.picture}
                text={val.tweet}
                time={val.time}
                tweet_id={val.id}
                count={val.count}
                check={val.check}
                isMine={account.id===val.user_id}
                align={(account.id===val.user_id)? 'right': 'left'}
                head={val.head}
                is_main_tweet={false}
                account={account}
              />
            ))}
          </Paper>
        )}
        {props.picture && (
          <Modal
            open={modal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            onClose={()=>{ setModal(false); }}
          >
            <Paper className={classes.pictureModal} >
              <PictureTweet
                picture={props.picture}
                tweet={props.text}
              />
            </Paper>
          </Modal>
        )}
      </Box>
    )
}

const openMangaChat = (width, height, address, user_id, room_id) => {
  let string = `ip=${address.ip}&port=${address.port}&user_id=${user_id}&room_id=${room_id}&width=${width}&height=${height}`;
  window.myapi.openMangaChatWindow({query: string}).then(token => {
    console.log('open manga-chat window.');
  }).catch(error => {
    console.log('error:', error);
  })
}

const TweetLineList = (props) => {
  const {account} = useContext(StoreContext)

    return(
        <Box>
            {props.tweets.map((tweet, index) => (
              <TweetLine
                  key={index}
                  room={props.room}
                  // tweettext={props.tweettext}
                  // setTweettext={props.setTweettext}
      
                  user_name={tweet.user}
                  user_id={tweet.user_id}
                  image={tweet.user_icon}
                  picture={tweet.picture}
                  text={tweet.tweet}
                  time={tweet.time}
                  tweet_id={tweet.id}
                  head={tweet.head}
                  count={tweet.count}
                  check={tweet.check}
                  
                  isMine={account.id===tweet.user_id}
                  align={(account.id===tweet.user_id)? 'right': 'left'}
                  is_main_tweet={true}
                  prev_tweet={props.prev_tweet}
                  setPrevTweet={props.setPrevTweet}
                  account={account}
              />
            ))}
        </Box>
    );
}

const MangaChatButton = (props) => {
  const {account, address} = useContext(StoreContext)

  return(
    <Tooltip title="Manga-Chat Window" aria-label="manga-chat-window">
      <IconButton edge="end" aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => {openMangaChat(700, 530, address, account.id, props.room.id);}} >
        <FaceIcon />
      </IconButton>
    </Tooltip>
  );
}

export default TweetLineList;
export {MangaChatButton};