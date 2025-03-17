import React, { useState, useEffect, useRef, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../App';

const useStyles = makeStyles((theme) => ({
  rootPaper: {
    minWidth: '70%',
    minHeight: '50%',
  }
}));

const RoomSet = (props) => {
  const {setInitialize, account, socket, setAllRoom} = useContext(StoreContext)

  const [roomName, setRoomName] = useState(props.room.name);
  const [userName, setUserName] = useState(account.name);
  const [openLevel, setOpenLevel] = useState(props.room.open_level);
  const [tweetLevel, setTweetLevel] = useState(props.room.post_level);
  const [textCount, setTextCount] = useState("300");
  const [storeTerm, setStoreTerm] = useState("0");
  const [tweetLevelList, setTweetLevelList]= useState([false, false, false]);
  const [icon, setIcon] = useState({data: props.room.picture, path: ""});
  const inputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    changeOpenLevel(openLevel);
    setTweetLevel(tweetLevel);
  }, [])

  const changeOpenLevel=(value)=>{
    setOpenLevel(Number(value));
    let tmp=[true,true,true];
    switch(Number(value)){
      case 3:tmp[0]=false;
      case 2:tmp[1]=false;
      case 1:tmp[2]=false;
    }
    setTweetLevel(Number(value));
    setTweetLevelList(tmp);
  }

  const inputImage=()=>{
    inputRef.current.click();
  }

  const setImage=(event)=>{
    if(event.target.files[0]){
      setIcon({data: URL.createObjectURL(event.target.files[0]), path: event.target.files[0].path});
    }else{
      setIcon({data: props.room.picture, path: ""});
    }
  }

  /**
   * 部屋を新規に作成する。
   * @param {*} event 
   */
  const createRoom=(picture)=>{
    console.log('create room.')
    if(roomName.length === 0){
      enqueueSnackbar("ルーム名を記入してください。",{});
      return;
    }
    var data = {
      userId: account.id,
      roomName,
      userName,
      open_level: openLevel,
      post_level: tweetLevel,
      textCount,
      storeTerm,
      picture
    }
    console.log(picture);
    if(picture.data && picture.path.length>0){
      //容量制限があるらしい！
      window.myapi.getPicData(picture.path).then(binary => {
        data["picture"] = binary;
        socket.emit('create-room', data, (response) => {
          props.updateEntireRoom(response.rows[0], account.id);
          enqueueSnackbar("画像付き新規ルームの設定。",{});
        });
      });
    }else{
      data.picture = null;
      console.log('画像なしで');
      socket.emit('create-room', data, (response) => {
        props.updateEntireRoom(response.rows[0], account.id);
        enqueueSnackbar("新規ルームの設定。",{});
      });
    }
  }

  /**
   * 既存の部屋を編集する。
   * @param {*} event 
   */
  const editRoom=(user_id, room_id, room_name, open_level, post_level, picture_data, picture_path)=>{
    console.log("edit room.");
    if(roomName.length === 0){
      enqueueSnackbar("ルーム名を記入してください。",{});
      return;
    }
    var data = { id: room_id, name: room_name, open_level: open_level, post_level: post_level, picture: picture_data, user_id: user_id };
    if(picture_data && picture_path.length>0){
      window.myapi.getPicData(picture_path).then(binary => {
        data.picture = binary;
        socket.emit('update-room', data, (response) => {
          console.log(response);
          enqueueSnackbar(response.message,{});
        });
      }).catch(error => {
        console.log(error)
      })
    }else{
      socket.emit('update-room', data, (response) => {
        console.log(response);
        enqueueSnackbar(response.message,{});
      });
    }
  }

  const deleteRoom=(event)=>{
    socket.emit('delete-room', {room_id: props.room.id}, (response) => {
      console.log(response);
      enqueueSnackbar('部屋の削除に成功しました。', {});
    });
  }

  return (
    <Paper className={classes.rootPaper} elevation={3}>
      <Box m={2}>
        <Typography variant="h4" component="h4">
          {props.title}
        </Typography>
        <form noValidate autoComplete="off">
          <Grid
            container
          >
            <Grid
              item
              xs={4}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <input
                hidden
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={setImage}
              />
              <IconButton style={{borderRadius:"unset"}} onClick={inputImage}>
                <Avatar
                  alt="user-image"
                  variant="rounded"
                  src={icon.data}
                  style={{
                    width: '150px',
                    height: '150px',
                  }}
                >
                  <HomeIcon 
                    style={{
                      width: '120px',
                      height: '120px',
                    }}
                  />
                </Avatar>
              </IconButton>
            </Grid>
            <Grid
              item
              xs={8}
              container
              direction="column"
              style={{
                display: 'flex',
                alignItems: 'left',
                justifyContent: 'space-between'
              }}
            >
              <TextField
                required
                id="room-name"
                label="部屋名"
                style={{
                  width: '80%',
                }}
                defaultValue={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <TextField
                id="user-name"
                label="編集ユーザー"
                defaultValue={userName}
                InputProps={{
                  readOnly: true,
                }}
                style={{
                  width: '80%',
                }}
                onChange={(e) => setUserName(e.target.value)}
              />
              <FormControl component="fieldset">
                <FormLabel component="legend">公開範囲</FormLabel>
                <RadioGroup row aria-label="showroom" name="showroom" value={openLevel} onChange={(e) => changeOpenLevel(e.target.value)}>
                  <FormControlLabel value={3} control={<Radio />} label="全員" />
                  <FormControlLabel value={2} control={<Radio />} label="ユーザー指定" />
                  <FormControlLabel value={1} control={<Radio />} label="自分のみ" />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel component="texting">投稿制限</FormLabel>
                <RadioGroup row aria-label="texting" name="showroom" value={tweetLevel} onChange={(e) => setTweetLevel(Number(e.target.value))}>
                  <FormControlLabel value={3} disabled={tweetLevelList[0]} control={<Radio />} label="全員" />
                  <FormControlLabel value={2} disabled={tweetLevelList[1]} control={<Radio />} label="ユーザー指定" />
                  <FormControlLabel value={1} disabled={tweetLevelList[2]} control={<Radio />} label="自分のみ" />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel component="texting">文字数制限</FormLabel>
                <RadioGroup row aria-label="texting" name="showroom" value={textCount} onChange={(e) => setTextCount(e.target.value)}>
                  <FormControlLabel value="100" control={<Radio />} label="100" />
                  <FormControlLabel value="300" control={<Radio />} label="300" />
                  <FormControlLabel value="500" control={<Radio />} label="500" />
                  <FormControlLabel value="0" control={<Radio />} label="Infinity" />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel component="texting">呟き保存期間</FormLabel>
                <RadioGroup row aria-label="texting" name="showroom" value={storeTerm} onChange={(e) => setStoreTerm(e.target.value)}>
                  <FormControlLabel value="1" control={<Radio />} label="一カ月" />
                  <FormControlLabel value="6" control={<Radio />} label="半年" />
                  <FormControlLabel value="12" control={<Radio />} label="一年" />
                  <FormControlLabel value="0" control={<Radio />} label="Infinity" />
                </RadioGroup>
              </FormControl>
            
            </Grid>
          </Grid>
        </form>
        <Box m={2}>
          <Button variant="contained" color="default" onClick={(e)=>{props.setOpenModal(false)}}>
            戻る
          </Button>
          {props.creatable && (
            <Button variant="contained" color="primary" onClick={(e)=>{createRoom(icon);}} >
              登録
            </Button>
          )}
          {props.editable && (
            <Box display="contents">
              <Button variant="contained" color="primary" onClick={(e) => {editRoom(account.id, props.room.id, roomName, openLevel, tweetLevel, icon.data, icon.path);}} >
                編集
              </Button>
              <Button variant="contained" color="secondary" onClick={deleteRoom}>
                削除
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  )
}

const RoomSetModal = (props) => {
  return(
    <Modal
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      open={props.open}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      onClose={()=>{props.openModal(false);}}
    >
      <RoomSet
        setOpenModal={props.openModal}
        title={"部屋の作成"}
        creatable={true}
        editable={false}
        roomId={null}
        room={{id: null, name: "", open_level: 3, post_level: 3, picture: null, picture_path: ""}}
        updateEntireRoom={props.updateEntireRoom}
      />
    </Modal>
  );
}

export default RoomSet;
export {RoomSetModal};