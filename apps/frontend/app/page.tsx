"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast";
import { getLatestRuns, runScenario } from "@/lib/api";

type FormValues = {
  type: string;
  name?: string;
};

export default function Home() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{
    tone: "success" | "error";
    title: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const runsQuery = useQuery({
    queryKey: ["scenario-runs"],
    queryFn: getLatestRuns,
    refetchInterval: 8_000,
  });

  const mutation = useMutation({
    mutationFn: runScenario,
    retry: false,
    onSuccess: (res, variables) => {
      setToast({
        tone: "success",
        title: `${variables.type} completed`,
        description: `Run ${res.id} finished in ${res.duration}ms`,
      });
      void queryClient.invalidateQueries({ queryKey: ["scenario-runs"] });
    },
    onError: (error) => {
      setToast({
        tone: "error",
        title: "Scenario failed",
        description:
          error instanceof Error ? error.message : "Unknown request error",
      });
      void queryClient.invalidateQueries({ queryKey: ["scenario-runs"] });
    },
  });

  const form = useForm<FormValues>({
    defaultValues: { type: "success", name: "" },
  });

  function statusVariant(status: string): "success" | "warning" | "error" | "default" {
    if (status === "completed") return "success";
    if (status === "teapot") return "warning";
    if (status === "failed") return "error";
    return "default";
  }

  return (
    <div className="bg-zinc-50 dark:bg-black">
      {toast ? (
        <Toast tone={toast.tone} title={toast.title} description={toast.description} />
      ) : null}
      <div className="max-w-4xl mx-auto px-6 py-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Run scenario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <form
              className="space-y-3"
              onSubmit={form.handleSubmit(async (values) => {
                try {
                  await mutation.mutateAsync({
                    type: values.type,
                    name: values.name?.trim() || undefined,
                  });
                  form.reset({ ...values, name: "" });
                } catch {
                  // Expected error scenarios are shown through the mutation onError toast.
                }
              })}
            >
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Scenario type
                </label>
                <Select {...form.register("type")} disabled={mutation.isPending}>
                  <option value="success">success</option>
                  <option value="validation_error">validation_error</option>
                  <option value="system_error">system_error</option>
                  <option value="slow_request">slow_request</option>
                  <option value="teapot">teapot</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Name (optional)
                </label>
                <Input
                  placeholder="local smoke run"
                  {...form.register("name")}
                  disabled={mutation.isPending}
                />
              </div>

              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Running..." : "Run Scenario"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Run history (latest 20)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {runsQuery.isPending ? (
              <p className="text-sm text-zinc-600">Loading history...</p>
            ) : runsQuery.isError ? (
              <p className="text-sm text-red-600">
                Failed to load history. Refresh or check backend availability.
              </p>
            ) : (runsQuery.data?.length ?? 0) === 0 ? (
              <p className="text-sm text-zinc-500">No runs yet. Trigger one from the form.</p>
            ) : (
              <div className="space-y-2">
                {runsQuery.data?.map((run) => (
                  <div
                    key={run.id}
                    className="rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{run.type}</div>
                      <div className="text-xs text-zinc-500 truncate">
                        {new Date(run.createdAt).toLocaleString()} • {run.id}
                      </div>
                      {run.error ? (
                        <div className="text-xs text-red-600 mt-1 truncate">{run.error}</div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={statusVariant(run.status)}>{run.status}</Badge>
                      <span className="text-xs text-zinc-600 dark:text-zinc-300">
                        {run.duration ?? 0}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Observability links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <a className="underline text-zinc-800 dark:text-zinc-200" href="http://localhost:3000/grafana" target="_blank" rel="noreferrer">
              Grafana: http://localhost:3000/grafana
            </a>
            <a className="underline text-zinc-800 dark:text-zinc-200" href="http://localhost:3100/loki/api/v1/labels" target="_blank" rel="noreferrer">
              Loki API labels: http://localhost:3100/loki/api/v1/labels
            </a>
            <a className="underline text-zinc-800 dark:text-zinc-200" href="http://localhost:3001/metrics" target="_blank" rel="noreferrer">
              Prometheus metrics endpoint: http://localhost:3001/metrics
            </a>
            <p className="text-zinc-600 dark:text-zinc-400">
              Sentry: open your configured project and filter by the system_error message.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
