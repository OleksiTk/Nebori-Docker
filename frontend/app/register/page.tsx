"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

type RegisterFormState = {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
};

type RegisterErrors = Partial<Record<keyof RegisterFormState, string>> & {
  detail?: string;
};

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:8002"
).replace(/\/$/, "");

const initialFormState: RegisterFormState = {
  username: "",
  email: "",
  password: "",
  password_confirm: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof RegisterFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        detail?: string;
        errors?: RegisterErrors;
        access?: string;
        token?: string;
        user?: {
          id: number;
          username: string;
          email: string;
        };
      };

      if (!response.ok) {
        setErrors(
          payload.errors ?? {
            detail: payload.detail ?? "Не вдалося створити акаунт.",
          },
        );
        return;
      }

      setMessage(payload.message ?? "Користувача створено успішно.");
      const accessToken = payload.access || payload.token;
      if (accessToken && payload.user) {
        login(accessToken, payload.user);
      }
      setFormState(initialFormState);
      router.push("/profile");
    } catch {
      setErrors({ detail: "Не вдалося підключитися до сервера реєстрації." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(15,17,23,0.92)_0%,rgba(17,20,30,0.96)_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-[#f5c518]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-[#6aa8ff]/10 blur-3xl" />

      <div className="relative grid ">
        <div className="space-y-6 w-full">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-nebori-accent">
              Account setup
            </p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-nebori-text sm:text-5xl">
              Створіть акаунт
            </h1>
          </div>
          <div className="flex justify-center items-center ">
            {" "}
            <div
              style={{ width: " 800px" }}
              className="panel rounded-[22px] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-nebori-text">
                    Реєстрація
                  </h2>
                  <p className="mt-1 text-sm text-nebori-muted">
                    Заповніть форму, щоб створити нового користувача.
                  </p>
                </div>
                <Link href="/" className="btn-ghost px-4 py-2 text-sm">
                  На головну
                </Link>
              </div>

              <form className="mt-5 space-y-4 " onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-sm font-medium text-nebori-text">
                      Username
                    </span>
                    <input
                      type="text"
                      value={formState.username}
                      onChange={(event) =>
                        updateField("username", event.target.value)
                      }
                      autoComplete="username"
                      className="w-full rounded-[6px] border border-[rgba(255,255,255,0.12)] bg-[#11141d] px-3 py-3 text-nebori-text outline-none transition focus:border-[#f5c518]"
                      placeholder="nebori_user"
                    />
                    {errors.username ? (
                      <span className="block text-sm text-[#ffb4b4]">
                        {errors.username}
                      </span>
                    ) : null}
                  </label>

                  <label className="space-y-2">
                    <span className="block text-sm font-medium text-nebori-text">
                      Email
                    </span>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      autoComplete="email"
                      className="w-full rounded-[6px] border border-[rgba(255,255,255,0.12)] bg-[#11141d] px-3 py-3 text-nebori-text outline-none transition focus:border-[#f5c518]"
                      placeholder="name@example.com"
                    />
                    {errors.email ? (
                      <span className="block text-sm text-[#ffb4b4]">
                        {errors.email}
                      </span>
                    ) : null}
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-sm font-medium text-nebori-text">
                      Password
                    </span>
                    <input
                      type="password"
                      value={formState.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      autoComplete="new-password"
                      className="w-full rounded-[6px] border border-[rgba(255,255,255,0.12)] bg-[#11141d] px-3 py-3 text-nebori-text outline-none transition focus:border-[#f5c518]"
                      placeholder="Minimum 8 characters"
                    />
                    {errors.password ? (
                      <span className="block text-sm text-[#ffb4b4]">
                        {errors.password}
                      </span>
                    ) : null}
                  </label>

                  <label className="space-y-2">
                    <span className="block text-sm font-medium text-nebori-text">
                      Confirm password
                    </span>
                    <input
                      type="password"
                      value={formState.password_confirm}
                      onChange={(event) =>
                        updateField("password_confirm", event.target.value)
                      }
                      autoComplete="new-password"
                      className="w-full rounded-[6px] border border-[rgba(255,255,255,0.12)] bg-[#11141d] px-3 py-3 text-nebori-text outline-none transition focus:border-[#f5c518]"
                      placeholder="Repeat your password"
                    />
                    {errors.password_confirm ? (
                      <span className="block text-sm text-[#ffb4b4]">
                        {errors.password_confirm}
                      </span>
                    ) : null}
                  </label>
                </div>

                {errors.detail ? (
                  <div className="rounded-[8px] border border-[#6a2b2b] bg-[#2a1515] px-4 py-3 text-sm text-[#ffb4b4]">
                    {errors.detail}
                  </div>
                ) : null}
                {message ? (
                  <div className="rounded-[8px] border border-[rgba(245,197,24,0.24)] bg-[rgba(245,197,24,0.08)] px-4 py-3 text-sm text-[#ffe289]">
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full px-5 py-3 text-base disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
