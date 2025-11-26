// src/pages/OrganizationPage.tsx
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import * as orgRepo from "../repositories/orgRepo";
import type { OrgRole } from "../types";

export default function OrganizationPage() {
  const { getToken } = useAuth();

  const [roles, setRoles] = useState<OrgRole[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // For flash effect on newly added role
  const lastAddedRef = useRef<{ title: string } | null>(null);

  const refresh = async (term?: string) => {
    setLoading(true);
    setErr(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const data = await orgRepo.listRoles(token, term);
      setRoles(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load organization roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const title = String(form.get("title") || "").trim();
    const person = String(form.get("person") || "").trim();
    const description = String(form.get("description") || "").trim();

    if (!title) return;

    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      await orgRepo.addRole(token, { title, person, description });
      (e.currentTarget as HTMLFormElement).reset();

      // Clear search so the new role is visible and refresh list
      setSearch("");
      lastAddedRef.current = { title };
      await refresh();

      // Clear flash marker after a bit
      window.setTimeout(() => {
        lastAddedRef.current = null;
      }, 1500);
    } catch (error: any) {
      alert(error?.message || "Failed to add role");
    }
  };

  const handleSearchChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const term = e.target.value;
    setSearch(term);
    await refresh(term);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search by title or person"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Add Role Form */}
      <form className="form" onSubmit={onSubmit}>
        <input className="input" name="title" placeholder="Role title" />
        <input className="input" name="person" placeholder="Assigned person (optional)" />
        <input className="input" name="description" placeholder="Description (optional)" />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>

      {err && <p className="error">{err}</p>}
      {loading && <p>Loading...</p>}

      {/* Roles grid */}
      <div className="directory roles-grid">
        {roles.map((r) => {
          const shouldFlash =
            lastAddedRef.current && lastAddedRef.current.title === r.title;

          return (
            <details
              key={r.id}
              className={`role-details ${shouldFlash ? "flash" : ""}`}
            >
              <summary>
                <strong>{r.title}</strong>
                {r.person ? ` — ${r.person}` : ""}
              </summary>
              <div className="role-body">
                {r.description ? (
                  <p>{r.description}</p>
                ) : (
                  <p style={{ fontStyle: "italic", color: "#777" }}>
                    No description provided.
                  </p>
                )}
                <small style={{ color: "#888" }}>
                  Created on {new Date(r.createdAt).toLocaleDateString()}
                </small>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
