import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { useSnackbar } from 'notistack';
import Checkbox from '@material-ui/core/Checkbox';
import StarRateIcon from '@material-ui/icons/StarRate';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import { StoreContext } from '../../App';
import useStyles01 from '../../style/halloween-night';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  main: {
    height: '100vh',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    maxWidth: '85%',
  },
  entireBox: {
    backgroundColor: '#rgb(247 247 247)',
  },
  iconArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconAvatar: {
    width: '150px',
    height: '150px',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
}));

const SignOn = (props) => {
  const classes = useStyles();
  const classes01 = useStyles01();
  const inputRef = useRef(null);
  const {account, setAccount, socket} = useContext(StoreContext)
  const [url, setURL] = useState('');
  const [icon, setIcon] = useState(props.icon);
  const [userName, setUserName] = useState(account.name);
  const [userId, setUserId] = useState(account.id);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [mail, setMail] = useState(account.mail);
  const [authority, setAuthority] = useState(account.authority);
  const { enqueueSnackbar } = useSnackbar();

  const inputImage=()=>{
    console.log('input image');
    inputRef.current.click();
  }

  const setImage=(event)=>{
    console.log(event.target.files);
    if(event.target.files[0]){
      setIcon({data: URL.createObjectURL(event.target.files[0]), path: event.target.files[0].path});
    }else{
      setIcon({data: null,path: ''});
    }
    console.log('set image しました');
  }

  const register=(url, user_id, user_name, password1, password2, mail, authority)=>{
    console.log(url, props.url, user_id, user_name, password1, password2, mail, authority)
    const body = new URLSearchParams();
    body.append('user_id', user_id);
    body.append('user_name', user_name);
    body.append('password1', password1);
    body.append('mail', mail);
    body.append('authority', authority);
    if(password1 != password2) {
      enqueueSnackbar("パスワードの不一致", {})
      return null;
    }
    if(icon.path===''&&icon.data===null){
      body.append('picture', null)
      axios.post(`${url}/sign-on/check`, body)
      .then(res => {
        console.log(res);
        console.log(res.data);
        enqueueSnackbar("画像なしで登録。", {})
      }).catch(error => {
        console.log(error);
        enqueueSnackbar("エラーが発生しました。", {});
      })
    }else{
      window.myapi.getPicData(icon.path).then(binary => {
        body.append('picture', binary)
        axios.post(`${url}/sign-on/check`, body)
        .then(res => {
          console.log(res);
          console.log(res.data);
          enqueueSnackbar("画像ありで登録。", {})
        }).catch(error => {
          console.log(error);
          enqueueSnackbar("エラーが発生しました。", {});
        })
      });
    }
  }

  const updateUser = (user_id, user_name, picture_data, picture_path, user_password1, user_password2, mail, authority) => {
    console.log('update user.\n', user_id, user_name, user_password1, user_password2, mail, authority);
    const publicity = 1;
    if(user_password1 == user_password2){
      var data = {
        id: user_id, name: user_name, picture: null, password: user_password1, mail: mail, authority: authority, publicity: publicity,
      };

      if(picture_data && picture_path.length>0){
        window.myapi.getPicData(picture_path).then(binary => {
          data.picture = binary;
          socket.emit('update-user', data, (response) => {
            console.log(response);
            if(response.status){
              if(props.myself){
                setAccount(response.data);
                setIcon(x => { return { ...x, data: response.data.image }; });
              }
              if(props.getAllMembers){
                props.getAllMembers();
              }
            }
            enqueueSnackbar(response.message, {});
          })
        })
        .catch((error) => {
          console.log(error)
          enqueueSnackbar("error", {});
        })
      }else{
        socket.emit('update-user', data, (response) => {
          enqueueSnackbar(response.message, {});
          if(response.status){
            if(props.myself){
              setAccount(response.data);
            }
            if(props.getAllMembers){
              props.getAllMembers();
            }
          }
        })
      }      
    }else{
      enqueueSnackbar("二つのパスワードが一致しません。", {});
    }
  }

  return (
    <div className={classes.main}>
    <Paper className={classes.paper+' '+classes01.paper} elevation={3}>
      <Box className={classes.entireBox}>
        <Box m={2}>
          <Typography variant="h4" component="h4">
            {props.title}
          </Typography>
        </Box>
        <form className={classes.root} noValidate autoComplete="off">
          <input
            hidden
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={setImage}
          />
          <Grid
            container
          >
            <Grid className={classes.iconArea} item xs={4}>
              <IconButton onClick={inputImage}>
                <Avatar className={classes.iconAvatar} alt="user-image" src={icon.data} />
              </IconButton>
            </Grid>
            <Grid className={classes.inputArea} item xs={8} container direction="column">
              <TextField
                id=""
                label="URL"
                style={{
                  width: '80%',
                }}
                // InputProps={{
                //   readOnly: true,
                // }}
                defaultValue={props.url}
                disabled={(props.url.length>0)? true: false}
                onChange={(e) => setURL(e.target.value)}
              >
              </TextField>
              <TextField
                required
                id="standard-required"
                label="User Id"
                style={{
                  width: '80%',
                }}
                defaultValue={userId}
                disabled={(account.id)? true: false}
                onChange={(e) => setUserId(e.target.value)}
              />
              <TextField
                required
                id="standard-required"
                label="User Name"
                style={{
                  width: '80%',
                }}
                defaultValue={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <TextField
                required
                id="standard-password-input"
                label="Passsword"
                type="password"
                autoComplete="current-password"
                style={{
                  width: '80%',
                }}
                onChange={(e) => setPassword1(e.target.value)}
              />
              <TextField
                required
                id="standard-password-input"
                label="Passsword Again"
                type="password"
                autoComplete="current-password"
                style={{
                  width: '80%',
                }}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <TextField
                required
                id="standard-required"
                label="Mail"
                style={{
                  width: '80%',
                }}
                defaultValue={account.mail}
                onChange={(e) => setMail(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="autority" 
                    icon={<StarOutlineIcon />}
                    checkedIcon={<StarRateIcon />}
                    checked={authority}
                    onChange={(e) => {setAuthority(e.target.checked);}}
                  />
                }
                disabled={props.myself}
                label="Authority"
                labelPlacement="start"
              />

            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Box m={2}>
                <Button variant="contained" color="default" onClick={(e) => {props.setModal(false);}}>
                  戻る
                </Button>
                {props.creatable && (
                  <Button variant="contained" color="primary" onClick={(e)=>{register(url, userId, userName, password1, password2, mail, authority);}}>
                    登録
                  </Button>
                )}
                {props.editable && (
                  <Button variant="contained" color="primary" onClick={(e) => {updateUser(userId, userName, icon.data, icon.path, password1, password2, mail, authority);}}>
                    編集
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  </div>
  )
}

const SignOnModal = (props) => {
  const {account} = useContext(StoreContext)

  return(
    <Modal
      open={props.open}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      onClose={() => {props.openModal(false);}}//Not working.
    >
      <SignOn
        url={"url.com"}
        title={account.name}
        icon={ {data: account.image, path: ""} }
        creatable={false}
        editable={true}
        myself={true}
        setModal={props.openModal}
      />
    </Modal>
  );
}

export default SignOn;
export {SignOnModal};