import React, { useEffect, useState, useContext } from 'react'
import { Box, Paper, Tooltip, IconButton, makeStyles } from "@material-ui/core";
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

import SubmitForm from './SubmitForm';
import TweetLineList, { MangaChatButton } from './TweetLineList';
import { StoreContext } from '../App';

const useStyles = makeStyles((theme) => ({
    inputAreaPaper: {
        width: "97%",
        margin: "auto",
    },
}))

// チャットルーム一部屋分の画面レイアウト
const TalkroomView = (props) => {
    const classes = useStyles()
    const [tweettext, setTweettext] = useState('')

    return (
        <Box>
            <Paper elevation={3} className={classes.inputAreaPaper}>
            {(props.room && props.room.posting) && (
                <SubmitForm 
                tweettext={tweettext}
                setTweettext={setTweettext}
                room={props.room}
                prev_tweet={props.prev_tweet}
                setPrevTweet={props.setPrevTweet}
                />
            )}
            </Paper>
            <Tooltip title="Photo Album" aria-label="photo-album">
                <IconButton edge="end" aria-controls="simple-menu" aria-haspopup="true" onClick={() => {props.setOpenPictureList(true);}} >
                    <PhotoLibraryIcon />
                </IconButton>
            </Tooltip>
            <MangaChatButton room={props.room}/>
            <TweetLineList
                room={props.room}
                tweettext={tweettext}
                tweets={props.tweets}
                is_main_tweet={true}
                prev_tweet={props.prev_tweet}
                setPrevTweet={props.setPrevTweet}
            />
        </Box>
    )
}

export default TalkroomView