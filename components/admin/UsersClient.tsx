"use client";

import { useActionState, useState } from "react";
import { Plus, ShieldCheck, Trash2, X, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import {
  createAdminUserAction,
  deleteAdminUserAction,
  toggleAdminUserStatusAction,
  type UserActionState,
} from "@/app/admin/actions";

export type AdminUserItem = {
  user_id: string;
  email: string;
  role: "owner" | "editor";
  active: boolean;
  created_at: string;
};

const initialState: UserActionState = {};

export function UsersClient({
  users,
  currentAdminId,
  isOwner,
}: {
  users: AdminUserItem[];
  currentAdminId: string;
  isOwner: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    async (prev: UserActionState, formData: FormData) => {
      const res = await createAdminUserAction(prev, formData);
      if (res?.success) {
        setModalOpen(false);
      }
      return res;
    },
    initialState
  );

  async function handleToggle(user: AdminUserItem) {
    if (user.user_id === currentAdminId) return;
    setTogglingId(user.user_id);
    try {
      await toggleAdminUserStatusAction(user.user_id, user.active);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(user: AdminUserItem) {
    if (user.user_id === currentAdminId) return;
    if (!confirm(`Are you sure you want to remove administrator ${user.email}?`)) return;
    setDeletingId(user.user_id);
    try {
      await deleteAdminUserAction(user.user_id);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">Settings</p>
          <h1 className="mt-2 font-serif text-4xl text-[#0B1F33] sm:text-5xl">Admin Users</h1>
          <p className="mt-2 text-sm text-[#667085]">
            Only registered admin users can access this dashboard. Public signups are disabled.
          </p>
        </div>
        {isOwner && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#D96B2B] px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#BC5420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B]"
          >
            <Plus className="size-4" />
            Add Admin User
          </button>
        )}
      </div>

      {state.success && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <span>{state.success}</span>
        </div>
      )}

      {/* Users Table */}
      <section className="mt-8 overflow-hidden rounded-xl border border-[#E7DDD2] bg-white shadow-sm">
        <div className="hidden grid-cols-[minmax(220px,1.5fr)_130px_130px_140px_100px] gap-4 border-b border-[#E7DDD2] bg-[#FFF9F2] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.12em] text-[#667085] md:grid">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Added</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-[#F0EAE2]">
          {users.map((user) => {
            const isSelf = user.user_id === currentAdminId;
            return (
              <div
                key={user.user_id}
                className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(220px,1.5fr)_130px_130px_140px_100px] md:items-center md:gap-4 md:px-6"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0B1F33] text-xs font-bold text-white">
                    {user.email.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <b className="block truncate text-sm text-[#0B1F33]">{user.email}</b>
                    {isSelf && (
                      <span className="inline-block rounded bg-[#FFF0E6] px-1.5 py-0.5 text-[10px] font-bold text-[#D96B2B]">
                        Current session
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold capitalize text-[#0B1F33]">
                    <ShieldCheck className="size-3.5 text-[#D96B2B]" />
                    {user.role}
                  </span>
                </div>

                <div>
                  {isOwner && !isSelf ? (
                    <button
                      type="button"
                      disabled={togglingId === user.user_id}
                      onClick={() => handleToggle(user)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-opacity hover:opacity-80 ${
                        user.active ? "bg-[#EDF9F1] text-[#198754]" : "bg-[#FFF1F0] text-[#DC3545]"
                      } ${togglingId === user.user_id ? "opacity-50" : ""}`}
                      title="Click to toggle status"
                    >
                      {user.active ? "ACTIVE" : "INACTIVE"}
                    </button>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        user.active ? "bg-[#EDF9F1] text-[#198754]" : "bg-[#FFF1F0] text-[#DC3545]"
                      }`}
                    >
                      {user.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#667085]">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="flex justify-start md:justify-end">
                  {isOwner && !isSelf ? (
                    <button
                      type="button"
                      disabled={deletingId === user.user_id}
                      onClick={() => handleDelete(user)}
                      className="grid size-8 place-items-center rounded-lg text-[#98A2B3] transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                      title="Remove administrator"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  ) : (
                    <span className="text-xs text-[#98A2B3]">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#071827]/60 backdrop-blur-sm"
            onClick={() => !isPending && setModalOpen(false)}
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E7DDD2] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0EAE2] pb-4">
              <h2 className="font-serif text-2xl text-[#0B1F33]">Add Administrator</h2>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setModalOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-[#667085] hover:bg-[#F3E8DA]"
              >
                <X className="size-4" />
              </button>
            </div>

            {state.error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@example.com"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#E7DDD2] bg-white px-3 text-sm outline-none transition-colors focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                  Initial Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    className="h-11 w-full rounded-lg border border-[#E7DDD2] bg-white pl-3 pr-10 text-sm outline-none transition-colors focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#667085] hover:text-[#0B1F33]"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  The new user will use this password to sign in at /admin/login.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue="editor"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#E7DDD2] bg-white px-3 text-sm font-medium text-[#0B1F33] outline-none transition-colors focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10"
                >
                  <option value="editor">Editor (Can edit content & view leads)</option>
                  <option value="owner">Owner (Full administrative rights)</option>
                </select>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setModalOpen(false)}
                  className="h-10 rounded-lg px-4 text-xs font-bold text-[#667085] hover:bg-[#F3E8DA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-10 rounded-lg bg-[#D96B2B] px-5 text-xs font-bold text-white transition-colors hover:bg-[#BC5420] disabled:opacity-60"
                >
                  {isPending ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
