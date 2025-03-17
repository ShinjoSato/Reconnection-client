import React, { useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SimpleBarReact from "simplebar-react";
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';
import PublicIcon from '@material-ui/icons/Public';
import LinkIcon from '@material-ui/icons/Link';

import { StoreContext } from '../App';

const RoomIcon = (props) => {
    const contents = props
  
    return (
      <Box flexDirection="row">
        <Badge
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          overlap="circular"
          badgeContent={
            <BubbleChartIcon
              style={{
                color: '#30ffb3'
              }}
            />
          }
        >
          <Badge color="primary" overlap="circular" badgeContent={contents.notification}>
            <Avatar variant="rounded" src={contents.image} />
          </Badge>
        </Badge>
      </Box>
    )
}

const RoomLineList = (props) => {
  const {account, allRoom, allTweet, allRoomMember, allAlbum} = useContext(StoreContext)

    return(
        <List
            style={{overflowY: "hidden"}}
        >
            <SimpleBarReact
                forceVisible="y"
                autoHide={true}
                style={{ 
                    maxHeight: "100%",
                }}
                // ref={ref}
            >
              <ListItem button
                key={-2}
                onClick={(e) => props.openScreenView('/view/timeline', 'Timeline', [])}
              >
                  <ListItemIcon>
                    <PublicIcon variant="circle" style={{ height:'40px', width:'40px', }} />
                  </ListItemIcon>
                  <ListItemText primary={"タイムライン"} />
                </ListItem>
              {props.authority && (
                <ListItem button
                  key={-1}
                  onClick={(e) => props.openScreenView('/view/api', 'API List', [])}
                >
                    <ListItemIcon>
                      <LinkIcon variant="circle" style={{ height:'40px', width:'40px', }} />
                    </ListItemIcon>
                    <ListItemText primary={"API List"} />
                  </ListItem>
              )}
              <Divider variant="middle" />

              {Object.keys(allRoom).map((key, index) => (
                /**
                 * allRoom[key].id!= null これが起こらないようにしたい
                 */
                <ListItem button key={index} onClick={(e) => { ( key in allTweet && key in allRoomMember && key in allAlbum && allRoom[key].id!= null ) && props.changeChatroom(allRoom[key].id, account.id) } }>
                  <ListItemIcon>
                    {allRoom[key].picture ? (
                      <RoomIcon
                        image={allRoom[key].picture}
                        notification={props.notification[allRoom[key].id]}
                      />
                    ) : (
                      <Skeleton animation="wave" variant="circle" width={40} height={40} />
                    )}
                  </ListItemIcon>
                  { ( key in allTweet && key in allRoomMember && key in allAlbum ) ? (
                    <ListItemText primary={allRoom[key].name} />
                  ) : (
                    <Skeleton animation="wave" width={100} height={40} />
                  )}
                </ListItem>
              ))}
              <Divider variant="middle" />
            </SimpleBarReact>
        </List>
    );
}

export default RoomLineList;
export {RoomIcon};