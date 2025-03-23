import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios';
// import { hot } from 'react-hot-loader/root'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { useSnackbar } from 'notistack'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import VpnLockIcon from '@material-ui//icons/VpnLock';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import SimpleBarReact from "simplebar-react";
import Typography from '@material-ui/core/Typography'
import AssignmentIcon from '@material-ui/icons/Assignment';

import SignOn from './account/SignOn'

import LogoImage from "../images/reconnection_logo.png";

import { StoreContext } from '../App'
// import useStyles01 from '../style/halloween-night'
import useStyles01 from '../style/christmas'

import { io } from 'socket.io-client'

const useStyles = makeStyles((theme) => ({
  inputs: {
    color: "white",
  },
  background: {
    height: 'calc(100vh - 25px - 25px)', // TopBar=25px, Bottom=25px
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    overflowY: 'auto',
  },
  inputArea: {
    textAlign: 'center',
  },
  serverList: {
    overflow: 'auto',
  },
  serverBoardModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serverBoardModalPaper: {
    width: '70%',
    height: '50%',
  },
}))

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const ServerListItem = (props) => {
  const classes = useStyles();
  const [online, setOnline] = useState(false);

  useEffect(() => {
    axios({ method: 'post', url: `${props.ip}:${props.port}/api`, data: { rest:'/test', timeout: 10000 } })
    .then(res => {
      console.log(res.data);
      setOnline(true)
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      console.log(props.user_id)
    })
  }, [props.ip, props.port])

  const setAndLogin = (ip, port, user_id, password) => {
    console.log('set and login:', ip, port, user_id, password)
    props.setIp(ip)
    props.setPort(port)
    props.setUserId(user_id)
    props.setPassword(password)
  }

  const removeServerInfo = (ip, port, user_id) => {
    console.log("remove server.");
    const data = {ip, port, userId: user_id};
    window.myapi.deleteServer(data).then(token => {
      if(token){
        window.myapi.getServer({}).then(all_token => {
          props.setServer(all_token)
        }).catch(er => {
          console.log('er:', er)
        })
      }
    }).catch(error => {
      console.log('error:', error)
    })
  }

  const showBoard = (text) => {
    props.setBoardText(text);
    props.setOpenBoard(true);
  }

  return (
    <ListItem button key={props.index}>
      <ListItemAvatar>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          variant={online? "dot": "none"}
        >
          <Avatar>
            <VpnLockIcon />
          </Avatar>
        </StyledBadge>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle1">{props.user_id}</Typography>
        }
        secondary={
          <Typography variant="body2">{props.ip}:{props.port}</Typography>
        }
        onClick={ (e) => {setAndLogin(props.ip, props.port, props.user_id, props.password);} }
        className={classes.inputs}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="board"
          onClick={(e)=>{showBoard(props.board);}}
        >
          <AssignmentIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e)=>{removeServerInfo(props.ip, props.port, props.user_id);}}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const Login = (props) => {
  const classes = useStyles();
  const classes01 = useStyles01();
  const [ip, setIp] = useState('')
  const [port, setPort] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [server, setServer] = useState([{ id: '' }])
  const history = useHistory()
  const [modal, setModal] = useState(false);
  const [openBoard, setOpenBoard] = useState(false);
  const [boardText, setBoardText] = useState('');
  const { enqueueSnackbar } = useSnackbar()
  const {setAccount, setSocket, setAddress} = useContext(StoreContext)

  useEffect(() => {
    window.myapi.getServer({}).then(all_token => {
      // all_token.map((token,index) => {
      //   try{
      //     const socket = io([token.ip, token.port].join(':'), { transports: ['websocket', 'polling', 'flashsocket'] })
      //     console.log(socket)
      //     console.log(socket.connected)
      //   }catch(error){
      //     console.log(error)
      //   }
      // })
      console.log('all token:', all_token);
      setServer(all_token)
    }).catch(er => {
      console.log('er:', er)
    })
  }, [])

  const checkServer = () => {
    const socket = io([ip, port].join(':'), { transports: ['websocket', 'polling', 'flashsocket'] })
    socket.emit('connect-to-server', { ip, port, userId, password, method: 'login' }, (response) => {
      setAccount(response)
      setAddress({ip, port})
      if (response) {
        setSocket(socket)
        socket.emit('/socket/server', { rest:'/first-login-room', data:{ id:response.id } }, (response) => { console.log(response) })
        history.push('/home')
      }
    })
  }

  const checkRegister = (data) => {
    const set =  { ip, port, userId, password, method: 'register' }
    const socket = io([ip, port].join(':'), { transports: ['websocket', 'polling', 'flashsocket'] })
    socket.emit('connect-to-server', set, (response) => {
      window.myapi.getServer(response).then(token => {
        if(token.length === 0){
          window.myapi.addServer(response).then(add_token => {
            if(add_token){
              enqueueSnackbar('新しい接続先を登録しました。', {})
              window.myapi.getServer({}).then(all_token => {
                setServer(all_token)
              }).catch(er => {
                console.log('er:', er)
              })
            }else{
              enqueueSnackbar('新しい接続先の登録に失敗しました。', {})
            }
          }).catch(err => {
            console.log('err:', err)
          })
        }
      }).catch(error => {
        console.log('error:', error)
      })
    })
  }

  return (
    <div className={[classes.background, classes01.background].join(' ')}>
      <Box>
        <Grid container spacing={0} alignItems="center" justifyContent="center">
          <Grid item xs={6} md={5}>
            <img src={LogoImage} width="100%" />
            <Paper className={[classes.inputArea, classes01.inputArea].join(' ')}>
              <TextField
                label="IP アドレス"
                value={ ip }
                onChange={ (e) => setIp(e.target.value) }
                InputProps={{
                  className: classes.inputs
                }}
                InputLabelProps={{
                  className: classes.inputs
                }}
              />
              <TextField
                label="PORT番号"
                value={ port }
                onChange={ (e) => setPort(e.target.value) }
                InputProps={{
                  className: classes.inputs
                }}
                InputLabelProps={{
                  className: classes.inputs
                }}
              />
              <TextField
                label="ユーザーID"
                value={ userId }
                onChange={ (e) => setUserId(e.target.value) }
                InputProps={{
                  className: classes.inputs
                }}
                InputLabelProps={{
                  className: classes.inputs
                }}
              />
              <TextField
                label="パスワード"
                type="password"
                autoComplete="current-password"
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
                InputProps={{
                  className: classes.inputs
                }}
                InputLabelProps={{
                  className: classes.inputs
                }}
              />
              <div>
                <Button variant="contained" onClick={ checkServer }>Sign-In</Button>
                <Button variant="contained" onClick={ checkRegister.bind(this, { ip, port, userId, password }) }>Register</Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={0} alignItems="center" justifyContent="center">
          <Grid item xs={6} md={5}>
            <List className={[classes.serverList, classes01.serverList].join(' ')}>
              <SimpleBarReact
                forceVisible="y"
                autoHide={true}
                style={{ 
                  maxHeight: 320,
                }}
                // ref={ref}
              >
                {server.map((val, index) => (
                  <ServerListItem
                    key={index}
                    index={index}
                    ip={val.ip}
                    port={val.port}
                    user_id={val.userId}
                    password={val.password}
                    board={val.board}
                    // removeServerInfo={removeServerInfo}
                    setIp={setIp}
                    setPort={setPort}
                    setUserId={setUserId}
                    setPassword={setPassword}
                    setOpenBoard={setOpenBoard}
                    setBoardText={setBoardText}
                  />
                ))}
              </SimpleBarReact>
            </List>
            <Button variant="contained" color="primary" onClick={(e) => {setModal(true);}}>
              Sign-On
            </Button>
            <div style={{ textAlign:'center' }}>Version 0.1.6</div>
          </Grid>
        </Grid>
      </Box>
      <Modal
        open={modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onClose={() => {setModal(false)}}//Not working.
      >
        <SignOn
            url=''
            title={"Welcome to *name in Disconnected!"}
            user={{id: "", name: "", mail: "", authority: false}}
            icon={{data: null, path: ''}}
            creatable={true}
            editable={false}
            myself={true}
            setModal={setModal}
          />
      </Modal>
      <Modal
        className={[classes.serverBoardModal, classes01.serverBoardModal].join(' ')}
        open={openBoard}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onClose={() => {setOpenBoard(false)} }
      >
        <Paper className={[classes.serverBoardModalPaper, classes01.serverBoardModalPaper].join(' ')}>
          <div dangerouslySetInnerHTML={{__html: boardText}} />
        </Paper>
      </Modal>
    </div>
  )
}

// export default hot(Login)
export default Login
export {ServerListItem}