import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  seedAdmins, seedClients, seedDisputes, seedPayouts, seedProjects, seedStudents, seedWaitlist, DEMO_IDS,
} from "../data/seed";
import { calcFees, studentStats } from "../lib/selectors";
import { dayOffset, uid } from "../lib/format";

const KEY = "slance.demo.v1";

const initial = () => ({
  students: seedStudents,
  clients: seedClients,
  admins: seedAdmins,
  projects: seedProjects,
  disputes: seedDisputes,
  payouts: seedPayouts,
  waitlist: seedWaitlist,
  session: null, // { role: 'mahasiswa'|'klien'|'admin', id }
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.projects && parsed.students) return parsed;
    }
  } catch {
    /* localStorage bisa diblokir; pakai data awal */
  }
  return initial();
}

const mapProject = (state, id, fn) => ({ ...state, projects: state.projects.map((p) => (p.id === id ? fn(p) : p)) });

function reducer(state, a) {
  switch (a.type) {
    case "RESET":
      return { ...initial(), session: state.session };
    case "LOGIN":
      return { ...state, session: { role: a.role, id: a.id } };
    case "LOGOUT":
      return { ...state, session: null };

    case "REGISTER_STUDENT":
      return { ...state, students: [...state.students, a.student], session: { role: "mahasiswa", id: a.student.id } };
    case "REGISTER_CLIENT":
      return { ...state, clients: [...state.clients, a.client], session: { role: "klien", id: a.client.id } };
    case "UPDATE_STUDENT":
      return { ...state, students: state.students.map((s) => (s.id === a.id ? { ...s, ...a.patch } : s)) };
    case "UPDATE_CLIENT":
      return { ...state, clients: state.clients.map((c) => (c.id === a.id ? { ...c, ...a.patch } : c)) };

    case "POST_PROJECT":
      return { ...state, projects: [a.project, ...state.projects] };
    case "APPLY":
      return mapProject(state, a.projectId, (p) => ({ ...p, applicants: [...p.applicants, a.application] }));
    case "WITHDRAW_APPLICATION":
      return mapProject(state, a.projectId, (p) => ({
        ...p,
        applicants: p.applicants.filter((x) => !(x.studentId === a.studentId && x.status === "pending")),
      }));
    case "HIRE":
      return mapProject(state, a.projectId, (p) => {
        const chosen = p.applicants.find((x) => x.id === a.applicationId);
        if (!chosen) return p;
        return {
          ...p,
          status: "funding",
          hiredStudentId: chosen.studentId,
          price: chosen.price,
          escrow: "none",
          applicants: p.applicants.map((x) => ({ ...x, status: x.id === a.applicationId ? "accepted" : "rejected" })),
          milestones: p.milestones.length
            ? p.milestones
            : [
                { id: "m1", title: "Kesepakatan & brief awal", done: false },
                { id: "m2", title: "Draf pertama", done: false },
                { id: "m3", title: "Revisi & finalisasi", done: false },
              ],
        };
      });
    case "FUND":
      return mapProject(state, a.projectId, (p) => ({ ...p, escrow: "held", status: "in_progress" }));
    case "TOGGLE_MILESTONE":
      return mapProject(state, a.projectId, (p) => ({
        ...p,
        milestones: p.milestones.map((m) => (m.id === a.milestoneId ? { ...m, done: !m.done } : m)),
      }));
    case "SUBMIT_WORK":
      return mapProject(state, a.projectId, (p) => ({
        ...p,
        status: "review",
        submittedAt: dayOffset(0),
        milestones: p.milestones.map((m) => ({ ...m, done: true })),
      }));
    case "REQUEST_REVISION":
      return mapProject(state, a.projectId, (p) => ({
        ...p,
        status: "in_progress",
        revisionNote: a.note,
        milestones: p.milestones.map((m, i, arr) => (i === arr.length - 1 ? { ...m, done: false } : m)),
      }));
    case "APPROVE":
      return mapProject(state, a.projectId, (p) => ({
        ...p,
        status: "completed",
        escrow: "released",
        completedAt: dayOffset(0),
        review: { rating: a.rating, text: a.text, createdAt: dayOffset(0) },
      }));
    case "CANCEL_PROJECT":
      return mapProject(state, a.projectId, (p) => ({ ...p, status: "cancelled", escrow: p.escrow === "held" ? "refunded" : p.escrow }));

    case "OPEN_DISPUTE": {
      const dispute = { id: uid("d"), projectId: a.projectId, openedBy: a.by, reason: a.reason, status: "open", resolution: null, createdAt: dayOffset(0) };
      return { ...mapProject(state, a.projectId, (p) => ({ ...p, disputeId: dispute.id })), disputes: [dispute, ...state.disputes] };
    }
    case "RESOLVE_DISPUTE": {
      const dispute = state.disputes.find((x) => x.id === a.id);
      if (!dispute) return state;
      const next = { ...state, disputes: state.disputes.map((x) => (x.id === a.id ? { ...x, status: "resolved", resolution: a.resolution, resolvedAt: dayOffset(0) } : x)) };
      return mapProject(next, dispute.projectId, (p) =>
        a.resolution === "release"
          ? { ...p, status: "completed", escrow: "released", completedAt: dayOffset(0), disputeId: null }
          : { ...p, status: "cancelled", escrow: "refunded", disputeId: null },
      );
    }

    case "WITHDRAW":
      return { ...state, payouts: [...state.payouts, { id: uid("po"), studentId: a.studentId, amount: a.amount, date: dayOffset(0) }] };

    case "VERIFY_STUDENT":
      return { ...state, students: state.students.map((s) => (s.id === a.id ? { ...s, verification: a.status } : s)) };
    case "VERIFY_CLIENT":
      return { ...state, clients: state.clients.map((c) => (c.id === a.id ? { ...c, verification: a.status } : c)) };
    case "MODERATE_PROJECT":
      return mapProject(state, a.id, (p) => ({ ...p, moderation: a.status, flagReason: a.status === "approved" ? null : p.flagReason }));
    case "ADD_WAITLIST":
      return { ...state, waitlist: [{ ...a.entry, id: state.waitlist.length + 1 }, ...state.waitlist] };
    default:
      return state;
  }
}

