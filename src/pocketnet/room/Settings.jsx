import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';

import RoomSet from '../RoomSet';
import RoomMember from './RoomMember';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabPanelArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const Settings = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="部屋の編集" {...a11yProps(0)} />
          <Tab label="ルームメンバーの設定" {...a11yProps(1)} />
          <Tab label="Comming soon..." {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <div className={classes.tabPanelArea}>
        <TabPanel value={value} index={0}>
          <RoomSet
            setOpenModal={props.setOpenModal}
            title={"部屋の編集"}
            creatable={false}
            editable={true}
            room={props.room}
            />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RoomMember
            setOpenModal={props.setOpenModal}
            title={"ルームメンバーの設定"}
            creatable={false}
            editable={true}
            room={props.room}
            roomMember={props.roomMember}
            />
        </TabPanel>
        <TabPanel value={value} index={2}>
          Comming soon...
        </TabPanel>
      </div>
    </div>
  );
}

const SettingsModal = (props) => {
  return(
    <Modal
      open={props.open}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box
        style={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Settings
          setOpenModal={props.openModal}
          title={"RoomMemberの設定"}
          creatable={false}
          editable={true}
          room={props.room}
          roomMember={props.roomMember}
        />
      </Box>
    </Modal>
  );
}

export default Settings;
export {SettingsModal};