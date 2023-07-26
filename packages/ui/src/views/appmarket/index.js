import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// material-ui
import { Grid, Box, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import ItemCard from 'ui-component/cards/ItemCard'
import { gridSpacing } from 'store/constant'
import WorkflowEmptySVG from 'assets/images/workflow_empty.svg'

// API
import appmarketApi from 'api/appmarket'

// Hooks
import useApi from 'hooks/useApi'

// const
import { baseURL } from 'store/constant'

// ==============================|| Appmarket ||============================== //

const Appmarket = () => {
    const navigate = useNavigate()

    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [isLoading, setLoading] = useState(false)
    const [images, setImages] = useState({})

    const getAllAppmarketApi = useApi(appmarketApi.getAllAppmarket)

    const goToCanvas = (selectedChatflow) => {
        navigate(`/appmarket/${selectedChatflow.id}`, { state: selectedChatflow })
    }

    useEffect(() => {
        getAllAppmarketApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllAppmarketApi.loading)
    }, [getAllAppmarketApi.loading])

    useEffect(() => {
        // console.log(getAllAppmarketApi)
        if (getAllAppmarketApi.data) {
            try {
                const chatflows = getAllAppmarketApi.data
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
    }, [getAllAppmarketApi.data])

    return (
        <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
            <Stack flexDirection='row'>
                <h1>应用市场</h1>
            </Stack>
            <Grid container spacing={gridSpacing}>
                {!isLoading &&
                    getAllAppmarketApi.data &&
                    getAllAppmarketApi.data.map((data, index) => (
                        <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                            <ItemCard onClick={() => goToCanvas(data)} data={data} images={images[data.id]} />
                        </Grid>
                    ))}
            </Grid>
            {!isLoading && (!getAllAppmarketApi.data || getAllAppmarketApi.data.length === 0) && (
                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                    <Box sx={{ p: 2, height: 'auto' }}>
                        <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WorkflowEmptySVG} alt='WorkflowEmptySVG' />
                    </Box>
                    <div>No Applications Yet</div>
                </Stack>
            )}
        </MainCard>
    )
}

export default Appmarket
