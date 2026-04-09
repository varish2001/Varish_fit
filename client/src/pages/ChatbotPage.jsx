import { useState } from "react";
import { api } from "../lib/api";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ask me anything about workouts, posture, nutrition, hydration, or recovery." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/chat", { message: userMessage.content });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Unable to fetch response right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-3xl font-bold text-ink">AI Fitness Assistant</h1>
      <div className="glass h-[60vh] overflow-y-auto p-4">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                msg.role === "user" ? "ml-auto bg-coral text-white" : "bg-white text-slate"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How to improve squat form?"
          className="flex-1 rounded-xl border border-slate/20 bg-white px-4 py-3 outline-none ring-coral focus:ring-2"
        />
        <button disabled={loading} className="rounded-xl bg-slate px-5 py-3 font-semibold text-white">
          {loading ? "..." : "Send"}
        </button>
      </form>
    </section>
  );
}
