"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

const MIN_PASSWORD_LENGTH = 6; // password must be MORE than this

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // already logged in? skip the login screen
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.replace("/notes");
    }
  }, [router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return setError("Email is required.");
    }
    if (!cleanEmail.endsWith("@gmail.com") || cleanEmail === "@gmail.com") {
      return setError("Email must be a valid @gmail.com address.");
    }
    if (password.length <= MIN_PASSWORD_LENGTH) {
      return setError(
        `Password must be more than ${MIN_PASSWORD_LENGTH} characters.`
      );
    }

    setError("");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", cleanEmail);
    router.push("/notes");
  };

  return (
    <main className="stage">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="brand">Let's get started!</h1>
        <p className="tagline">Log in before continue</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <button
          type="button"
          className="link-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide password" : "Show password"}
        </button>

        <button type="submit" className="pill-btn">Log in</button>

        {/* Bonus 1: error message below the login button */}
        {error && (
          <p className="msg-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}