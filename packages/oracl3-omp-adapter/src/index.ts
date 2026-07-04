import type { RuntimeAdapter, RuntimeAdapterSubscribeOptions, RuntimeEvent, RuntimeEventSource } from "@oracl3/core";

export const OMP_RUNTIME_ID = "omp" as const;

export interface OmpRuntimeAdapterOptions {
	readonly name?: string;
	readonly source: RuntimeEventSource;
}

export function createOmpRuntimeAdapter(options: OmpRuntimeAdapterOptions): RuntimeAdapter {
	return {
		runtimeId: OMP_RUNTIME_ID,
		name: options.name ?? "OMP runtime stream",
		subscribe(subscribeOptions?: RuntimeAdapterSubscribeOptions): RuntimeEventSource {
			return filterEventsBySession(options.source, subscribeOptions?.sessionId);
		},
	};
}

export async function* createAsyncIterableRuntimeEventSource(
	events: AsyncIterable<RuntimeEvent> | Iterable<RuntimeEvent>,
): RuntimeEventSource {
	for await (const event of events) {
		yield event;
	}
}

export function createIterableRuntimeEventSource(events: Iterable<RuntimeEvent>): RuntimeEventSource {
	return createAsyncIterableRuntimeEventSource(events);
}

async function* filterEventsBySession(source: RuntimeEventSource, sessionId?: string): RuntimeEventSource {
	for await (const event of source) {
		if (!sessionId || event.sessionId === sessionId) {
			yield event;
		}
	}
}
