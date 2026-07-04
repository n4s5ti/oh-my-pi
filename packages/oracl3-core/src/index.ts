export type RuntimeId = "omp" | "hermes" | "codex" | "claude-code" | (string & {});

export interface SourceLocation {
	readonly file?: string;
	readonly line?: number;
	readonly column?: number;
	readonly endLine?: number;
	readonly endColumn?: number;
}

export interface RuntimeEventBase {
	readonly runtimeId: RuntimeId;
	readonly sessionId?: string;
	readonly timestamp?: string;
	readonly source?: SourceLocation;
}

export type RuntimeEvent =
	| (RuntimeEventBase & { readonly type: "session_start"; readonly sessionId: string })
	| (RuntimeEventBase & { readonly type: "session_end"; readonly sessionId: string })
	| (RuntimeEventBase & { readonly type: "user_message"; readonly text: string })
	| (RuntimeEventBase & { readonly type: "model_token"; readonly text: string })
	| (RuntimeEventBase & { readonly type: "model_message"; readonly text: string })
	| (RuntimeEventBase & { readonly type: "tool_call"; readonly name: string; readonly args: unknown })
	| (RuntimeEventBase & { readonly type: "tool_result"; readonly name: string; readonly result: unknown })
	| (RuntimeEventBase & { readonly type: "file_read"; readonly path: string })
	| (RuntimeEventBase & { readonly type: "write_intent"; readonly path: string; readonly reason?: string })
	| (RuntimeEventBase & { readonly type: "error"; readonly message: string });

export type RuntimeEventSource = AsyncIterable<RuntimeEvent>;

export type AdviceSeverity = "info" | "warn" | "violation";

export interface Advice {
	readonly severity: AdviceSeverity;
	readonly summary: string;
	readonly evidence: readonly string[];
	readonly recommendation: string;
	readonly citations?: readonly string[];
	readonly source?: SourceLocation;
	readonly ruleId?: string;
}

export interface ViolationCandidate {
	readonly summary: string;
	readonly evidence: readonly string[];
	readonly ruleId?: string;
	readonly source?: SourceLocation;
}

export interface ResearchRequest {
	readonly id: string;
	readonly query: string;
	readonly context?: readonly RuntimeEvent[];
}

export interface ResearchResult {
	readonly requestId: string;
	readonly findings: readonly string[];
	readonly citations: readonly string[];
}

export interface RuntimeAdapterSubscribeOptions {
	readonly sessionId?: string;
	readonly signal?: AbortSignal;
}

export interface RuntimeAdapter {
	readonly runtimeId: RuntimeId;
	readonly name: string;
	subscribe(options?: RuntimeAdapterSubscribeOptions): RuntimeEventSource;
	dispose?(): void | Promise<void>;
}

export function isViolationAdvice(advice: Advice): advice is Advice & { readonly severity: "violation" } {
	return advice.severity === "violation";
}
