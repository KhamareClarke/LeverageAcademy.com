interface SmsOptions {
  studentId: string
  alertType: string
  variables: Record<string, string>
  metadata: Record<string, string>
}

export async function sendGhlSms(_opts: SmsOptions): Promise<void> {}
