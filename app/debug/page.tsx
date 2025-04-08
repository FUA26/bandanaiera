"use client";

import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {credentials: "include"});

  console.log("🔎 Fetched:", res.status);

  return res.json();
};

export default function DebugPage() {
  const {data, error} = useSWR("/api/me", fetcher);

  console.log("🔁 data:", data);
  console.log("⛔ error:", error);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
