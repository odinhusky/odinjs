export interface ToastQueueMessage {
  severity?: string
  summary?: string
  detail?: string
  life?: number
  group?: string
  closable?: boolean
  sticky?: boolean
}

const TOAST_QUEUE_STATE_KEY = "r017-toast-queue"

export function useToastQueue() {
  const queue = useState<ToastQueueMessage[]>(TOAST_QUEUE_STATE_KEY, () => [])

  const pushToast = (message: ToastQueueMessage) => {
    queue.value.push(message)
  }

  const clearToasts = () => {
    queue.value = []
  }

  return {
    queue,
    pushToast,
    clearToasts
  }
}
