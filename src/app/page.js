"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register");
    }
  }, [status, router]);

  if (status === "loading" || !session) return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .sk {
          background: linear-gradient(90deg, #e8ecf4 25%, #f5f7fc 50%, #e8ecf4 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        .sk-nav {
          height: 62px;
          background: linear-gradient(135deg, #CF278D, #a81f72);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 22px; box-shadow: 0 3px 20px rgba(207,39,141,.28);
        }
        .sk-nav-left { display: flex; align-items: center; gap: 10px; }
        .sk-nav-circle { width: 36px; height: 36px; border-radius: 9px; background: rgba(255,255,255,.25); }
        .sk-nav-text { width: 130px; height: 16px; background: rgba(255,255,255,.25); border-radius: 6px; }
        .sk-nav-right { display: flex; gap: 10px; align-items: center; }
        .sk-nav-chip { width: 80px; height: 28px; border-radius: 20px; background: rgba(255,255,255,.2); }
        .sk-nav-user { width: 100px; height: 28px; border-radius: 20px; background: rgba(255,255,255,.2); }
        .sk-page { max-width: 1200px; margin: 0 auto; padding: 20px 18px; }
        .sk-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px; }
        .sk-title { width: 240px; height: 24px; }
        .sk-prog { width: 180px; height: 14px; }
        .sk-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 16px 20px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        .sk-shift-info { display: flex; flex-direction: column; gap: 8px; }
        .sk-tabs { display: flex; gap: 4px; margin-bottom: 14px; }
        .sk-tab { width: 130px; height: 36px; border-radius: 8px; }
        .sk-table-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; }
        .sk-toolbar { padding: 10px 16px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; }
        .sk-thead { background: #354894; padding: 10px 16px; display: flex; gap: 16px; }
        .sk-th { height: 14px; background: rgba(255,255,255,.3); border-radius: 4px; }
        .sk-row-item { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; display: flex; gap: 16px; align-items: center; }
        .sk-cell { height: 12px; border-radius: 4px; }
      `}</style>

      {/* Skeleton Nav */}
      <div className="sk-nav">
        <div className="sk-nav-left">
          <div className="sk-nav-circle"></div>
          <div className="sk-nav-text"></div>
        </div>
        <div className="sk-nav-right">
          <div className="sk-nav-chip"></div>
          <div className="sk-nav-user"></div>
        </div>
      </div>

      {/* Skeleton Page Content */}
      <div className="sk-page">
        {/* Title row */}
        <div className="sk-row">
          <div className="sk sk-title"></div>
          <div className="sk sk-prog"></div>
        </div>

        {/* Shift card */}
        <div className="sk-card">
          <div className="sk-shift-info">
            <div className="sk" style={{width: 60, height: 10}}></div>
            <div className="sk" style={{width: 150, height: 20}}></div>
            <div className="sk" style={{width: 200, height: 11}}></div>
          </div>
          <div className="sk" style={{width: 120, height: 38, borderRadius: 9}}></div>
        </div>

        {/* Tabs */}
        <div className="sk-tabs">
          {[160, 120, 120, 110].map((w, i) => (
            <div key={i} className="sk sk-tab" style={{width: w}}></div>
          ))}
        </div>

        {/* Table card */}
        <div className="sk-table-card">
          <div className="sk-toolbar">
            <div className="sk" style={{width: 160, height: 14}}></div>
            <div className="sk" style={{width: 120, height: 28, borderRadius: 7}}></div>
          </div>
          <div className="sk-thead">
            {[280, 130, 100, 120, 90].map((w, i) => (
              <div key={i} className="sk-th" style={{width: w, flex: i === 0 ? 1 : 'none'}}></div>
            ))}
          </div>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="sk-row-item">
              <div className="sk sk-cell" style={{flex: 1, height: 13}}></div>
              <div className="sk sk-cell" style={{width: 130, height: 13}}></div>
              <div className="sk sk-cell" style={{width: 100, height: 13}}></div>
              <div className="sk sk-cell" style={{width: 120, height: 13}}></div>
              <div className="sk sk-cell" style={{width: 90, height: 13}}></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      


<nav className="nav">
  <div className="nav-in">
    <div className="nav-brand">
      <div className="nav-ico">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div className="nav-text"><b>Shikho</b><span>Operations Control Center</span></div>
    </div>
    <div className="nav-right">
      <div className="nav-chip"><span className="dot"></span><span id="hD">0</span>/<span id="hT">25</span> Done</div>
      <div className="nav-user" >
        <div className="nav-av" id="navAv">–</div>
        <span className="nav-name" id="navName">Loading…</span>
      </div>
    </div>
  </div>
</nav>


<div className="page">

  
  <div className="page-top">
    <div className="page-title">
      <h1>Daily Operations Dashboard</h1>
      <p id="dateLine">Loading…</p>
    </div>
    <div className="prog-wrap">
      <div className="prog-label">My Progress: <b id="pctLbl">0%</b></div>
      <div className="prog-track"><div className="prog-fill" id="progFill"></div></div>
    </div>
  </div>

  
  <div className="streak-banner hide" id="streakBanner">
    <div className="streak-ico">🔥</div>
    <div className="streak-info">
      <div className="streak-title" id="streakTitle">Daily Login Streak</div>
      <div className="streak-sub" id="streakSub">Keep showing up every day!</div>
    </div>
    <div className="streak-badge" id="streakBadge">1 day</div>
  </div>

  
  <div className="shift-card">
    <div className="shift-left">
      <div className="shift-info">
        <div className="shift-lbl">Work Shift</div>
        <div className="shift-row">
          <div className="sdot" id="sdot"></div>
          <div className="shift-txt" id="sTxt">No Active Shift</div>
        </div>
        <div className="shift-timer" id="sTimer">00:00:00</div>
        <div className="shift-meta" id="sMeta">Start a shift to unlock all actions.</div>
        <div className="shift-max" id="sMax">Auto-ends in: <span id="sRemain"></span></div>
      </div>
    </div>
    <div className="shift-btns">
      <button className="sbt sbt-start" id="btnStart" >▶ Start Shift</button>
      <button className="sbt sbt-end" id="btnEnd"  style={{display: 'none'}}>■ End Shift</button>
    </div>
  </div>

  
  <div className="lock-banner" id="lockBanner">
    🔒 You must start a shift before claiming or completing tasks.
  </div>

  
  <div className="tabs-wrapper">
    <div className="tabs">
      <button className="tab-btn on" id="tabBtnDash" >📋 Main Dashboard</button>
      <button className="tab-btn" id="tabBtnTodo" >
        ✅ My To-Do <span className="todo-count" id="todoCnt">0</span>
      </button>
      <button className="tab-btn" id="tabBtnCal" >📅 Calendar</button>
      <button className="tab-btn" id="tabBtnProfile" >👤 My Profile</button>
    </div>
  </div>

  
  <div className="tab-content on" id="tabDash">
    <div className="t-card">
      
      <div className="card-toolbar">
        <span className="toolbar-title">📋 All Tasks — Live View</span>
        <button className="btn-add-custom" id="btnAddCustomDash"  disabled>
          ＋ Add Custom Task
        </button>
      </div>
      <div className="col-outer">
        <div className="col-inner" id="dHdr">
          <div className="ch dh-task">List of Tasks</div>
          <div className="ch dh-who">Task Claimed By</div>
          <div className="ch dh-stat">Status</div>
          <div className="ch dh-prog">Progress</div>
          <div className="ch dh-act">Action</div>
        </div>
      </div>
      <div className="tbl-wrap" id="dWrap">
        <table id="dashTable" style={{tableLayout: 'fixed'}}>
          <colgroup>
            <col/>
            <col style={{width: '150px'}}/>
            <col style={{width: '120px'}}/>
            <col style={{width: '160px'}}/>
            <col style={{width: '120px'}}/>
          </colgroup>
          <thead><tr><th>Task</th><th>Task Claimed By</th><th>Status</th><th>Progress</th><th>Action</th></tr></thead>
          <tbody id="dashBody"></tbody>
        </table>
      </div>
      <div className="t-foot">
        <div className="t-foot-note">Claim tasks to add them to your personal To-Do list. &nbsp;<span id="pollTick" style={{fontSize: '10px', color: 'var(--green)', opacity: '0', transition: 'opacity .4s'}}>● Live</span></div>
        <div className="legend">
          <div className="leg"><div className="ldot" style={{background: '#fff', border: '1px solid #cbd5e1'}}></div>Pending</div>
          <div className="leg"><div className="ldot" style={{background: 'var(--yel-lt)', border: '1px solid var(--yel-md)'}}></div>In Progress</div>
          <div className="leg"><div className="ldot" style={{background: 'var(--blue-lt)', border: '1px solid #c7cdf0'}}></div>Completed</div>
        </div>
      </div>
    </div>
  </div>

  
  <div className="tab-content" id="tabTodo">
    <div className="t-card">
      <div className="card-toolbar">
        <span className="toolbar-title">My Tasks — <span id="todoDate"></span></span>
        <button className="btn-add-custom" id="btnAddCustom"  disabled>
          ＋ Add Custom Task
        </button>
      </div>
      <div className="col-outer">
        <div className="col-inner" id="tHdr">
          <div className="ch th-num">#</div>
          <div className="ch th-task">Task</div>
          <div className="ch th-note">Remarks / Notes</div>
          <div className="ch th-stat">Status</div>
          <div className="ch th-act">Actions</div>
        </div>
      </div>
      <div className="tbl-wrap" id="tWrap">
        <table id="todoTable" style={{tableLayout: 'fixed'}}>
          <colgroup>
            <col style={{width: '38px'}}/>
            <col/>
            <col style={{width: '200px'}}/>
            <col style={{width: '120px'}}/>
            <col style={{width: '150px'}}/>
          </colgroup>
          <thead><tr><th>#</th><th>Task</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="todoBody"></tbody>
        </table>
      </div>
      <div className="t-foot">
        <div className="t-foot-note">Complete tasks to log them and notify the team.</div>
        <div className="legend">
          <div className="leg"><div className="ldot" style={{background: 'var(--red-lt)', border: '1px solid #fba6b5'}}></div>🚨 Emergency</div>
          <div className="leg"><div className="ldot" style={{background: 'var(--org-lt)', border: '1px solid var(--org-md)'}}></div>⚡ Important</div>
          <div className="leg"><div className="ldot" style={{background: 'var(--blue-lt)', border: '1px solid #c7cdf0'}}></div>✓ Done</div>
        </div>
      </div>
    </div>
  </div>

  
  <div className="tab-content" id="tabCal">
    <div className="cal-root">

      
      <div className="cal-topbar">
        <div className="cal-nav">
          <button className="cal-nav-btn"  title="Previous month">‹</button>
          <div className="cal-month-title" id="calMonthTitle">Loading…</div>
          <button className="cal-nav-btn"  title="Next month">›</button>
          <button className="cal-today-btn" >Today</button>
        </div>
        <div className="cal-topbar-right">
          <div className="cal-source-badges">
            <span className="cal-src-badge gcal">🔵 Google Calendar</span>
            <span className="cal-src-badge shikho">🌸 Shikho Ops</span>
          </div>
          <button className="btn-new-event" >＋ New Event</button>
        </div>
      </div>

      
      <div className="cal-main">

        
        <div className="cal-grid-card">
          <div className="cal-grid-hd">
            <div className="cal-dname">Sun</div>
            <div className="cal-dname">Mon</div>
            <div className="cal-dname">Tue</div>
            <div className="cal-dname">Wed</div>
            <div className="cal-dname">Thu</div>
            <div className="cal-dname">Fri</div>
            <div className="cal-dname">Sat</div>
          </div>
          <div className="cal-grid" id="calGrid">
            <div className="cal-loading">
              <div className="cal-spin"></div>
              Loading your calendar…
            </div>
          </div>
        </div>

        
        <div className="cal-side">

          
          <div className="cal-day-panel">
            <div className="cal-day-hd">
              <h3 id="calDayTitle">Select a day</h3>
              <span id="calDayCount"></span>
            </div>
            <div className="cal-day-list" id="calDayList">
              <div className="cal-day-empty">Click any day to see its events.</div>
            </div>
          </div>

          
          <div className="cal-create-panel">
            <div className="cal-create-hd"  style={{cursor: 'pointer'}}>
              <h3>📅 Schedule New Event</h3>
              <span id="calCreateToggle">▼ Expand</span>
            </div>
            <div className="cal-create-body hidden" id="calCreateBody">
              <div className="form-row">
                <label>Event Title *</label>
                <input type="text" id="calTitle" placeholder="e.g. Team Weekly Sync" maxlength="100"/>
              </div>
              <div className="form-row">
                <label>Description</label>
                <textarea id="calDesc" placeholder="Optional notes or agenda…"></textarea>
              </div>
              <div className="form-row">
                <label>Date *</label>
                <input type="date" id="calDate"/>
              </div>
              <div className="allday-row">
                <input type="checkbox" id="calAllDay" />
                <label htmlFor="calAllDay">All-day event</label>
              </div>
              <div id="calTimeFields" className="form-2col">
                <div className="form-row" style={{margin: '0'}}>
                  <label>Start Time *</label>
                  <input type="time" id="calStart"/>
                </div>
                <div className="form-row" style={{margin: '0'}}>
                  <label>End Time *</label>
                  <input type="time" id="calEnd"/>
                </div>
              </div>
              <div className="form-row" style={{marginTop: '13px'}}>
                <label>Invite Attendees (comma-separated emails)</label>
                <input type="text" id="calAttendees" placeholder="e.g. alice@shikho.com, bob@shikho.com"/>
              </div>
              <div className="cal-err" id="calErr"></div>
              <button className="cal-submit" id="calSubmit"  style={{marginTop: '14px'}}>
                📅 Add to Calendar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  
  <div className="tab-content" id="tabProfile">
    <div className="profile-layout">

      
      <div className="profile-card">
        <div className="profile-hd">
          <div className="profile-av-lg" id="profileAvLg">–</div>
          <div className="profile-name-lg" id="profileNameLg">Loading…</div>
          <div className="profile-email-lg" id="profileEmailLg"></div>
          <div className="profile-empid" id="profileEmpId"></div>
        </div>
        <div className="profile-body">
          <div className="profile-stat-grid">
            <div className="pstat">
              <div className="pstat-lbl">Login Streak</div>
              <div className="pstat-val orange" id="pStatStreak">–</div>
              <div className="pstat-sub">consecutive days</div>
            </div>
            <div className="pstat">
              <div className="pstat-lbl">Tasks Today</div>
              <div className="pstat-val pink" id="pStatTasks">–</div>
              <div className="pstat-sub">completed</div>
            </div>
            <div className="pstat">
              <div className="pstat-lbl">Shift Status</div>
              <div className="pstat-val green" id="pStatShift">–</div>
              <div className="pstat-sub" id="pStatShiftSub">–</div>
            </div>
            <div className="pstat">
              <div className="pstat-lbl">Member Since</div>
              <div className="pstat-val blue" id="pStatSince" style={{fontSize: '13px', paddingTop: '4px'}}>–</div>
              <div className="pstat-sub">registered</div>
            </div>
          </div>
          <div className="profile-edit-section">
            <h4>Update Phone Number</h4>
            <div className="prof-input-row">
              <input className="prof-input" type="tel" id="profilePhone" placeholder="e.g. 01XXXXXXXXX" maxlength="20"/>
              <button className="prof-save-btn" id="profSaveBtn" >Save</button>
            </div>
            <div id="profMsg" style={{fontSize: '11.5px', marginTop: '6px', display: 'none'}}></div>
          </div>
        </div>
      </div>

      
      <div className="profile-card">
        <div className="activity-panel-hd">
          <h3>📊 My Activity</h3>
          <span id="activityOnlineTag">● Online now</span>
        </div>

        
        <div className="activity-section">
          <div className="activity-section-title">⏱ Session Duration</div>
          <div className="session-timer-widget">
            <div className="stw-left">
              <div className="stw-dot" id="profSdot"></div>
              <div className="stw-info">
                <div className="stw-label">Active on Dashboard</div>
                <div className="stw-time" id="profPageTimer">00:00:00</div>
                <div className="stw-since" id="profPageSince">Session started at —</div>
              </div>
            </div>
          </div>

          
          <div className="activity-section-title" style={{marginTop: '10px'}}>🕐 Shift Timer</div>
          <div className="session-timer-widget">
            <div className="stw-left">
              <div className="stw-dot" id="profShiftDot"></div>
              <div className="stw-info">
                <div className="stw-label">Work Shift</div>
                <div className="stw-time" id="profShiftTime">Not started</div>
                <div className="stw-since" id="profShiftSince">No active shift</div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="activity-section">
          <div className="activity-section-title">✅ Today's Task Activity</div>
          <div id="profTaskActivity">
            <div className="prof-ev-empty">No tasks yet today.</div>
          </div>
        </div>

        
        <div className="activity-section" style={{borderBottom: 'none', paddingBottom: '0'}}>
          <div className="activity-section-title">📅 Upcoming Events
            <span id="profEvCountBadge" style={{fontSize: '10px', fontWeight: '700', color: 'var(--sub)', marginLeft: '6px'}}></span>
          </div>
        </div>
        <div className="prof-ev-list" id="profEvList">
          <div className="prof-ev-empty">Loading events…</div>
        </div>

      </div>

    </div>
  </div>

</div>


<div className="modal-overlay" id="delModal">
  <div className="modal">
    <h3>🗑 Delete Task?</h3>
    <p>Are you sure you want to delete <span className="modal-task" id="delTaskName"></span> from your To-Do list?<br />
    This action cannot be undone.</p>
    <div className="modal-btns">
      <button className="modal-cancel" >Cancel</button>
      <button className="modal-confirm" id="delConfirmBtn" >Yes, Delete</button>
    </div>
  </div>
</div>


<div className="modal-overlay add-modal" id="addModal">
  <div className="modal modal-wide">
    <h3>＋ Create Custom Task</h3>
    <p>Add a task directly to any team member's To-Do list with a priority level.</p>

    <span className="modal-field-label">Task Name *</span>
    <input className="inp-modal" id="customTaskName" type="text"
           placeholder="e.g. Review weekly analytics report" maxlength="120"
           onkeydown="if(event.key==='Enter')confirmAdd()"/>

    <span className="modal-field-label">Assign To *</span>
    <select className="inp-modal-select" id="customTaskAssignee">
      <option value="">Loading team members…</option>
    </select>

    <span className="modal-field-label">Priority</span>
    <div className="priority-pills">
      <button className="priority-pill sel-normal" data-p="Normal" >● Normal</button>
      <button className="priority-pill" data-p="Important" >⚡ Important</button>
      <button className="priority-pill" data-p="Emergency" >🚨 Emergency</button>
    </div>
    <input type="hidden" id="selectedPriority" value="Normal"/>

    <div id="addErrMsg" style={{fontSize: '12px', color: 'var(--red)', marginTop: '10px', display: 'none'}}></div>
    <div className="modal-btns">
      <button className="modal-cancel" >Cancel</button>
      <button className="modal-add-btn" id="addConfirmBtn" >Create Task</button>
    </div>
  </div>
</div>

<div id="toasts"></div>




    </>
  );
}
