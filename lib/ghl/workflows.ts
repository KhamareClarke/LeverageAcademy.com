interface WorkflowOptions {
  workflowKey: string
  studentId: string
  variables: Record<string, string>
  metadata: Record<string, string>
}

export async function runWorkflow(_opts: WorkflowOptions): Promise<void> {}
