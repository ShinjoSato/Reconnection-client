import React, { useState, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Tooltip from '@material-ui/core/Tooltip';

import { StoreContext } from '../App';
// import useStyles01 from '../style/halloween-night';
import useStyles01 from '../style/christmas';

const useStyles = makeStyles((theme) => ({
  buttonIcon: {
    width: "36px",
    height: "36px",
  },
  iconImage: {
    width: "24px",
    height: "24px",
  },
  textfield: {
    width: '100%',
  },
}));


const SubmitButton = (props) => {
  const classes = useStyles();
  const { account, socket } = useContext(StoreContext);
  const { enqueueSnackbar } = useSnackbar()

  const sendTweet = (text, user_id, room_id, picture_data, chat_head) => {
    var data = {text: text, user: user_id, room: room_id, head: chat_head, picture: null};
    if (text.length > 0) {
      if (picture_data) {
        window.myapi.getPicData(props.picture.path).then(binary => {
          data.picture = binary;
          socket.emit('/socket/server', {data:data, rest:'/chat'}, (response) => {
            console.log(response);
          });
          props.setPicture({ data: null, path: null })
        }).catch(error => {
          console.log(error)
        })
      } else {
        socket.emit('/socket/server', {data:data, rest:'/chat'}, (response) => {
          console.log(response);
        });
      }
      props.updateInputArea('');
      props.setPrevTweet({ id: null, user_name: "", text: "" });
      enqueueSnackbar(text, {})
    }
  }

  return (
    <Tooltip title="Submit" aria-label="submit">
      <IconButton className={classes.buttonIcon} aria-label="delete" onClick={(e) => {sendTweet(props.inputArea, account.id, props.room.id, props.picture.data, props.prev_tweet.id)} }>
        <SendIcon className={classes.iconImage} />
      </IconButton>
    </Tooltip>
  );
}

const SubmitForm = (props) => {
  const classes = useStyles();
  const classes01 = useStyles01();
  const inputRef = useRef(null);
    const [picture, setPicture] = useState({
        path: null,
        data: null
    });
  const [inputArea, setInputArea] = useState("");

    const inputPicture = (event) => {
        console.log('画像ファイルを選択もしくは解除しました')
        if (event.target.files[0]) {
          setPicture({
            path: event.target.files[0].path,
            data: URL.createObjectURL(event.target.files[0])
          })
        } else {
          setPicture({
            path: null,
            data: null
          })
        }
    }

    const pushImageButton = (event) => {
      inputRef.current.click();
    }

    const resetTextField = () => {
      props.setPrevTweet({ id: null, user_name: "", text: "" });
      setPicture({ path: null, data: null });
      updateInputArea('');
    }

    const updateInputArea = (text) => {
      setInputArea(text);
      // props.setTweettext(text);
    }

    return (
        <Box>
          <Box className={classes01.textfieldBackground}>
            {picture.data &&
              <img src={picture.data} height={'100px'} />
            }
            
            <input
              type='file'
              hidden
              accept="image/*"
              ref={inputRef}
              onChange={(event) => inputPicture(event)}
            />
          </Box>
          <TextField
            className={classes.textfield+' '+classes01.textfield}
            value={inputArea}
            onChange={(e) => updateInputArea(e.target.value)}
            label={ ((props.prev_tweet.id)? `[${props.prev_tweet.user_name}] ${props.prev_tweet.text.substring(0, 30)+((props.prev_tweet.length>30)? "...": "")}`: "") }
            multiline
            rows={3}
            variant="filled"
            InputProps={{
              className: classes01.textfieldInput,
              endAdornment:
                <Box
                  style={{
                    display: "contents",
                  }}
                >
                  <Tooltip title="Reset" aria-label="reset">
                    <IconButton
                      className={classes.buttonIcon}
                      onClick={resetTextField}
                    >
                      <HighlightOffIcon className={classes.iconImage} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add Picture" aria-label="picture">
                    <IconButton
                      className={classes.buttonIcon}
                      onClick={pushImageButton}
                    >
                      <ImageOutlinedIcon className={classes.iconImage} />
                    </IconButton>
                  </Tooltip>
                  <SubmitButton
                    inputArea={inputArea}
                    updateInputArea={updateInputArea}
                    tweettext={props.tweettext}
                    room={props.room}
                    picture={picture}
                    chat_head={props.prev_tweet.id}
                    setPicture={setPicture}
                    setPrevTweet={props.setPrevTweet}
                    prev_tweet={props.prev_tweet}
                  />
                </Box>
            }}
          />
        </Box>
    );
}

export default SubmitForm
export {SubmitButton}