"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import ProfileEditor from "@/components/profile-editor";

type ProfileResponse = {
  message?: string;
  profile?: {
    id: number;
    username: string;
    email: string;
    bio: string;
  };
  detail?: string;
};

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_USER_API_URL ?? "http://localhost:8003"
).replace(/\/$/, "");

export default function ProfilePlaceholderPage() {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse["profile"] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/register");
      return;
    }
    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiBaseUrl}/api/user/profile/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = (await response
          .json()
          .catch(() => ({}))) as ProfileResponse;

        if (!response.ok) {
          throw new Error(payload.detail ?? "Failed to load profile.");
        }

        if (!cancelled) {
          setProfile(payload.profile ?? null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load profile.",
          );
          setProfile({
            id: user?.id ?? 0,
            username: user?.username ?? "unknown",
            email: user?.email ?? "unknown",
            bio: "Profile data is temporarily unavailable from the user service.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, router, token, user?.email, user?.id, user?.username]);

  if (!isAuthenticated || !user || !token) {
    return (
      <section className="rounded-[20px] border border-[rgba(255,255,255,0.12)] bg-nebori-panel p-8 text-center">
        <p className="text-sm text-nebori-muted">
          Перенаправлення до реєстрації...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl rounded-[22px] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(180deg,rgba(15,17,23,0.96)_0%,rgba(19,23,35,0.96)_100%)] p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-nebori-accent">
        Authenticated profile
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-nebori-text">
        Вітаємо, {user.username}
      </h1>
      <ProfileEditor />
      <p className="mt-2 text-nebori-muted">
        {loading
          ? "Завантажуємо основну інформацію користувача..."
          : "Тут показано базову інформацію, яку повертає user service."}
      </p>

      {error ? (
        <div className="mt-4 rounded-[12px] border border-[rgba(255,190,120,0.24)] bg-[rgba(255,190,120,0.08)] px-4 py-3 text-sm text-[#ffd9b5]">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[14px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4">
          <p className="text-xs uppercase tracking-[0.08em] text-nebori-muted">
            User ID
          </p>
          <p className="mt-1 text-lg text-nebori-text">
            {profile?.id ?? user.id}
          </p>
        </div>
        <div className="rounded-[14px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4">
          <p className="text-xs uppercase tracking-[0.08em] text-nebori-muted">
            Email
          </p>
          <p className="mt-1 text-lg text-nebori-text">
            {profile?.email ?? user.email}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[14px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4">
        <p className="text-xs uppercase tracking-[0.08em] text-nebori-muted">
          Username
        </p>
        <p className="mt-1 text-lg text-nebori-text">
          {profile?.username ?? user.username}
        </p>
      </div>

      <div className="mt-4 rounded-[14px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4">
        <p className="text-xs uppercase tracking-[0.08em] text-nebori-muted">
          Bio
        </p>
        <p className="mt-1 text-sm leading-6 text-nebori-text">
          {profile?.bio ??
            "Profile information from the user service will appear here."}
        </p>
      </div>

      <div className="mt-6 rounded-[14px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4">
        <p className="text-xs uppercase tracking-[0.08em] text-nebori-muted">
          JWT preview
        </p>
        <p className="mt-2 break-all font-mono text-xs text-[#c8d2e8]">
          {token.slice(0, 72)}...
        </p>
      </div>

      <div className="mt-6">
        <Link href="/" className="btn-ghost px-4 py-2 text-sm">
          На головну
        </Link>
      </div>
    </section>
  );
}
