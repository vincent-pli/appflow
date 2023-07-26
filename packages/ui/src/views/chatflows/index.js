import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// material-ui
import { Grid, Box, Stack, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import ItemCard from 'ui-component/cards/ItemCard'
import { gridSpacing } from 'store/constant'
import WorkflowEmptySVG from 'assets/images/workflow_empty.svg'
import { StyledButton } from 'ui-component/button/StyledButton'
import LoginDialog from 'ui-component/dialog/LoginDialog'
import OutputIcon from '@mui/icons-material/Output'
import IconButton from '@mui/material/IconButton'
import CardActions from '@mui/material/CardActions'
import Tooltip from '@mui/material/Tooltip'
import { REMOVE_DIRTY, enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'
import { useDispatch } from 'react-redux'

// API
import chatflowsApi from 'api/chatflows'

// Hooks
import useApi from 'hooks/useApi'

// const
import { baseURL } from 'store/constant'

// icons
import { IconPlus, IconX } from '@tabler/icons'

// utils
import useNotifier from 'utils/useNotifier'

// ==============================|| CHATFLOWS ||============================== //

const Chatflows = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [isLoading, setLoading] = useState(true)
    const [images, setImages] = useState({})
    const [trigger, setTrigger] = useState(true)
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [loginDialogProps, setLoginDialogProps] = useState({})

    const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows)
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)

    const dispatch = useDispatch()
    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const onLoginClick = (username, password) => {
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        navigate(0)
    }

    const addNew = () => {
        navigate('/canvas')
    }

    const goToCanvas = (selectedChatflow) => {
        navigate(`/canvas/${selectedChatflow.id}`)
    }

    const submitExport = (data) => {
        console.log(data)
        if (data.id) {
            const updateBody = {
                exported: true,
                deleted: false
            }
            updateChatflowApi.request(data.id, updateBody)
        }
    }

    const exportChatflowSuccess = () => {
        dispatch({ type: REMOVE_DIRTY })
        enqueueSnackbar({
            message: '已成功导入到‘我的应用’',
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    useEffect(() => {
        if (updateChatflowApi.data) {
            setTrigger(!trigger)
            exportChatflowSuccess()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateChatflowApi.data])

    useEffect(() => {
        getAllChatflowsApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger])

    useEffect(() => {
        if (getAllChatflowsApi.error) {
            if (getAllChatflowsApi.error?.response?.status === 401) {
                setLoginDialogProps({
                    title: 'Login',
                    confirmButtonName: 'Login'
                })
                setLoginDialogOpen(true)
            }
        }
    }, [getAllChatflowsApi.error])

    useEffect(() => {
        setLoading(getAllChatflowsApi.loading)
    }, [getAllChatflowsApi.loading])

    useEffect(() => {
        if (getAllChatflowsApi.data) {
            try {
                const chatflows = getAllChatflowsApi.data
                const images = {}
                for (let i = 0; i < chatflows.length; i += 1) {
                    const flowDataStr = chatflows[i].flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[chatflows[i].id] = []
                    for (let j = 0; j < nodes.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                        if (!images[chatflows[i].id].includes(imageSrc)) {
                            images[chatflows[i].id].push(imageSrc)
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllChatflowsApi.data])

    return (
        <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
            <Stack flexDirection='row'>
                <h1>应用定制</h1>
                <Grid sx={{ mb: 1.25 }} container direction='row' width={'80%'}>
                    <Box sx={{ flexGrow: 1 }} />
                    <Grid item>
                        <StyledButton variant='contained' sx={{ color: 'white' }} onClick={addNew} startIcon={<IconPlus />}>
                            添加
                        </StyledButton>
                    </Grid>
                </Grid>
            </Stack>
            <Grid container spacing={gridSpacing}>
                {!isLoading &&
                    getAllChatflowsApi.data &&
                    getAllChatflowsApi.data.map((data, index) => (
                        <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                            <ItemCard onClick={() => goToCanvas(data)} data={data} images={images[data.id]} />
                            <CardActions>
                                <Tooltip title='导出到"我的应用"'>
                                    <IconButton
                                        color='primary'
                                        aria-label='导出到"我的应用"'
                                        onClick={() => submitExport(data)}
                                        disabled={data.exported}
                                    >
                                        <OutputIcon />
                                    </IconButton>
                                </Tooltip>
                            </CardActions>
                        </Grid>
                    ))}
            </Grid>
            {!isLoading && (!getAllChatflowsApi.data || getAllChatflowsApi.data.length === 0) && (
                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                    <Box sx={{ p: 2, height: 'auto' }}>
                        <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WorkflowEmptySVG} alt='WorkflowEmptySVG' />
                    </Box>
                    <div>No Chatflows Yet</div>
                </Stack>
            )}
            <LoginDialog show={loginDialogOpen} dialogProps={loginDialogProps} onConfirm={onLoginClick} />
        </MainCard>
    )
}

export default Chatflows
