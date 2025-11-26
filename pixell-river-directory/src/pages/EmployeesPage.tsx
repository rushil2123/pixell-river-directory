import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import * as employeesRepo from "../repositories/employeeRepo";
import type { DepartmentGroup } from "../types";
import "../pages/EmployeesPage.css"

export default function EmployeesPage() {
  const { getToken } = useAuth();
  const [groups, setGroups] = useState<DepartmentGroup[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const lastAddedRef = useRef<{ name: string; department: string } | null>(
    null
  );

  const refresh = async (term?: string) => {
    setLoading(true);
    setErr(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const data = await employeesRepo.listEmployees(token, term);
      setGroups(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  const debouncedSearch = useMemo(() => {
    let t: number | undefined;
    return (term: string) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        refresh(term);
      }, 300);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const department = String(form.get("department") || "").trim();
    if (!name || !department) return;

    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      await employeesRepo.addEmployee(token, { name, department });
      (e.currentTarget as HTMLFormElement).reset();

      setSearch("");
      lastAddedRef.current = { name, department };
      await refresh();
      window.setTimeout(() => {
        lastAddedRef.current = null;
      }, 1500);
    } catch (error: any) {
      alert(error?.message || "Failed to add employee");
    }
  };

  return (
    <div>
      {/* Toolbar / Search */}
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search employees or departments"
          value={search}
          onChange={(e) => {
            const term = e.target.value;
            setSearch(term);
            debouncedSearch(term);
          }}
        />
      </div>

      {/* Add Form */}
      <form className="form" onSubmit={onSubmit}>
        <input className="input" name="name" placeholder="Full name" />
        <input className="input" name="department" placeholder="Department" />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>

      {err ? <p className="error">{err}</p> : null}
      {loading ? <p>Loading…</p> : null}

      {/* Directory grid */}
      <div className="directory">
        {groups.map((g) => (
          <section className="dept-card" key={g.id}>
            <h4>
              {g.department}
              <span className="count">{g.employees.length}</span>
            </h4>
            <ul>
              {g.employees.map((n, i) => {
                const shouldFlash =
                  lastAddedRef.current &&
                  lastAddedRef.current.department === g.department &&
                  lastAddedRef.current.name === n;

                return (
                  <li className={shouldFlash ? "flash" : ""} key={`${g.id}:${i}`}>
                    {n}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
