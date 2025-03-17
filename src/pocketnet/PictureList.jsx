import React, { useEffect,useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SimpleBarReact from "simplebar-react";

import PictureTweet from "./PictureTweet";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    imageList: {
      width: '100%',
      height: '100%',
    },
}))

const PictureItem = (props) => {
    const [itemBar, setItemBar] = useState("none");
    const [imageSize, setImageSize] = useState({width: 0, height:1});

    useEffect(() => {
        var img = new Image();
        img.src = props.picture;
        setImageSize({width: img.width, height: img.height});
    }, []);

    const openPicture = (tweet, picture, user_name, user_icon, time) => {
        props.setModal(true);
        props.setPicTweet({ picture: picture, tweet: tweet, })
    }

    return(
        <Box
            key={props.index}
            // cols={props.index.cols || 1}
            // onClick={(e) => {console.log('click した');}}
            onClick={(e) => {openPicture(props.tweet, props.picture, props.user, props.user_icon, props.time);}}
            onMouseEnter={() => {setItemBar("flex");}}
            onMouseLeave={() => {setItemBar("none");}}
        >
            <img
                src={props.picture} 
                alt={props.tweet} 
                style={{
                    position: "absolute",
                    width: (imageSize.height<imageSize.width)? "auto": "100%",
                    height: (imageSize.height<imageSize.width)? "100%": "auto",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            />
            <ImageListItemBar
                style={{ display: itemBar, }}
                title={props.tweet}
                subtitle={props.user}
                actionIcon={
                    <Avatar
                        style={{
                        width: '40px',
                        height: '40px'
                        }}
                        src={props.user_icon}
                        variant="circular"
                    />
                }
            />
        </Box>
    );
}

const PictureList = (props) => {
    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const [picTweet, setPicTweet] = useState({ picture: null, tweet: "", })

    return(
        <>
            <ImageList rowHeight={200} className={classes.imageList} cols={5}>
                {props.albums.map((album, index) => (
                    <ImageListItem
                        key={index}
                        cols={index.cols || 1}
                    >
                        <PictureItem
                            key={index}
                            cols={4}
                            tweet={album.tweet}
                            picture={album.picture}
                            user={album.user}
                            user_icon={album.user_icon}
                            time={album.time}
                            setModal={setModal}
                            setPicTweet={setPicTweet}

                            pItem={ props.albums[index-1] }
                            nItem={ props.albums[index+1] }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <Modal
                open={modal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                onClose={()=>{setModal(false);}}
            >
                <Paper style={{width: "60%", margin: "auto", display: "flex"}}>
                    <PictureTweet
                        picture={picTweet.picture}
                        tweet={picTweet.tweet}
                    />
                </Paper>
            </Modal>
        </>
    );
}

const PictureListModal = (props) => {
    return(
        <Modal
            open={props.open}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Paper style={{ height: "100%", overflowY: "hidden", }}>
                <SimpleBarReact
                    forceVisible="y"
                    autoHide={true}
                    style={{ 
                        maxHeight: "100%",
                    }}
                    // ref={ref}
                >
                    <Box>
                        <IconButton
                            onClick={(e) => {props.openModal(false);}}
                        >
                            <CloseIcon />
                        </IconButton>
                        <PictureList
                            albums={props.albums}
                        />
                    </Box>
                </SimpleBarReact>
            </Paper>
        </Modal>
    );
}

export default PictureList; 
export {PictureItem, PictureListModal};