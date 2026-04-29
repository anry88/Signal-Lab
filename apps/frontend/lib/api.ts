export type HealthResponse = {
  status: "ok";
  timestamp: string;
};

export type ScenarioRunResponse = {
  id: string;
  status: string;
  duration: number;
};

export type ScenarioRunHistoryItem = {
  id: string;
  type: string;
  status: string;
  duration: number | null;
  error: string | null;
  createdAt: string;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BACKEND_URL}/api/health`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Health request failed: ${res.status} ${text}`.trim());
  }

  return res.json();
}

export async function runScenario(args: {
  type: string;
  name?: string;
}): Promise<ScenarioRunResponse> {
  const res = await fetch(`${BACKEND_URL}/api/scenarios/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Run scenario failed: ${res.status} ${text}`.trim());
  }

  return res.json();
}

export async function getLatestRuns(): Promise<ScenarioRunHistoryItem[]> {
  const res = await fetch(`${BACKEND_URL}/api/scenarios/runs?limit=20`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Runs request failed: ${res.status} ${text}`.trim());
  }

  return res.json();
}
