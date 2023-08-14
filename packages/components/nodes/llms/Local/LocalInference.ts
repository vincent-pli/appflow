import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { LocalInput, LocalInference } from './core'

class Local_LLMs implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'Local Inference'
        this.name = 'local_LLMs'
        this.version = 1.0
        this.type = 'LocalInference'
        this.icon = 'local.png'
        this.category = 'LLMs'
        this.description = 'Wrapper around local large language models'
        this.baseClasses = [this.type, ...getBaseClasses(LocalInference)]
        this.inputs = [
            {
                label: 'Model',
                name: 'model',
                type: 'string',
                description: 'If using own inference endpoint, leave this blank',
                placeholder: 'gpt2',
                optional: true
            },
            {
                label: 'Endpoint',
                name: 'endpoint',
                type: 'string',
                placeholder: ' http://127.0.0.1:8000/gpt2/run/predict',
                description: 'Using your own inference endpoint',
                optional: false
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                description: 'Temperature parameter may not apply to certain model. Please check available model parameters',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                description: 'Max Tokens parameter may not apply to certain model. Please check available model parameters',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top Probability',
                name: 'topP',
                type: 'number',
                description: 'Top Probability parameter may not apply to certain model. Please check available model parameters',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top K',
                name: 'hfTopK',
                type: 'number',
                description: 'Top K parameter may not apply to certain model. Please check available model parameters',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Frequency Penalty',
                name: 'frequencyPenalty',
                type: 'number',
                description: 'Frequency Penalty parameter may not apply to certain model. Please check available model parameters',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const model = nodeData.inputs?.model as string
        const temperature = nodeData.inputs?.temperature as string
        const maxTokens = nodeData.inputs?.maxTokens as string
        const topP = nodeData.inputs?.topP as string
        const hfTopK = nodeData.inputs?.hfTopK as string
        const frequencyPenalty = nodeData.inputs?.frequencyPenalty as string
        const endpoint = nodeData.inputs?.endpoint as string

        const obj: Partial<LocalInput> = {
            model,
            endpoint
        }

        if (temperature) obj.temperature = parseFloat(temperature)
        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (topP) obj.topP = parseFloat(topP)
        if (hfTopK) obj.topK = parseFloat(hfTopK)
        if (frequencyPenalty) obj.frequencyPenalty = parseFloat(frequencyPenalty)
        if (endpoint) obj.endpoint = endpoint

        const local = new LocalInference(obj)
        return local
    }
}

module.exports = { nodeClass: Local_LLMs }
