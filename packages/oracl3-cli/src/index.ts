import type { AdviceSeverity } from "@oracl3/core";

export const PLANNED_COMMANDS = ["watch", "advise", "research", "inspect-stream", "policy-check", "doctor"] as const;

export type PlannedCommand = (typeof PLANNED_COMMANDS)[number];
export type CliDiagnostic = {
	readonly severity: AdviceSeverity;
	readonly message: string;
};

export function printHelp(): void {
	console.log(`oracl3 — headless advisory sidecar CLI

Usage: oracl3 <command> [options]

Commands:
  watch             Observe automation state stream
  advise            Request actionable runtime guidance
  research          Run a read-only research query
  inspect-stream    Introspect the current automation event stream
  policy-check      Validate automation rules against policy
  doctor            Diagnose automation health and connectivity

Options:
  --help, -h        Show this help message
  --version, -v     Print version and exit

Run 'oracl3 <command> --help' for command-specific help.
`);
}

export function runCli(argv: string[] = process.argv.slice(2)): void {
	const [command] = argv;

	if (!command || command === "--help" || command === "-h") {
		printHelp();
		return;
	}

	if (command === "--version" || command === "-v") {
		console.log("oracl3 v0.1.0");
		return;
	}

	if (PLANNED_COMMANDS.includes(command as PlannedCommand)) {
		console.log(`oracl3: '${command}' is recognized but not yet implemented.`);
		return;
	}

	console.error(`oracl3: unknown command '${command}'. Use --help to see available commands.`);
	process.exit(1);
}
