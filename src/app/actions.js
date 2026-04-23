"use server";

import { getGoogleSheetsClient } from "../lib/google";
// Note: In Next.js, getServerSession from next-auth helps retrieve the session server-side
// We will export a dummy function for now to ensure compilation and basic structure.

export async function registerUser(name, phone, empId) {
  // TODO: Connect to Google Sheets once GOOGLE_SERVICE_ACCOUNT_CREDENTIALS is set in Vercel
  console.log("Registering user:", name, phone, empId);
  return { success: true, name };
}

export async function startShift() {
  console.log("Shift started");
  return { success: true, resumed: false, startTime: new Date().toLocaleTimeString() };
}

export async function endShift() {
  console.log("Shift ended");
  return { success: true, durationMin: 120 };
}

export async function claimTask(taskId, taskName) {
  console.log("Claimed task", taskId);
  return { success: true };
}

export async function completeTask(taskId, taskName, notes) {
  console.log("Completed task", taskId);
  return { success: true, timestamp: new Date().toISOString() };
}

export async function addCustomTask(taskName, assigneeEmail, priority) {
  return { success: true, taskId: "C_123" };
}

export async function deleteTask(taskId) {
  return { success: true };
}

export async function createCalendarEvent(title, description, startDate, startTime, endTime, attendees, isAllDay) {
  return { success: true, eventId: "evt_123" };
}

export async function getDashboardData() {
  // Mock tasks for now - in a real app, these would come from Google Sheets or a DB
  const mockTasks = [
    { id: "T1", name: "Review Morning Operations", status: "Pending", priority: "Normal" },
    { id: "T2", name: "Check Support Tickets", status: "In Progress", priority: "Important" },
    { id: "T3", name: "Update Shift Log", status: "Pending", priority: "Normal" },
    { id: "T4", name: "Team Sync Meeting", status: "Completed", priority: "Normal" },
  ];

  return {
    profile: { name: "User", empId: "SHK-001" },
    tasks: mockTasks,
    shiftStatus: { hasSession: false },
    loginStats: { streak: 5 },
  };
}

export async function getCalendarEvents(accessToken) {
  if (!accessToken) throw new Error("No access token provided");
  
  try {
    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=" + new Date().toISOString() + "&maxResults=10&singleEvents=true&orderBy=startTime", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Failed to fetch calendar");
    }
    
    const data = await res.json();
    return data.items.map(item => ({
      id: item.id,
      title: item.summary,
      start: item.start.dateTime || item.start.date,
      end: item.end.dateTime || item.end.date,
      link: item.htmlLink
    }));
  } catch (e) {
    console.error("Calendar fetch error:", e);
    return [];
  }
}
