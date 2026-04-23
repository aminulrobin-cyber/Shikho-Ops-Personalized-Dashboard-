"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { startShift, endShift, getDashboardData, getCalendarEvents } from "./actions";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("dash");
  const [shiftOn, setShiftOn] = useState(false);
  const [shiftSec, setShiftSec] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  // ── Auth & Data ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") router.push("/register");
    if (status === "authenticated") loadData();
  }, [status]);

  async function loadData() {
    setLoading(true);
    try {
      const dash = await getDashboardData();
      setTasks(dash.tasks || []);
      if (session?.accessToken) {
        const cal = await getCalendarEvents(session.accessToken);
        setEvents(cal || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  // ── Shift Timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (shiftOn) {
      timerRef.current = setInterval(() => setShiftSec(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [shiftOn]);

  if (status === "loading" || !session) return <div className="sk-page">Loading dashboard...</div>;

  const userName = session.user?.name || "User";
  const userEmail = session.user?.email || "";
  const userAv = userName.charAt(0).toUpperCase();
  const today = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const fmt = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sc = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sc}`;
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-in">
          <div className="nav-brand">
            <div className="nav-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="nav-text"><b>Shikho</b><span>Operations Control Center</span></div>
          </div>
          <div className="nav-right">
            <div className="nav-chip"><span className="dot"></span>{tasks.filter(t=>t.status==='Completed').length}/{tasks.length || 25} Done</div>
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
            <p>{today}</p>
          </div>
          <div className="prog-wrap">
            <div className="prog-label">My Progress: <b>{Math.round((tasks.filter(t=>t.status==='Completed').length / (tasks.length || 1)) * 100)}%</b></div>
            <div className="prog-track"><div className="prog-fill" style={{width: `${(tasks.filter(t=>t.status==='Completed').length / (tasks.length || 1)) * 100}%`}}></div></div>
          </div>
        </div>

        <div className="shift-card">
          <div className="shift-left">
            <div className="shift-info">
              <div className="shift-lbl">Work Shift</div>
              <div className="shift-row">
                <div className={`sdot ${shiftOn ? 'on' : ''}`}></div>
                <div className="shift-txt">{shiftOn ? "Shift Active" : "No Active Shift"}</div>
              </div>
              <div className={`shift-timer ${shiftOn ? 'visible' : ''}`}>{fmt(shiftSec)}</div>
              <div className="shift-meta">{shiftOn ? "Started just now" : "Start a shift to unlock all actions."}</div>
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
            <button className={`tab-btn ${activeTab === 'dash' ? 'on' : ''}`} onClick={() => setActiveTab('dash')}>📋 Main Dashboard</button>
            <button className={`tab-btn ${activeTab === 'todo' ? 'on' : ''}`} onClick={() => setActiveTab('todo')}>✅ My To-Do <span className="todo-count">{tasks.length}</span></button>
            <button className={`tab-btn ${activeTab === 'cal' ? 'on' : ''}`} onClick={() => setActiveTab('cal')}>📅 Calendar</button>
            <button className={`tab-btn ${activeTab === 'profile' ? 'on' : ''}`} onClick={() => setActiveTab('profile')}>👤 My Profile</button>
          </div>
        </div>

        {activeTab === 'dash' && (
          <div className="tab-content on">
            <div className="t-card">
              <div className="card-toolbar">
                <span className="toolbar-title">📋 All Tasks — Live View</span>
                <button className="btn-add-custom" disabled={!shiftOn}>＋ Add Custom Task</button>
              </div>
              <div className="tbl-wrap">
                <table style={{tableLayout: 'fixed', width: '100%'}}>
                  <thead><tr><th>Task</th><th>Task Claimed By</th><th>Status</th><th>Progress</th><th>Action</th></tr></thead>
                  <tbody>
                    {tasks.map(t => (
                      <tr key={t.id} className={t.status === 'Completed' ? 'row-done' : ''}>
                        <td>{t.name}</td>
                        <td>{t.claimedBy || "Unclaimed"}</td>
                        <td><span className={`stat-pill ${t.status.toLowerCase()}`}>{t.status}</span></td>
                        <td>{t.status === 'Completed' ? '100%' : '0%'}</td>
                        <td><button className="btn-claim" disabled={!shiftOn}>Claim</button></td>
                      </tr>
                    ))}
                    {tasks.length === 0 && <tr><td colSpan="5" style={{textAlign:'center', padding:'40px'}}>No tasks available.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cal' && (
          <div className="tab-content on">
            <div className="cal-root">
              <div className="cal-topbar">
                <div className="cal-nav"><div className="cal-month-title">Your Google Calendar</div></div>
                <div className="cal-topbar-right"><button className="btn-new-event">＋ New Event</button></div>
              </div>
              <div className="cal-main">
                <div className="cal-grid-card" style={{flex: 1}}>
                  <div className="cal-day-list" style={{padding: '20px'}}>
                    {events.length > 0 ? events.map(e => (
                      <div key={e.id} style={{padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                          <div style={{fontWeight: '700', color: 'var(--blue)'}}>{e.title}</div>
                          <div style={{fontSize: '12px', color: '#666'}}>{new Date(e.start).toLocaleString()}</div>
                        </div>
                        <a href={e.link} target="_blank" style={{color: 'var(--pink)', fontSize: '12px', fontWeight: '700'}}>Join / View</a>
                      </div>
                    )) : <div style={{textAlign: 'center', padding: '100px'}}>No upcoming events found.</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="tab-content on">
            <div className="profile-layout">
              <div className="profile-card">
                <div className="profile-hd">
                  <div className="profile-av-lg">{userAv}</div>
                  <div className="profile-name-lg">{userName}</div>
                  <div className="profile-email-lg">{userEmail}</div>
                </div>
                <div className="profile-body">
                  <div className="profile-stat-grid">
                    <div className="pstat"><div className="pstat-lbl">Tasks</div><div className="pstat-val pink">{tasks.length}</div></div>
                    <div className="pstat"><div className="pstat-lbl">Streak</div><div className="pstat-val orange">5</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
