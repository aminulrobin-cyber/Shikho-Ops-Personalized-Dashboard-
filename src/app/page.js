"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { startShift, endShift } from "./actions";

// ── Skeleton loader shown while session is being checked ──────────────────────
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
        .sk-row{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:16px}
        .sk-card{background:#fff;border-radius:14px;border:1px solid #E2E8F0;padding:16px 20px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center}
        .sk-tabs{display:flex;gap:4px;margin-bottom:14px}
        .sk-tbl{background:#fff;border-radius:14px;border:1px solid #E2E8F0;overflow:hidden}
        .sk-thead{background:#304090;padding:10px 16px;display:flex;gap:16px}
        .sk-th{height:14px;background:rgba(255,255,255,.3);border-radius:4px}
        .sk-tr{padding:12px 16px;border-bottom:1px solid #E2E8F0;display:flex;gap:16px;align-items:center}
        .sk-td{height:12px;border-radius:4px}
      `}</style>
      <div className="sk-nav">
        <div className="sk-nav-l">
          <div className="sk" style={{width:36,height:36,borderRadius:9}}/>
          <div className="sk" style={{width:130,height:16}}/>
        </div>
        <div className="sk-nav-r">
          <div className="sk" style={{width:80,height:28,borderRadius:20}}/>
          <div className="sk" style={{width:100,height:28,borderRadius:20}}/>
        </div>
      </div>
      <div className="sk-page">
        <div className="sk-row">
          <div className="sk" style={{width:240,height:24}}/>
          <div className="sk" style={{width:180,height:14}}/>
        </div>
        <div className="sk-card">
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div className="sk" style={{width:60,height:10}}/>
            <div className="sk" style={{width:150,height:20}}/>
            <div className="sk" style={{width:200,height:11}}/>
          </div>
          <div className="sk" style={{width:120,height:38,borderRadius:12}}/>
        </div>
        <div className="sk-tabs">
          {[160,120,120,110].map((w,i)=><div key={i} className="sk" style={{width:w,height:36,borderRadius:12}}/>)}
        </div>
        <div className="sk-tbl">
          <div style={{padding:"10px 16px",borderBottom:"1px solid #E2E8F0",display:"flex",justifyContent:"space-between"}}>
            <div className="sk" style={{width:160,height:14}}/>
            <div className="sk" style={{width:120,height:28,borderRadius:10}}/>
          </div>
          <div className="sk-thead">
            {[1,130,100,120,90].map((w,i)=><div key={i} className="sk-th" style={{width:w,flex:i===0?1:"none"}}/>)}
          </div>
          {[1,2,3,4,5].map(i=>(
            <div key={i} className="sk-tr">
              <div className="sk sk-td" style={{flex:1}}/>
              <div className="sk sk-td" style={{width:130}}/>
              <div className="sk sk-td" style={{width:100}}/>
              <div className="sk sk-td" style={{width:120}}/>
              <div className="sk sk-td" style={{width:90}}/>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth redirect
  useEffect(() => {
    if (status === "unauthenticated") router.push("/register");
  }, [status, router]);

  // ── State
  const [activeTab, setActiveTab]     = useState("dash");
  const [shiftOn,   setShiftOn]       = useState(false);
  const [shiftSec,  setShiftSec]      = useState(0);
  const [shiftLoading, setShiftLoading] = useState(false);
  const [lockMsg,   setLockMsg]       = useState(true);
  const [todoCnt,   setTodoCnt]       = useState(0);
  const timerRef = useRef(null);

  // Shift timer tick
  useEffect(() => {
    if (shiftOn) {
      timerRef.current = setInterval(() => setShiftSec(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [shiftOn]);

  // ── Shift handlers
  async function handleStartShift() {
    setShiftLoading(true);
    try {
      await startShift();
      setShiftOn(true);
      setShiftSec(0);
      setLockMsg(false);
    } catch (e) {
      alert("Could not start shift: " + e.message);
    } finally {
      setShiftLoading(false);
    }
  }

  async function handleEndShift() {
    setShiftLoading(true);
    try {
      await endShift();
      setShiftOn(false);
      setShiftSec(0);
      setLockMsg(true);
    } catch (e) {
      alert("Could not end shift: " + e.message);
    } finally {
      setShiftLoading(false);
    }
  }

  // ── Show skeleton while loading
  if (status === "loading" || !session) return <SkeletonLoader />;

  const userName  = session.user?.name  || "User";
  const userEmail = session.user?.email || "";
  const userAv    = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-in">
          <div className="nav-brand">
            <div className="nav-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="nav-text"><b>Shikho</b><span>Operations Control Center</span></div>
          </div>
          <div className="nav-right">
            <div className="nav-chip">
              <span className="dot"/>
              <span>0</span>/<span>25</span> Done
            </div>
            <div className="nav-user" onClick={() => signOut({ callbackUrl: "/register" })}>
              <div className="nav-av">{userAv}</div>
              <span className="nav-name">{userName.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <div className="page">

        {/* Page header */}
        <div className="page-top">
          <div className="page-title">
            <h1>Daily Operations Dashboard</h1>
            <p>{todayLabel()}</p>
          </div>
          <div className="prog-wrap">
            <div className="prog-label">My Progress: <b>0%</b></div>
            <div className="prog-track"><div className="prog-fill" style={{width:"0%"}}/></div>
          </div>
        </div>

        {/* Shift card */}
        <div className="shift-card">
          <div className="shift-left">
            <div className="shift-info">
              <div className="shift-lbl">Work Shift</div>
              <div className="shift-row">
                <div className={`sdot${shiftOn ? " on" : ""}`}/>
                <div className="shift-txt">{shiftOn ? "Shift Active" : "No Active Shift"}</div>
              </div>
              {shiftOn && (
                <div className="shift-timer visible">{fmt(shiftSec)}</div>
              )}
              <div className="shift-meta">
                {shiftOn ? `Started at ${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}` : "Start a shift to unlock all actions."}
              </div>
            </div>
          </div>
          <div className="shift-btns">
            {!shiftOn ? (
              <button className="sbt sbt-start" onClick={handleStartShift} disabled={shiftLoading}>
                {shiftLoading ? <span className="spin">⟳</span> : "▶"} Start Shift
              </button>
            ) : (
              <button className="sbt sbt-end" onClick={handleEndShift} disabled={shiftLoading}>
                {shiftLoading ? <span className="spin">⟳</span> : "■"} End Shift
              </button>
            )}
          </div>
        </div>

        {/* Lock banner */}
        {lockMsg && (
          <div className="lock-banner">
            🔒 You must start a shift before claiming or completing tasks.
          </div>
        )}

        {/* Tabs */}
        <div className="tabs-wrapper">
          <div className="tabs">
            {[
              { id:"dash",    label:"📋 Main Dashboard" },
              { id:"todo",    label:<>✅ My To-Do <span className="todo-count">{todoCnt}</span></> },
              { id:"cal",     label:"📅 Calendar" },
              { id:"profile", label:"👤 My Profile" },
            ].map(t => (
              <button
                key={t.id}
                className={`tab-btn${activeTab === t.id ? " on" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN DASHBOARD TAB ── */}
        {activeTab === "dash" && (
          <div className="t-card">
            <div className="card-toolbar">
              <span className="toolbar-title">📋 All Tasks — Live View</span>
              <button className="btn-add-custom" disabled={!shiftOn}>
                ＋ Add Custom Task
              </button>
            </div>
            <div className="col-outer">
              <div className="col-inner">
                <div className="ch dh-task">List of Tasks</div>
                <div className="ch dh-who">Task Claimed By</div>
                <div className="ch dh-stat">Status</div>
                <div className="ch dh-prog">Progress</div>
                <div className="ch dh-act">Action</div>
              </div>
            </div>
            <div className="tbl-wrap">
              <table style={{tableLayout:"fixed",width:"100%"}}>
                <colgroup>
                  <col/><col style={{width:150}}/><col style={{width:120}}/><col style={{width:160}}/><col style={{width:120}}/>
                </colgroup>
                <thead><tr><th>Task</th><th>Task Claimed By</th><th>Status</th><th>Progress</th><th>Action</th></tr></thead>
                <tbody>
                  <tr><td colSpan={5} style={{textAlign:"center",padding:"32px 16px",color:"var(--muted)",fontSize:13}}>
                    {shiftOn ? "No tasks yet. Tasks will appear here once loaded." : "Start your shift to see and claim tasks."}
                  </td></tr>
                </tbody>
              </table>
            </div>
            <div className="t-foot">
              <div className="t-foot-note">Claim tasks to add them to your personal To-Do list.</div>
              <div className="legend">
                <div className="leg"><div className="ldot" style={{background:"#fff",border:"1px solid #cbd5e1"}}/> Pending</div>
                <div className="leg"><div className="ldot" style={{background:"var(--yel-lt)",border:"1px solid var(--yel-md)"}}/> In Progress</div>
                <div className="leg"><div className="ldot" style={{background:"var(--blue-lt)",border:"1px solid #c7cdf0"}}/> Completed</div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY TO-DO TAB ── */}
        {activeTab === "todo" && (
          <div className="t-card">
            <div className="card-toolbar">
              <span className="toolbar-title">My Tasks — {todayLabel()}</span>
              <button className="btn-add-custom" disabled={!shiftOn}>＋ Add Custom Task</button>
            </div>
            <div className="tbl-wrap">
              <table style={{tableLayout:"fixed",width:"100%"}}>
                <colgroup>
                  <col style={{width:38}}/><col/><col style={{width:200}}/><col style={{width:120}}/><col style={{width:150}}/>
                </colgroup>
                <thead><tr><th>#</th><th>Task</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  <tr><td colSpan={5} style={{textAlign:"center",padding:"32px 16px",color:"var(--muted)",fontSize:13}}>
                    Your claimed tasks will appear here.
                  </td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CALENDAR TAB ── */}
        {activeTab === "cal" && (
          <div className="t-card" style={{padding:32,textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12}}>📅</div>
            <h3 style={{color:"var(--blue)",marginBottom:8}}>Calendar</h3>
            <p style={{color:"var(--sub)",fontSize:13}}>Google Calendar integration will be connected here once the Service Account is set up.</p>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="profile-layout">
            <div className="profile-card">
              <div className="profile-hd">
                <div className="profile-av-lg">{userAv}</div>
                <div className="profile-name-lg">{userName}</div>
                <div className="profile-email-lg">{userEmail}</div>
              </div>
              <div className="profile-body">
                <div className="profile-stat-grid">
                  <div className="pstat"><div className="pstat-lbl">Shift Status</div><div className="pstat-val green">{shiftOn?"Active":"Inactive"}</div><div className="pstat-sub">{shiftOn?fmt(shiftSec)+" elapsed":"Not started"}</div></div>
                  <div className="pstat"><div className="pstat-lbl">Tasks Today</div><div className="pstat-val pink">0</div><div className="pstat-sub">completed</div></div>
                  <div className="pstat"><div className="pstat-lbl">My To-Do</div><div className="pstat-val blue">{todoCnt}</div><div className="pstat-sub">items</div></div>
                  <div className="pstat"><div className="pstat-lbl">Account</div><div className="pstat-val orange" style={{fontSize:12,paddingTop:4}}>{userEmail.split("@")[1]||"—"}</div><div className="pstat-sub">workspace</div></div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/register" })}
                  style={{marginTop:16,width:"100%",padding:"10px",borderRadius:10,background:"var(--red-lt)",color:"var(--red)",border:"1.5px solid #fba6b5",fontFamily:"var(--font)",fontWeight:700,cursor:"pointer",fontSize:13}}
                >
                  Sign Out
                </button>
              </div>
            </div>
            <div className="profile-card">
              <div className="activity-panel-hd">
                <h3>📊 My Activity</h3>
                <span>● Online now</span>
              </div>
              <div className="activity-section">
                <div className="activity-section-title">⏱ Session Duration</div>
                <div className="session-timer-widget">
                  <div className="stw-left">
                    <div className={`stw-dot${shiftOn?" on":""}`}/>
                    <div className="stw-info">
                      <div className="stw-label">Work Shift</div>
                      <div className={`stw-time${shiftOn?"":" off"}`}>{shiftOn ? fmt(shiftSec) : "Not started"}</div>
                      <div className="stw-since">{shiftOn ? "Shift is active" : "No active shift"}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="activity-section" style={{borderBottom:"none"}}>
                <div className="activity-section-title">✅ Today's Task Activity</div>
                <div style={{textAlign:"center",padding:"24px 16px",color:"var(--muted)",fontSize:12.5}}>No tasks yet today.</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── TOASTS ── */}
      <div id="toasts"/>
    </>
  );
}
