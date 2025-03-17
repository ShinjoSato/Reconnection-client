import clsx from 'clsx'
import { Box } from '@material-ui/core';
import { makeStyles, } from '@material-ui/core/styles';
// import useStyles01 from '../../style/halloween-night'
import useStyles01 from '../../style/christmas'

const useStyles = makeStyles((theme) => ({
    timeline: {
        display:'grid',
        gridTemplateColumns:'60px 1fr',
        marginTop:'15px'
    },
    timelineIconOuter: {
        position:'relative'
    },
    timelineItonInner: {
        position:'absolute',
        bottom:0
    },
    timelineTextFrame: {
        padding: '8px',
    },
    timelineTextOuter: {
        padding:'17px 16px 10px 30px',
        clipPath: 'polygon(3% 93%, 4% 10%, 100% 0, 95% 99%, 6% 95%, 3% 100%, 1% 89%, 0 100%, 1% 79%)',
    },
    timelineTextInner: {
        fontSize: '17px',
        padding: '5px 35px 5px 15px',
        minHeight: '80px',
        clipPath: 'polygon(2% 6%, 100% 0%, 95% 100%, 0 95%)'
    },
    timelineBottomArea: {
        display:'grid',
        gridTemplateColumns: '1fr 1fr'
    },
    timelineUserName: {
        fontSize: '19px'
    },
    timelineTimestamp: {
        fontSize:'12px',
        textAlign:'right',
        paddingRight:'20px',
    }
}));

const TimeLineItem = (props) => {
    const classes = useStyles();
    const colorClasses = useStyles01();

    return (
        <Box>
            <Box className={clsx(classes.timeline, colorClasses.timeline)}>
                <Box className={clsx(classes.timelineIconOuter)}>
                    <Box className={clsx(classes.timelineItonInner)}>
                        <img src={props.row.user_icon} width="50px" height="50px" />
                    </Box>
                </Box>
                <Box className={clsx(classes.timelineTextFrame)}>
                    <Box className={clsx(classes.timelineTextOuter, colorClasses.timelineTextOuter)}>
                        <Box className={clsx(classes.timelineTextInner, colorClasses.timelineTextInner)}>{ props.row.tweet }</Box>
                    </Box>
                </Box>
            </Box>
            <Box className={clsx(classes.timelineBottomArea)}>
                <Box className={clsx(classes.timelineUserName)}>{ props.row.name }</Box>
                <Box className={clsx(classes.timelineTimestamp)}>{ props.row.time }</Box>
            </Box>
        </Box>
    )
}

export default TimeLineItem