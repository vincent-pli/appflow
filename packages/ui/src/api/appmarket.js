import client from './client'

const getAllAppmarket = () => client.get('/appmarket')

export default {
    getAllAppmarket
}
