import clsx from 'clsx';
import { makeStyles, } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Crop54Icon from '@material-ui/icons/Crop54';
import MinimizeIcon from '@material-ui/icons/Minimize';
// import useStyles01 from '../style/halloween-night'
import useStyles01 from '../style/christmas'
import IconImage from "../images/logo192.png";

const useStyles = makeStyles((theme) => ({
    menubar: {
      display:'grid',
      gridTemplateColumns: 'auto 1fr 105px',
      height:'25px',
    },
    menubarItem: {
        height:'25px',
    },
    menubarDrag: {
      '-webkit-app-region': 'drag',
    },
    menubarButton: {
      height:'25px',
      width:'35px',
      border: 'none',
    },
    menubarButtonIcon: {
      fontSize:'20px',
    },
}));

//メニューバーが正式名
const MenuBar = () => {
    const classes = useStyles();
    const colorClasses = useStyles01()
  
    const minimizeScreen = () => {
      window.myapi.appMinimize({}).then(response => {
        console.log(response)
      })
    }
  
    const fullScreen = () => {
      window.myapi.appFullScreen({}).then(response => {
        console.log(response)
      })
    }
  
    const quitApp = () => {
      window.myapi.appQuit({}).then(response => {
        console.log(response)
      })
    }
  
    return (
      <div className={clsx(classes.menubar, colorClasses.menubar)}>
        <div className={clsx(classes.menubarItem, classes.menubarDrag)}>
          <img src={IconImage} style={{ height:'25px' }} />
        </div>
        <div className={clsx(classes.menubarItem, classes.menubarDrag)}></div>
        <div style={{ height:'100%', }}>
          <button className={clsx(classes.menubarButton, colorClasses.menubarButton)} onClick={() => minimizeScreen()}>
            <MinimizeIcon className={colorClasses.menubarButtonIcon} />
          </button>
          <button className={clsx(classes.menubarButton, colorClasses.menubarButton)} onClick={() => fullScreen()}>
            <Crop54Icon className={colorClasses.menubarButtonIcon} />
          </button>
          <button className={clsx(classes.menubarButton, colorClasses.menubarButton)} onClick={() => quitApp()}>
            <CloseIcon className={colorClasses.menubarButtonIcon} />
          </button>
        </div>
      </div>
    )
}

export default MenuBar;