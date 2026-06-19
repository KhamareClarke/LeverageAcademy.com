interface NotificationOptions {
  studentId: string
  type: string
  title: string
  message: string
  relatedId: string
  relatedKind: string
  linkUrl: string
  dedupe: boolean
}

export async function createNotification(_opts: NotificationOptions): Promise<void> {}
