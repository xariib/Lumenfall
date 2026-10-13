# Shared startup budget correction

The final shared-document review found that checkpoint018a5f1 increased the
shared startup by74 bytes. The Guidance gate passed at32656 bytes, but existing
Forge and Shared gates exceeded32768. The actual read-only tool observation is
preserved in failure-observation.json. This is an introduced documentation
regression; no gameplay test or CI result is replaced or retried.

Only the current project-status header is shortened. All facts, original
historical evidence, task requirements and the32768-byte limit are retained.
The actual six relevant task-context checks are captured below with separate
stdout/stderr/process receipts. Product/test/assets/workflow bytes remain equal
to accepted354e19ff. The earlier plain-text evidence package stays immutable;
its Guidance-only32656-byte observation remains historical, not a claim about
this corrected document version. Native acceptance and main/APK holds remain.
