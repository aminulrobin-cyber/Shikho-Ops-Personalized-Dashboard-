"use client";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "../actions";

export default function Register() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const handleReg = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const n = fd.get("fN").trim();
    const p = fd.get("fP").trim();
    const emp = fd.get("fE").trim();

    if (!n) return setError("Full Name is required.");
    if (!emp) return setError("Employee ID is required.");

    setLoading(true);
    setError("");
    setOk("");
    try {
      await registerUser(n, p, emp);
      setOk("✅ Profile created! Redirecting…");
      setTimeout(() => router.push("/"), 1600);
    } catch (err) {
      setError(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  if (!session) {
    return (
      <div className="reg-wrapper">
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <h2>Welcome to Shikho Ops</h2>
          <p>You must be logged in to access the control center.</p>
          <button
            className="btn"
            onClick={() => signIn("google", { callbackUrl: "/register" })}
            style={{ marginTop: "20px" }}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-wrapper">
      <div className="card">
        <div className="hd">
          <div className="brand">
            <div className="bico">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="bname">Shikho</div>
              <div className="bsub">Ops Control Center</div>
            </div>
          </div>
          <h1>Create Your Profile</h1>
          <p>Welcome to Shikho Ops! Register to access the team dashboard.</p>
        </div>
        <div className="accent-bar"></div>
        <form className="bd" onSubmit={handleReg}>
          <div className="field">
            <label>Google Account</label>
            <div className="email-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
              </svg>
              <span>{session?.user?.email || "Loading…"}</span>
            </div>
          </div>
          <div className="field">
            <label>Full Name *</label>
            <input
              name="fN"
              type="text"
              placeholder="e.g. Mehedi Hasan"
              maxLength="80"
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input
              name="fP"
              type="tel"
              placeholder="e.g. 01XXXXXXXXX"
              maxLength="20"
            />
          </div>
          <div className="field">
            <label>Employee ID *</label>
            <input
              name="fE"
              type="text"
              placeholder="e.g. SHK-001"
              maxLength="30"
            />
          </div>
          
          {error && <div className="msg err show">⚠ {error}</div>}
          {ok && <div className="msg ok show">{ok}</div>}
          
          <button className="btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spin">⟳</span> Creating…
              </>
            ) : (
              "Create Profile & Enter Dashboard"
            )}
          </button>
          <div className="note">
            Your data is stored securely in Shikho Google Workspace.
          </div>
        </form>
      </div>
    </div>
  );
}
