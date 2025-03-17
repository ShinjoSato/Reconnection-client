import { makeStyles } from '@material-ui/core/styles';

const useStyles01 = makeStyles((theme) => ({
    // MenuBar.jsx
    menubar: {
        backgroundColor:'#1d6b59',
    },
    menubarButton: {
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        "&:hover": {
            background: "#daca39",
        },
    },
    // Login.jsx
    background: {
        backgroundColor: '#fbfbfb',
    },
    inputArea: {
        backgroundColor: '#d63129',
    },
    serverList: {
        color: 'white',
        backgroundColor: '#c12222',
    },
    serverBoardModalPaper: {
        backgroundColor: '#ffffff',
    },
    // MainView.jsx
    drawerOpen: {
        backgroundColor: "#960606",
        color: "white",
    },
    drawerClose: {
        backgroundColor: "#960606",
        color: "white",
    },
    topBar: {
        color: '#e8c61f',
        backgroundColor: '#fbfbfb',
    },
    content: {
        backgroundColor: "#fff2f2",
    },
    // SubmitForm.jsx
    textfield: {
        backgroundColor: '#794a0f',
    },
    textfieldBackground: {
        backgroundColor: '#794a0f',
    },
    textfieldInput: {
        color: '#ffffff',
    },
    // tweet/tweetLineTimeline.jsx
    timeline: {
        color:'#ffffff',
    },
    timelineTextOuter: {
        backgroundColor:'#ffffff',
    },
    timelineTextInner: {
        backgroundColor:'#960606',
    },
    // TweetLineList.jsx
    userInfo: {
        backgroundColor: 'white',
    },
    actionButtonBox: {
        color: "#353535",
    },
    balloon: {
        color: '#ffffff',
        backgroundColor: '#754202',
    },
    tweetData: {
        color: "#960606",
    },
    tweetHistory: {
        opacity: 0.95,
        backgroundColor: "#6d7fa0",
    },
    // SignOn.jsx
    paper: {
        backgroundColor: "#e1ba4b",
    }
}))

export default useStyles01;