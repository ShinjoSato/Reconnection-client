import React, { useState, useEffect, useContext } from 'react'
import { Box } from '@material-ui/core';
import TimeLineItem from './tweet/tweetLineTimeline';

import { StoreContext } from '../App';

// Timeline画面
const Timeline = (props) => {
    const { timeline } = useContext(StoreContext);
    console.log(timeline)
    return (
        <Box>
            {timeline.map((row, index) => (
                <TimeLineItem
                    key={index}
                    row={row}
                />
            ))}
        </Box>
    )
}

export default Timeline