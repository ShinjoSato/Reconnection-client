import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}))

const PictureTweet = (props) => {
    const classes = useStyles();

    return(
        <Box textAlign={"center"} margin={"auto"}>
            <img src={props.picture} width="100%" display="block" />
            <Box textAlign={"left"}>
                <Typography variant="subtitle1" gutterBottom>
                    {props.tweet}
                </Typography>
            </Box>
        </Box>
    );
}

export default PictureTweet;