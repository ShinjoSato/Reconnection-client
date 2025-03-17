import React, { useEffect, useState, useContext } from 'react'
import { Box, IconButton, Typography, makeStyles } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import { StoreContext } from '../App';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    tableRow: {
        "&:hover": {
            backgroundColor: "lightGray"
        },
    },
    category: {
        padding: '20px',
    },
  });
  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
  

const RestAPIDetailView = (props) => {
    const [option, setOption] = useState([])
    const [output, setOutput] = useState([])
    const [outgoing, setOutgoing] = useState([])
    const [scheduler, setScheduler] = useState([])
    const { setInitialize, account, socket, allRoom, setAllRoom, allRoomMember, setAllRoomMember, allTweet, setAllTweet, allAlbum, setAllAlbum, timeline, setTimeline } = useContext(StoreContext);
    const classes = useStyles();

    useEffect(()=> {
        socket.emit('/socket/server', { rest: '/webhook/id/option', data: { api_id:props.webhook.id } }, (options) => {
            setOption(options.rows)
        })

        socket.emit('/socket/server', { rest: '/webhook/id/output', data: { api_id:props.webhook.id } }, (outputs) => {
            setOutput(outputs.rows)
        })

        socket.emit('/socket/server', { rest: '/webhook/id/outgoing', data: { api_id:props.webhook.id } }, (outgoings) => {
            setOutgoing(outgoings.rows)
        })

        socket.emit('/socket/server', { rest: '/webhook/id/scheduler', data: { api_id:props.webhook.id } }, (schedulers) => {
            setScheduler(schedulers.rows)
        })
    }, [])

    return (
        <Box style={{ backgroundColor: '#fff' }}>
            <IconButton aria-label="back" onClick={() => props.openScreenView('/view/api', 'API List', [])}>
                <KeyboardBackspaceIcon />
            </IconButton>
            <Box className={classes.category}>
                <Typography variant="h5">API</Typography>
                <Box>
                    <Box>{props.webhook['id']}</Box>
                    <Box>{props.webhook['method']}</Box>
                    <Box>{props.webhook['url']}</Box>
                    <Box>{props.webhook['user_id']}</Box>
                </Box>
            </Box>
            <Box className={classes.category}>
                <Typography variant="h5">Option</Typography>
                <TableContainer component={Box}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">id</TableCell>
                                <TableCell align="right">option</TableCell>
                                <TableCell align="right">keyword</TableCell>
                                <TableCell align="right">value</TableCell>
                                <TableCell align="right">replacekeyword</TableCell>
                                <TableCell align="right">regexpvalue</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {option.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="right">{row['option_id']}</TableCell>
                                    <TableCell align="right">{row['option']}</TableCell>
                                    <TableCell align="right">{row['keyword']}</TableCell>
                                    <TableCell align="right">{row['value']}</TableCell>
                                    <TableCell align="right">{row['replacekeyword']}</TableCell>
                                    <TableCell align="right">{row['regexpvalue']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box className={classes.category}>
                <Typography variant="h5">Output</Typography>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">id</TableCell>
                                <TableCell align="right">keyword</TableCell>
                                <TableCell align="right">value</TableCell>
                                <TableCell align="right">regexpvalue</TableCell>
                                <TableCell align="right">room_id</TableCell>
                                <TableCell align="right">user_id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {output.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="right">{row['output_id']}</TableCell>
                                    <TableCell align="right">{row['keyword']}</TableCell>
                                    <TableCell align="right">{row['value']}</TableCell>
                                    <TableCell align="right">{row['regexpvalue']}</TableCell>
                                    <TableCell align="right">{row['room_id']}</TableCell>
                                    <TableCell align="right">{row['user_id']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box className={classes.category}>
                <Typography variant="h5">Outgoing</Typography>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">id</TableCell>
                                <TableCell align="right">flag</TableCell>
                                <TableCell align="right">regexp</TableCell>
                                <TableCell align="right">room_id</TableCell>
                                <TableCell align="right">user_id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {outgoing.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="right">{row['id']}</TableCell>
                                    <TableCell align="right">{String(row['flag'])}</TableCell>
                                    <TableCell align="right">{row['regexp']}</TableCell>
                                    <TableCell align="right">{row['room_id']}</TableCell>
                                    <TableCell align="right">{row['user_id']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box className={classes.category}>
                <Typography variant="h5">Scheduler</Typography>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">id</TableCell>
                                <TableCell align="right">flag</TableCell>
                                <TableCell align="right">minute</TableCell>
                                <TableCell align="right">hour</TableCell>
                                <TableCell align="right">day</TableCell>
                                <TableCell align="right">month</TableCell>
                                <TableCell align="right">date</TableCell>
                                <TableCell align="right">executeTime</TableCell>
                                <TableCell align="right">room_id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scheduler.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="right">{row['id']}</TableCell>
                                    <TableCell align="right">{String(row['flag'])}</TableCell>
                                    <TableCell align="right">{row['minute']}</TableCell>
                                    <TableCell align="right">{row['hour']}</TableCell>
                                    <TableCell align="right">{row['day']}</TableCell>
                                    <TableCell align="right">{row['month']}</TableCell>
                                    <TableCell align="right">{row['date']}</TableCell>
                                    <TableCell align="right">{row['executetime']}</TableCell>
                                    <TableCell align="right">{row['room_id']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

// チャットルーム一部屋分の画面レイアウト
const RestAPIView = (props) => {
    const [restAPI, setRestAPI] = useState([]);
    const { account, socket } = useContext(StoreContext);
    const classes = useStyles();

    useEffect(()=> {
        socket.emit('/socket/server', { rest: '/user/webhook', data: { user_id:account.id } }, (webhooks) => {
            setRestAPI(webhooks.rows)
        })
    }, [])

    const openAPIDetailView = (row) => {
        props.setPageProps(row)
        props.openScreenView('/view/api/detail', 'API Detail', [])
    }

    return (
        <Box style={{ backgroundColor: '#fff' }}>
            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">id</TableCell>
                            <TableCell align="right">method</TableCell>
                            <TableCell align="right">url</TableCell>
                            <TableCell align="right">user</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {restAPI.map((row, index) => (
                            <TableRow className={classes.tableRow} key={index} onClick={() => openAPIDetailView(row)}>
                                <TableCell align="right">{row['id']}</TableCell>
                                <TableCell align="right">{row['method']}</TableCell>
                                <TableCell align="right">{row['url']}</TableCell>
                                <TableCell align="right">{row['user_id']}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default RestAPIView
export { RestAPIDetailView }