const StoreContext = createContext(null);
const ToastContext = createContext(() => {});

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [toasts, setToasts] = useState([]);
  const timers = useRef([]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* abaikan */
    }
  }, [state]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const toast = useCallback((message, tone = "success") => {
    const id = uid("t");
    setToasts((t) => [...t, { id, message, tone }]);
    timers.current.push(setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800));
  }, []);

  const actions = useMemo(
    () => ({
      reset: () => dispatch({ type: "RESET" }),
      login: (role, id) => dispatch({ type: "LOGIN", role, id }),
      loginDemo: (role) => dispatch({ type: "LOGIN", role, id: DEMO_IDS[role] }),
      logout: () => dispatch({ type: "LOGOUT" }),
      registerStudent: (student) => dispatch({ type: "REGISTER_STUDENT", student }),
      registerClient: (client) => dispatch({ type: "REGISTER_CLIENT", client }),
      updateStudent: (id, patch) => dispatch({ type: "UPDATE_STUDENT", id, patch }),
      updateClient: (id, patch) => dispatch({ type: "UPDATE_CLIENT", id, patch }),
      postProject: (project) => dispatch({ type: "POST_PROJECT", project }),
      apply: (projectId, application) => dispatch({ type: "APPLY", projectId, application }),
      withdrawApplication: (projectId, studentId) => dispatch({ type: "WITHDRAW_APPLICATION", projectId, studentId }),
      hire: (projectId, applicationId) => dispatch({ type: "HIRE", projectId, applicationId }),
      fund: (projectId) => dispatch({ type: "FUND", projectId }),
      toggleMilestone: (projectId, milestoneId) => dispatch({ type: "TOGGLE_MILESTONE", projectId, milestoneId }),
      submitWork: (projectId) => dispatch({ type: "SUBMIT_WORK", projectId }),
      requestRevision: (projectId, note) => dispatch({ type: "REQUEST_REVISION", projectId, note }),
      approve: (projectId, rating, text) => dispatch({ type: "APPROVE", projectId, rating, text }),
      cancelProject: (projectId) => dispatch({ type: "CANCEL_PROJECT", projectId }),
      openDispute: (projectId, by, reason) => dispatch({ type: "OPEN_DISPUTE", projectId, by, reason }),
      resolveDispute: (id, resolution) => dispatch({ type: "RESOLVE_DISPUTE", id, resolution }),
      withdraw: (studentId, amount) => dispatch({ type: "WITHDRAW", studentId, amount }),
      verifyStudent: (id, status) => dispatch({ type: "VERIFY_STUDENT", id, status }),
      verifyClient: (id, status) => dispatch({ type: "VERIFY_CLIENT", id, status }),
      moderateProject: (id, status) => dispatch({ type: "MODERATE_PROJECT", id, status }),
      addWaitlist: (entry) => dispatch({ type: "ADD_WAITLIST", entry }),
    }),
    [],
  );

  const value = useMemo(() => {
    const { session } = state;
    const me =
      session?.role === "mahasiswa" ? state.students.find((s) => s.id === session.id)
      : session?.role === "klien" ? state.clients.find((c) => c.id === session.id)
      : session?.role === "admin" ? state.admins.find((a) => a.id === session.id)
      : null;
    return {
      ...state,
      me,
      role: me ? session.role : null,
      studentById: (id) => state.students.find((s) => s.id === id),
      clientById: (id) => state.clients.find((c) => c.id === id),
      projectById: (id) => state.projects.find((p) => p.id === id),
      statsOf: (studentId) => studentStats(state.projects, state.payouts, studentId),
      calcFees,
      actions,
    };
  }, [state, actions]);

  return (
    <StoreContext.Provider value={value}>
      <ToastContext.Provider value={toast}>
        {children}
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`animate-fade-up pointer-events-auto max-w-md rounded-xl px-4 py-3 text-sm font-semibold shadow-pop ${
                t.tone === "error" ? "bg-red-600 text-white" : t.tone === "info" ? "bg-brand-700 text-white" : "bg-navy-900 text-white"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore harus dipakai di dalam StoreProvider");
  return ctx;
};
export const useToast = () => useContext(ToastContext);
