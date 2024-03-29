import { Configuration, OpenAIApi } from 'openai'
import config from 'config'
import { createReadStream } from 'fs'

class OpenAI {
  roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system',
  }

  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    })
    this.openai = new OpenAIApi(configuration)
  }

  async chat(messages) {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      },
      {
        timeout: 180000,
        timeoutErrorMessage: 'Timeout error 180 000',
      })
      return response.data.choices[0].message
    } catch (e) {
      console.log('Ошибка на сервере OpenAI: ', e.message)
    }
  }

  async transcription(filepath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filepath),
        'whisper-1'
      )
      return response.data.text
    } catch (e) {
      console.log('Ошибка при распознании голосового сообщения: ', e.message)
    }
  }
}

export const openai = new OpenAI(config.get('OPENAI_KEY'))
