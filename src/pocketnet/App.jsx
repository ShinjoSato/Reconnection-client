import React, { useState } from 'react'
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
// import { hot } from 'react-hot-loader/root'
import Slide from '@material-ui/core/Slide'
import { SnackbarProvider } from 'notistack'
import './App.css'

import MainView from './MainView'
import Login from './Login'
import RoomSet from './RoomSet'
import MangaChatWindow from './MangaChatWindow';
import MenuBar from './MenuBar'
import BottomBar from './BottomBar'

const App = () => {
  return (
    <Router>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        TransitionComponent={Slide}
      >
        <Switch>
          <Route path='/' exact>
            <MenuBar />
            <Login/>
            <BottomBar />
          </Route>
          <Route path='/home' exact>
            <MenuBar />
            <MainView/>
            <BottomBar />
          </Route>
          <Route path='/room/add' exact>
          <MenuBar />
            <RoomSet
              url='url.com'
            >
            </RoomSet>
          </Route>
          <Route path='/manga-chat' exact>
            <MangaChatWindow />
          </Route>
        </Switch>
      </SnackbarProvider>
    </Router>
  )
}

// export default hot(App)
export default App
