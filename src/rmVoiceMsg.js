import { unlink } from 'fs/promises'

export async function removeFile(path) {
  try {
    await unlink(path)
  } catch (e) {
    console.log('Ошибка при удалении файла с голосовым сообщением: ', e.message)
  }
}
