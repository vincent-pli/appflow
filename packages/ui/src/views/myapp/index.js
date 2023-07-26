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
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
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

// utils
import useNotifier from 'utils/useNotifier'

// icons
import { IconX } from '@tabler/icons'

// ==============================|| Marketplace ||============================== //

const Marketplace = () => {
    const navigate = useNavigate()

    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [isLoading, setLoading] = useState(false)
    const [images, setImages] = useState({})
    const [trigger, setTrigger] = useState(true)
    const [exportedApps, setexportedApps] = useState({})

    // const getAllMarketplacesApi = useApi(marketplacesApi.getAllMarketplaces)
    const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows)
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)
    const deleteChatflowApi = useApi(chatflowsApi.updateChatflow)

    const dispatch = useDispatch()
    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const goToCanvas = (selectedChatflow) => {
        navigate(`/marketplace/${selectedChatflow.id}`, { state: selectedChatflow })
    }

    const submitDeploy = (data) => {
        console.log(data)
        if (data.id) {
            const updateBody = {
                deployed: true
            }
            updateChatflowApi.request(data.id, updateBody)
        }
    }

    const deleteDeploy = (data) => {
        console.log(data)
        if (data.id) {
            const updateBody = {
                deleted: true,
                deployed: false,
                exported: false
            }
            deleteChatflowApi.request(data.id, updateBody)
        }
    }

    const deployChatflowSuccess = () => {
        dispatch({ type: REMOVE_DIRTY })
        enqueueSnackbar({
            message: '应用成功部署',
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

    const deleteChatflowSuccess = () => {
        dispatch({ type: REMOVE_DIRTY })
        enqueueSnackbar({
            message: '应用部署成功删除',
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
            deployChatflowSuccess()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateChatflowApi.data])

    useEffect(() => {
        if (deleteChatflowApi.data) {
            setTrigger(!trigger)
            deleteChatflowSuccess()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteChatflowApi.data])

    useEffect(() => {
        getAllChatflowsApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger])

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

    useEffect(() => {
        if (getAllChatflowsApi.data) {
            try {
                const chatflows = getAllChatflowsApi.data
                const apps = []
                for (let i = 0; i < chatflows.length; i += 1) {
                    if (chatflows[i].exported && !chatflows[i].deleted) {
                        apps.push(chatflows[i])
                    }
                }
                setexportedApps(apps)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllChatflowsApi.data])

    return (
        <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
            <Stack flexDirection='row'>
                <h1>我的应用</h1>
            </Stack>
            <Grid container spacing={gridSpacing}>
                {!isLoading &&
                    getAllChatflowsApi.data &&
                    exportedApps.map((data, index) => (
                        <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                            <ItemCard data={data} images={images[data.id]} />
                            <CardActions>
                                <Tooltip title='部署应用'>
                                    <IconButton
                                        color='primary'
                                        aria-label='部署应用'
                                        onClick={() => submitDeploy(data)}
                                        disabled={data.deployed}
                                    >
                                        <RocketLaunchIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='部署应用'>
                                    <IconButton
                                        color='primary'
                                        aria-label='部署应用'
                                        onClick={() => deleteDeploy(data)}
                                        // disabled={data.deployed}
                                    >
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
                            </CardActions>
                        </Grid>
                    ))}
            </Grid>
            {console.log(getAllChatflowsApi.data)}
            {!isLoading && (!getAllChatflowsApi.data || exportedApps.length === 0) && (
                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                    <Box sx={{ p: 2, height: 'auto' }}>
                        <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WorkflowEmptySVG} alt='WorkflowEmptySVG' />
                    </Box>
                    <div>还没有“应用”</div>
                </Stack>
            )}
        </MainCard>
    )
}

export default Marketplace
