"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { startShift, endShift, getDashboardData, getCalendarEvents } from "./actions";

// ── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <>
      <style>{`
        @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
        .sk{background:linear-gradient(90deg,#e8ecf4 25%,#f5f7fc 50%,#e8ecf4 75%);background-size:600px 100%;animation:shimmer 1.4s infinite;border-radius:8px}
        .sk-nav{height:62px;background:linear-gradient(135deg,#304090,#1B2856);display:flex;align-items:center;justify-content:space-between;padding:0 22px;box-shadow:0 3px 16px rgba(48,64,144,.22)}
        .sk-nav-l{display:flex;align-items:center;gap:10px}
        .sk-nav-r{display:flex;gap:10px;align-items:center}
        .sk-page{max-width:1200px;margin:0 auto;padding:20px 18px}
        .sk-card{background:#fff;border-radius:14px;border:1px solid #E2E8F0;padding:16px 20px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center}
      `}</style>
      <div className="sk-nav"><div className="sk-nav-l"><div className="sk" style={{width:36,height:36}}/><div className="sk" style={{width:130,height:16}}/></div></div>
      <div className="sk-page">
        <div className="sk" style={{width:300,height:30,marginBottom:20}}/>
        <div className="sk-card"><div className="sk" style={{width:"100%",height:100}}/></div>
        <div className="sk" style={{width:"100%",height:400,borderRadius:14}}/>
      </div>
    </>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState("dash");
  const [shiftOn, setShiftOn] = useState(false);
  const [shiftSec, setShiftSec] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const timerRef = useRef(null);

  // Auth & Data Fetching
  useEffect(() => {
    if (status === "unauthenticated") router.push("/register");
    if (status === "authenticated") {
      loadAllData();
    }
  }, [status, router]);

  async function loadAllData() {
    setLoadingData(true);
    try {
      const dash = await getDashboardData();
      setTasks(dash.tasks || []);
      
      if (session?.accessToken) {
        const cal = await getCalendarEvents(session.accessToken);
        setEvents(cal || []);
      }
    } catch (e) {
      console.error("Data load failed", e);
    } finally {
      setLoadingData(false);
    }
  }

  // Timer logic
  useEffect(() => {
    if (shiftOn) {
      timerRef.current = setInterval(() => setShiftSec(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [shiftOn]);

  if (status === "loading" || !session) return <SkeletonLoader />;

  const userName = session.user?.name || "User";
  const userAv = userName.charAt(0).toUpperCase();

  return (
    <>
      <nav className="nav">
        <div className="nav-in">
          <div className="nav-brand">
            <div className="nav-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div className="nav-text"><b>Shikho</b><span>Operations Control Center</span></div>
          </div>
          <div className="nav-right">
            <div className="nav-chip"><span className="dot"></span>0/25 Done</div>
            <div className="nav-user" onClick={() => signOut()}>
              <div className="nav-av">{userAv}</div>
              <span className="nav-name">{userName.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="page">
        <div className="page-top">
          <div className="page-title">
            <h1>Daily Operations Dashboard</h1>
            <p>{new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="shift-card">
          <div className="shift-left">
            <div className="shift-info">
              <div className="shift-lbl">Work Shift</div>
              <div className="shift-row">
                <div className={`sdot ${shiftOn ? "on" : ""}`}></div>
                <div className="shift-txt">{shiftOn ? "Shift Active" : "No Active Shift"}</div>
              </div>
              {shiftOn && <div className="shift-timer visible">{Math.floor(shiftSec/3600).toString().padStart(2, "0")}:{Math.floor((shiftSec%3600)/60).toString().padStart(2, "0")}:{String(shiftSec%60).padStart(2, "0")}</div>}
            </div>
          </div>
          <div className="shift-btns">
            {!shiftOn ? 
              <button className="sbt sbt-start" onClick={() => setShiftOn(true)}>▶ Start Shift</button> : 
              <button className="sbt sbt-end" onClick={() => setShiftOn(false)}>■ End Shift</button>
            }
          </div>
        </div>

        <div className="tabs-wrapper">
          <div className="tabs">
            <button className={`tab-btn ${activeTab === "dash" ? "on" : ""}`} onClick={() => setActiveTab("dash")}>📋 Main Dashboard</button>
            <button className={`tab-btn ${activeTab === "todo" ? "on" : ""}`} onClick={() => setActiveTab("todo")}>✅ My To-Do</button>
            <button className={`tab-btn ${activeTab === "cal" ? "on" : ""}`} onClick={() => setActiveTab("cal")}>📅 Calendar</button>
          </div>
        </div>

        {/* Tab Content: Dashboard (TASKS FIXED) */}
        {activeTab === "dash" && (
          <div className="t-card">
            <div className="card-toolbar"><span className="toolbar-title">📋 All Tasks — Live View</span></div>
            <div className="tbl-wrap">
              <table style={{width: "100%", tableLayout: "fixed"}}>
                <thead>
                  <tr>
                    <th style={{textAlign: "left", padding: "12px"}}>Task</th>
                    <th style={{width: "120px"}}>Status</th>
                    <th style={{width: "100px"}}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? tasks.map(t => (
                    <tr key={t.id} style={{borderTop: "1px solid #eee"}}>
                      <td style={{padding: "12px"}}>{t.name}</td>
                      <td><span className={`stat-pill ${t.status.toLowerCase()}`}>{t.status}</span></td>
                      <td>{t.priority}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" style={{textAlign: "center", padding: "40px", color: "#999"}}>No tasks found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Calendar (GOOGLE CALENDAR FIXED) */}
        {activeTab === "cal" && (
          <div className="t-card" style={{padding: "20px"}}>
            <h3 style={{marginBottom: "15px"}}>📅 Your Google Calendar Events</h3>
            <div className="cal-list">
              {events.length > 0 ? events.map(e => (
                <div key={e.id} className="cal-item" style={{padding: "12px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <div>
                    <div style={{fontWeight: "600", color: "var(--blue)"}}>{e.title}</div>
                    <div style={{fontSize: "12px", color: "#666"}}>{new Date(e.start).toLocaleString()}</div>
                  </div>
                  <a href={e.link} target="_blank" style={{fontSize: "12px", color: "var(--pink)", fontWeight: "600"}}>View in Google</a>
                </div>
              )) : (
                <div style={{textAlign: "center", padding: "40px", color: "#999"}}>
                  {loadingData ? "Loading events..." : "No upcoming events found in your primary calendar."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
