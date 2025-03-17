import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SimpleBarReact from "simplebar-react";
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useSnackbar } from 'notistack';

import SignOn from './account/SignOn';
import { StoreContext } from '../App';


const useStyles = makeStyles((theme) => ({
    dividerFullWidth: {
      margin: `5px 0 0 ${theme.spacing(2)}px`,
    },
}));

const MemberListItem = (props) => {
    const {account, setAccount, socket} = useContext(StoreContext)

    const deleteMember = (user_id) => {
        console.log('delete member:', user_id);
        socket.emit('delete-user', {user_id}, (response) => {
            console.log(response);
            props.getAllMembers();
        })
    }

    const editUser = (user_id, user_name, user_mail, user_authority, picture_data, is_myself) => {
        console.log(user_id, user_name, user_mail);
        setAccount({id: user_id, name: user_name, mail: user_mail, authority: user_authority});
        props.setModal(true);
        props.setIcon({data: picture_data, path: ""});
        props.setMyself(is_myself);
    }

    return (
        <ListItem button onClick={(e) => {editUser(props.id, props.name, props.mail, props.authority, props.picture, account.id==props.id);}}>
            <ListItemAvatar>
                <Avatar
                    alt=""
                    src={props.picture}
                />
            </ListItemAvatar>
            <ListItemText
                primary={props.name}
            />
            {(account.id != props.id) &&
                <ListItemSecondaryAction>
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e)=>{deleteMember(props.id);}}
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            }
        </ListItem>
    );
}

