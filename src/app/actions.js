"use server";

import { getGoogleSheetsClient } from "../lib/google";
// Note: In Next.js, getServerSession from next-auth helps retrieve the session server-side
// We will export a dummy function for now to ensure compilation and basic structure.

export async function registerUser(name, phone, empId) {
  // TODO: Add getServerSession check
  const sheets = await getGoogleSheetsClient();
  console.log("Registering user:", name, phone, empId);
  // Example Google Sheets Append:
  // await sheets.spreadsheets.values.append({
  //   spreadsheetId: process.env.GOOGLE_SHEET_ID,
  //   range: 'Profiles!A:G',
  //   valueInputOption: 'USER_ENTERED',
  //   requestBody: { values: [[email, name, phone, empId, new Date().toISOString(), 1, "today"]] }
  // });
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
  // Returns mock data for now to allow UI to render without errors
  return {
    profile: { name: "User", empId: "001" },
    todayStates: [],
    shiftStatus: { hasSession: false },
    loginStats: { streak: 1 },
    upcomingEvents: []
  };
}
