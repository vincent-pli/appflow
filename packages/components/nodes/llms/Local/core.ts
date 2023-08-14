import { LLM, BaseLLMParams } from 'langchain/llms/base'
import fetch from "node-fetch"

export interface LocalInput {
    /** Model to use */
    model: string

    /** Sampling temperature to use */
    temperature?: number

    /**
     * Maximum number of tokens to generate in the completion.
     */
    maxTokens?: number

    /** Total probability mass of tokens to consider at each step */
    topP?: number

    /** Integer to define the top tokens considered within the sample operation to create new text. */
    topK?: number

    /** Penalizes repeated tokens according to frequency */
    frequencyPenalty?: number

    /** API key to use. */
    apiKey?: string

    /** Private endpoint to use. */
    endpoint: string
}

export class LocalInference extends LLM implements LocalInput {
    get lc_secrets(): { [key: string]: string } | undefined {
        return {
            apiKey: 'HUGGINGFACEHUB_API_KEY'
        }
    }

    model = 'gpt2'

    temperature: number | undefined = undefined

    maxTokens: number | undefined = undefined

    topP: number | undefined = undefined

    topK: number | undefined = undefined

    frequencyPenalty: number | undefined = undefined

    apiKey: string | undefined = undefined

    endpoint = 'http://127.0.0.1:8000/gpt2/run/predict'

    constructor(fields?: Partial<LocalInput> & BaseLLMParams) {
        super(fields ?? {})

        this.model = fields?.model ?? this.model
        this.temperature = fields?.temperature ?? this.temperature
        this.maxTokens = fields?.maxTokens ?? this.maxTokens
        this.topP = fields?.topP ?? this.topP
        this.topK = fields?.topK ?? this.topK
        this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty
        this.endpoint = fields?.endpoint ?? ''
    }

    _llmType() {
        return 'local'
    }

    /** @ignore */
    async _call(prompt: string, options: this['ParsedCallOptions']): Promise<string> {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            body: JSON.stringify({
                data: [ prompt ],
            }),
            headers: {'Content-Type': 'application/json; charset=UTF-8'} });
          
          if (!response.ok) { 
            throw new Error(`Error! status: ${response.status}`);
           }
          
          // If you care about a response:
          const result = (await response.json())
          console.log('result is: ', JSON.stringify(result, null, 4));
          return result['data'][0];
    }
}
