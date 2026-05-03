"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";

const apiBase = (
  process.env.NEXT_PUBLIC_USER_API_URL ?? "http://localhost:8003"
).replace(/\/$/, "");

type Profile = {
  id?: number;
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  first_name?: string;
  last_name?: string;
};

export default function ProfileEditor() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/user/profile/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          // fallback to older endpoint
          const res2 = await fetch(`${apiBase}/api/user/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res2.ok) throw new Error("Failed to load profile");
          const payload2 = await res2.json();
          if (!canceled) setProfile(payload2);
        } else {
          const payload = await res.json();
          if (!canceled) setProfile(payload);
        }
      } catch (err) {
        // best-effort: use auth provider user as fallback
        if (!canceled) {
          setProfile({
            id: user?.id,
            username: user?.username,
            email: user?.email,
          });
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };
    void load();
    return () => {
      canceled = true;
    };
  }, [token, user?.id, user?.username, user?.email]);

  useEffect(() => {
    setFirstName((profile && (profile.first_name ?? "")) || "");
    setLastName((profile && (profile.last_name ?? "")) || "");
  }, [profile]);

  const saveName = async () => {
    setSavingName(true);
    setStatus("");
    try {
      const res = await fetch(`${apiBase}/api/user/profile/settings/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      });
      if (!res.ok) throw new Error("Failed to update name");
      setStatus("Name updated");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingName(false);
    }
  };

  const uploadAvatar = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setStatus("");
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await fetch(`${apiBase}/api/user/profile/change_avatar/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });
      if (!res.ok) throw new Error("Avatar upload failed");
      const payload = await res.json().catch(() => ({}));
      setStatus("Avatar updated");
      // refresh profile
      const refresh = await fetch(`${apiBase}/api/user/profile/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refresh.ok) {
        const p = await refresh.json();
        setProfile(p);
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-6 rounded-[14px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4">
      <h2 className="text-lg font-medium text-nebori-text">Edit profile</h2>

      <div className="mt-4 flex items-center gap-4">
        <img
          src={(profile && (profile.avatar as string)) || `/default-avatar.png`}
          alt="avatar"
          className="h-20 w-20 rounded-full object-cover"
        />
        <div>
          <label className="block text-sm text-nebori-muted">
            Change avatar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadAvatar(e.target.files?.[0])}
            className="mt-2 text-sm"
            disabled={uploading}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-nebori-muted">First name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-md bg-transparent border border-[rgba(255,255,255,0.06)] px-3 py-2 text-sm"
            placeholder="First name"
          />
        </div>

        <div>
          <label className="block text-xs text-nebori-muted">Last name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full rounded-md bg-transparent border border-[rgba(255,255,255,0.06)] px-3 py-2 text-sm"
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          className="btn-primary px-4 py-2 text-sm"
          onClick={saveName}
          disabled={savingName}
        >
          {savingName ? "Saving..." : "Save name"}
        </button>
        <span className="text-sm text-nebori-muted">{status}</span>
      </div>

      <p className="mt-3 text-xs text-nebori-muted">
        You can also update bio, website and location using the user service
        endpoints if desired.
      </p>
    </div>
  );
}
