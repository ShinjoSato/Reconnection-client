import { makeStyles } from '@material-ui/core/styles';

const useStyles01 = makeStyles((theme) => ({
    // MenuBar.jsx
    menubar: {
        backgroundColor:'#041540',
    },
    menubarButton: {
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        "&:hover": {
            background: "steelblue",
        },
    },
    // Login.jsx
    background: {
        backgroundColor: '#383363',
    },
    inputArea: {
        backgroundColor: '#ad8c17',
    },
    serverList: {
        color: 'white',
        backgroundColor: '#c1a565',
    },
    serverBoardModalPaper: {
        backgroundColor: '#ffffff',
    },
    // MainView.jsx
    drawerOpen: {
        backgroundColor: "#61638a;",
        color: "white",
    },
    drawerClose: {
        backgroundColor: "#61638a;",
        color: "white",
    },
    topBar: {
        color: '#ffffff',
        backgroundColor: '#e2b32e',
    },
    content: {
        backgroundColor: "#475279",
    },
    // SubmitForm.jsx
    textfield: {
        backgroundColor: '#f7cc52',
    },
    textfieldBackground: {
        backgroundColor: '#e1ba4b',
    },
    textfieldInput: {
        color: '#ffffff',
    },
    // tweet/tweetLineTimeline.jsx
    timeline: {
        color:'#ffffff',
    },
    timelineTextOuter: {
        backgroundColor:'#ffc31a',
    },
    timelineTextInner: {
        backgroundColor:'#3f3f5a',
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
        backgroundColor: '#bf9c1a',
    },
    tweetData: {
        color: "#ffffff",
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