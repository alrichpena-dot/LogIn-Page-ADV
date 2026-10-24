"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: number;
  title: string;
  body: string;
};

export default function NotesPage() {
  const router = useRouter();
  const [ready, setReady] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [error, setError] = useState<string>("");

  // route guard + load saved data
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace("/");
      return;
    }
    const email = localStorage.getItem("userEmail") || "";
    setUsername(email.split("@")[0]);
    setNotes(JSON.parse(localStorage.getItem("notes") || "[]"));
    setReady(true);
  }, [router]);

  // save notes whenever they change
  useEffect(() => {
    if (ready) localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes, ready]);

  const addNote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      return setError("Please fill in both the title and the note.");
    }
    setNotes([
      { id: Date.now(), title: title.trim(), body: body.trim() },
      ...notes,
    ]);
    setTitle("");
    setBody("");
    setError("");
  };

  const deleteNote = (id: number) => setNotes(notes.filter((n) => n.id !== id));

  // Bonus 2: logout returns to the login screen
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  if (!ready) return null;

  return (
    <main className="notes-page">
      <header className="topbar">
        <div>
          <h1>Let's get started!</h1>
          <p>
            Hi, {username || "friend"}! You have {notes.length}{" "}
            {notes.length === 1 ? "note" : "notes"} 🌸
          </p>
        </div>
        <button className="pill-btn outline" onClick={logout}>
          Logout
        </button>
      </header>

      <form className="note-form" onSubmit={addNote}>
        <h2>New note</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
        />
        <textarea
          placeholder="Write your note..."
          rows={3}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setError("");
          }}
        />
        <button type="submit" className="pill-btn">Add note</button>
        {error && (
          <p className="msg-error" role="alert">
            {error}
          </p>
        )}
      </form>

      <section className="grid">
        {notes.length === 0 && (
          <p className="empty">No notes yet. Add your first one! 💕</p>
        )}
        {notes.map((n, i) => (
          <article key={n.id} className={`note c${i % 4}`}>
            <h3>{n.title}</h3>
            <p>{n.body}</p>
            <small>{new Date(n.id).toLocaleDateString()}</small>
            <button className="btn-delete" onClick={() => deleteNote(n.id)}>
              Delete
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}