const MemberList = (props) => {
    const {account, socket} = useContext(StoreContext)
    const [user, setUser] = useState({id: "", name: "", mail: "", authority: false});
    const [members, setMembers] = useState([{id: null, name: ""}]);
    const [icon, setIcon] = useState({data: null,path: ''});
    const [modal, setModal] = useState(false);
    const [myself, setMyself] = useState(account.id === user.id);

    useEffect(() => {
        getAllMembers();
    },[]);

    const getAllMembers = () => {
        console.log('get all members.');
        socket.emit('select-all-user', {}, (response) => {
            console.log(response);
            setMembers(response.data);
        });
    }

    return (
        <Box m={2}>
            <Typography variant="h4" component="h4">
                {props.title}
            </Typography>
            <Box align="center">
                <List
                    style={{ height: "80vh", width: "70vh" }}
                >
                    <SimpleBarReact
                        forceVisible="y"
                        autoHide={true}
                        style={{ 
                        maxHeight: "100%",
                        }}
                        // ref={ref}
                    >
                        {members.map((val, index) => {
                            return(
                                <MemberListItem
                                    key={index}
                                    id={val.id}
                                    name={val.name}
                                    mail={val.mail}
                                    authority={val.authority}
                                    picture={val.picture}
                                    setUser={setUser}
                                    setIcon={setIcon}
                                    getAllMembers={getAllMembers}
                                    setMyself={setMyself}
                                    setModal={setModal}
                                />
                            );
                        })}
                    </SimpleBarReact>
                </List>
            </Box>
            <Box>
                <Button variant="contained" color="default" onClick={(e)=>{props.setOpenMemberList(false);}}>
                    戻る
                </Button>
            </Box>
            <Modal
                open={modal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <SignOn
                    url={"url.com"}
                    title={"ユーザー編集"}
                    user={user}
                    icon={icon}
                    creatable={false}
                    editable={true}
                    myself={myself}
                    setModal={setModal}
                    getAllMembers={getAllMembers}
                />
            </Modal>
        </Box>
    );
}

const MemberListModal = (props) => {
    return(
        <Modal
            open={props.open}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            onClose={() => {props.openModal(false);}}
        >
            <Paper elevation={3}>
                <MemberList
                    title={"Member List"}
                    setOpenMemberList={props.openModal}
                />
            </Paper>
        </Modal>
    );
}

const FriendList = (props) => {
    const classes = useStyles();
    const [friends, setFriends] = useState([]);
    const [publicUsers, setPublicUsers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [search, setSearch] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const {account, socket} = useContext(StoreContext)

    useEffect(() => {
        socket.emit('get-friend-list', { user_id: account.id }, (response) => {
            setFriends(response);
        })
        socket.emit('select-user-by-publicity', { publicity: 2, }, (response) => {
            setPublicUsers(response.data);
        })
    }, [])

    const searchUser = (user_id) => {
        socket.emit('search-user', { user_id }, (response) => {
            setSearch(response);
            enqueueSnackbar(`Detect ${response.length}-user.`,{});
        })
    }

    const connectToFriend = (user_id, friend_id) => {
        socket.emit('connect-to-friend', { user_id, friend_id }, (response) => {
            enqueueSnackbar(response.message,{});
        })
    }

    return (
        <Modal
            open={props.openModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Paper elevation={3}>
                <Typography variant="h4" component="h4">
                    {props.title}
                </Typography>
                <TextField
                    value={keyword}
                    onChange={ (e) => setKeyword(e.target.value) }
                    InputProps={{
                        endAdornment: <IconButton aria-label="search">
                        <SearchIcon onClick={() => {searchUser(keyword);}} />
                      </IconButton>
                    }}
                />
                <List
                    style={{ height: "80vh", width: "70vh" }}
                >
                    <SimpleBarReact
                        forceVisible="y"
                        autoHide={true}
                        style={{ 
                        maxHeight: "100%",
                        }}
                        // ref={ref}
                    >
                        <Typography
                            className={classes.dividerFullWidth}
                            color="textSecondary"
                            display="block"
                            variant="caption"
                        >
                            Search
                        </Typography>
                        {search.map((friend, index) => {
                            return (
                                <ListItem
                                    button 
                                    key={index}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt=""
                                            src={friend.picture}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={friend.name}
                                    />
                                    {(account.id !== friend.id) && (
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={(e)=>{connectToFriend(account.id, friend.id);}}
                                            >
                                                <PersonAddIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    )}
                                </ListItem>
                            )
                        })}
                        <li>
                            <Typography
                                className={classes.dividerFullWidth}
                                color="textSecondary"
                                display="block"
                                variant="caption"
                            >
                            Public users
                            </Typography>
                        </li>
                        {publicUsers.map((friend, index) => {
                            return (
                                <ListItem
                                    button 
                                    key={index}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt=""
                                            src={friend.picture}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={friend.name}
                                    />
                                    {(account.id !== friend.id) && (
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={(e)=>{connectToFriend(account.id, friend.id);}}
                                            >
                                                <PersonAddIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    )}
                                </ListItem>
                            )
                        })}
                        <li>
                            <Typography
                                className={classes.dividerFullWidth}
                                color="textSecondary"
                                display="block"
                                variant="caption"
                            >
                            Your frields
                            </Typography>
                        </li>
                        {friends.map((friend, index) => {
                            return (
                                <ListItem
                                    button 
                                    key={index}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt=""
                                            src={friend.picture}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={friend.name}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            // onClick={(e)=>{deleteMember(props.id);}}
                                        >
                                            <ExitToAppIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </SimpleBarReact>
                </List>
                <Button
                    variant="contained"
                    color="default"
                    onClick={() => {props.setOpenModal(false);}}
                >
                    戻る
                </Button>
            </Paper>
        </Modal>
    );
}

const FriendListModal = (props) => {
    return(
        <Modal
            open={props.open}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            onClose={() => {props.setOpenModal(false);}}
        >
            <Paper elevation={3}>
                <FriendList
                    title={'Friend List'}
                    openModal={props.openModal}
                    setOpenModal = {props.setOpenModal}
                />
            </Paper>
        </Modal>
    );
}

export default MemberList;
export {MemberListModal, FriendList, FriendListModal};