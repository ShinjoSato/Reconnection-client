import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import SendIcon from '@material-ui/icons/Send';
import CancelScheduleSendOutlinedIcon from '@material-ui/icons/CancelScheduleSendOutlined';

import { useSnackbar } from 'notistack';
import { StoreContext } from '../../App';
import { Store } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
      margin: 'auto',
    },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      width: 290,
      height: 400,
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
}));
  
function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}
  
function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}
  
function union(a, b) {
    return [...a, ...not(b, a)];
}

const UserListItem = (props) => {
  const labelId = `transfer-list-all-item-${props.index}-label`;
  const [opening, setOpening] = useState((props.value.opening)? props.value.opening: false);
  const [posting, setPosting] = useState((props.value.posting)? props.value.posting: false);

  /**
   * 特定ユーザーの呟き閲覧権限のボタン処理。
   * @param {boolean} status 変更前の閲覧権限に関するboolean。
   * @param {string} user_id ステータスを変更させるユーザーID。 
   */
  const updateOpeningStatus = (status, user_id) => {
    const check = (status)? false: true;
    setOpening(check);
    props.setMembersList(x => {
      return x.map(val => { return { ...val, opening: (val.user_id===user_id)? check: val.opening }; })
    });
  }

  /**
   * 特定ユーザーの呟き投稿権限のボタン処理。
   * @param {boolean} status 変動前の呟き権限に関するboolean。 
   * @param {string} user_id ステータスを変更させるユーザーID。 
   */
  const updatePostingStatus = (status, user_id) => {
    const check = (status)? false: true;
    setPosting(check);
    props.setMembersList(x => {
      return x.map(val => { return { ...val, posting: (val.user_id===user_id)? check: val.posting }; })
    });
  }

  return (
    <ListItem key={props.index} role="listitem" button onClick={props.handleToggle(props.value)}>
      <ListItemIcon>
        <Checkbox
          checked={props.checked.indexOf(props.value) !== -1}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </ListItemIcon>
      <Avatar
          alt=""
          src={props.value.picture}
          style={{width: "32px", height: "32px",}}
      />
      <ListItemText id={props.labelId} primary={props.value.user_name} />
      <ListItemSecondaryAction>
        <Checkbox
          name="opening" 
          icon={<VisibilityOffOutlinedIcon />}
          checkedIcon={<VisibilityIcon />}
          checked={opening}
          onClick={() => { updateOpeningStatus(opening, props.value.user_id); }}
        />
        <Checkbox
          name="posting"
          icon={<CancelScheduleSendOutlinedIcon />}
          checkedIcon={<SendIcon />}
          checked={posting}
          onClick={() => { updatePostingStatus(posting, props.value.user_id); }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}
  
const TransferList = (props) => {
    const classes = useStyles();
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState(props.members);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    const {account, socket} = useContext(StoreContext)

    useEffect(() => {
      getNotMembers(props.room.id, account.id);
      props.setMembersList(props.members);
    },[]);
  
    const getNotMembers = (room_id, user_id) => {
      socket.emit('receive-not-room-member-but-friend', { room_id, user_id }, (response) => {
        const data = response.map(x => {return { ...x, opening: true, posting: true };});
        setLeft(data);
        props.setNotMembersList(data);
      });
    }
  
    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked);
    }
  
    const numberOfChecked = (items) => intersection(checked, items).length;
  
    const handleToggleAll = (items) => () => {
      if (numberOfChecked(items) === items.length) {
        setChecked(not(checked, items));
      } else {
        setChecked(union(checked, items));
      }
    }
  
    const handleCheckedRight = () => {
      setRight(right.concat(leftChecked));
      props.setMembersList(right.concat(leftChecked));
      setLeft(not(left, leftChecked));
      props.setNotMembersList(not(left, leftChecked))
      setChecked(not(checked, leftChecked));
    }
  
    const handleCheckedLeft = () => {
      if(!props.isInGroup(account, rightChecked)){
        setLeft(left.concat(rightChecked));
        props.setNotMembersList(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        props.setMembersList(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
      }else{
        console.log("ユーザーが含まれているので移動できません");
      }
    }
  
    const customList = (title, items) => (
      <Card>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Checkbox
              onClick={handleToggleAll(items)}
              checked={numberOfChecked(items) === items.length && items.length !== 0}
              indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
              disabled={items.length === 0}
              inputProps={{ 'aria-label': 'all items selected' }}
            />
          }
          title={title}
          subheader={`${numberOfChecked(items)}/${items.length} selected`}
        />
        <Divider />
        <List className={classes.list} dense component="div" role="list">
          {items.map((value, index) => {
            return (
              <UserListItem
                value={value}
                index={index}
                checked={checked}
                handleToggle={handleToggle}
                setMembersList={props.setMembersList}
                setNotMembersList={props.setNotMembersList}
              />
            );
          })}
          <ListItem />
        </List>
      </Card>
    );

    return (
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item>{customList('Choices', left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList('Chosen', right)}</Grid>
      </Grid>
    );
}

const RoomMember = (props) => {
  const [membersList, setMembersList] = useState(null);
  const [notMembersList, setNotMembersList] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const {socket} = useContext(StoreContext)

  /**
   * 部屋のメンバーを追加、削除する関数。
   * @param {*} origins 
   * @param {*} members 
   * @param {*} notMembers 
   * @param {*} room_id 
   */
  const updateRoomMembers = (origins, members, notMembers, room_id) => {
    console.log("update room members:", origins, members, notMembers, room_id);
    for(const user of members){
      if(!isInGroup(user,origins)){
        console.log('insert into:', user.id, room_id);
        socket.emit("add-user-into-room", { user_id: user.user_id, room_id: room_id, opening: user.opening, posting: user.posting }, (response) => {
          console.log(response);
          enqueueSnackbar(response.message, {});
        });
      }else{
        if(!compareValue(origins, members, user.user_id, 'opening') || !compareValue(origins, members, user.user_id, 'posting')){// 基より部屋に属するが、閲覧権限又は呟き権限が変更された場合
          console.log('update:', user.user_id, room_id);
          socket.emit("update-user-in-room", { user_id: user.user_id, room_id: room_id, opening: user.opening, posting: user.posting }, (response) => {
            console.log(response);
            enqueueSnackbar(response.message, {});
          })
        }
      }
    }
    for(const user of notMembers){
      if(isInGroup(user,origins)){
        socket.emit("remove-user-from-room", { user_id: user.user_id, room_id: room_id }, (response) => {
          console.log(response);
          enqueueSnackbar(response.message, {})
        });
      }
    }
  }

/**
 * listにtargetが含まれるか確認する関数。
 * @param {*} target 
 * @param {*} list 
 * @returns {boolean} listにtargetが含まれる場合はtrue、含まれない場合はfalseを返す。
 */
  const isInGroup = (target, list) => {
    for(const value of list){
      if(value.user_id == target.user_id){
        return true;
      }
    }
    return false;
  }

  /**
   * 二つのリストに含まれるユーザーIDの指定されたキーの値が一致するかを表すBooleanを返す。
   * @param {Array<Object>} list1 比較対象となる一つ目のリスト。
   * @param {Array<Object>} list2 比較対象となる二つ目のリスト。
   * @param {string} user_id 二つのリスト内オブジェクトに含まれるuser_id。
   * @param {string} key 二つのリスト内オブジェクトに含まれるkey。
   * @returns {boolean} list1とlist2のuser_idに関してkeyの値が一致する時にtrue、異なる時にfalse。
   */
  const compareValue = (list1, list2, user_id, key) => {
    const target1 = list1.filter(x => x.user_id==user_id)[0];
    const target2 = list2.filter(x => x.user_id==user_id)[0];
    return target1[key] === target2[key];
  }

  return (
    <Paper elevation={3}>
      <Box m={2}>
        <Typography variant="h4" component="h4">
          {props.title}
        </Typography>
        <TransferList
          members = {props.roomMember}
          room={props.room}
          setMembersList = {setMembersList}
          setNotMembersList = {setNotMembersList}
          setOpenModal = {props.setOpenModal}
          isInGroup = {isInGroup}
        />
        <Box m={2}>
          <Button variant="contained" color="default" onClick={(e)=>{props.setOpenModal(false)}}>
            戻る
          </Button>
          <Button variant="contained" color="default" onClick={(e)=>{updateRoomMembers(props.roomMember, membersList, notMembersList, props.room.id);}}>
            更新
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default RoomMember;
export {TransferList};