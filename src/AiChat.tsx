import { useState } from "react";
import API_URL, { fetchWithAuth } from "./config";

interface Message {
  role: "user" | "ai";
  text: string;
}

function AiChat() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    const response = await fetchWithAuth(`${API_URL}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: "var(--accent)",
          borderRadius: "9999px",
          width: "52px",
          height: "52px",
          zIndex: 100,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        className="flex items-center justify-center transition hover:opacity-80"
      >
        <span style={{ color: "#000", fontSize: "22px" }}>
          {open ? "✕" : "✦"}
        </span>
      </button>

      {/* Chat okno */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "88px",
            right: "24px",
            width: "320px",
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            zIndex: 100,
            boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
          }}
          className="border flex flex-col"
        >
          {/* Header */}
          <div
            style={{
              borderBottomColor: "var(--border)",
              borderRadius: "var(--radius) var(--radius) 0 0",
            }}
            className="border-b px-4 py-3"
          >
            <p
              style={{ color: "var(--text-primary)" }}
              className="text-sm font-medium"
            >
              AI Asistent
            </p>
            <p style={{ color: "var(--text-muted)" }} className="text-xs">
              Zeptej se na termíny nebo zákazníky
            </p>
          </div>

          {/* Zprávy */}
          <div
            className="flex flex-col gap-2 p-4 overflow-y-auto"
            style={{ maxHeight: "300px" }}
          >
            {messages.length === 0 && (
              <p
                style={{ color: "var(--text-muted)" }}
                className="text-xs text-center"
              >
                Např: "Kdy mám Karla?" nebo "Kolik termínů mám tento týden?"
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  backgroundColor:
                    m.role === "user" ? "var(--accent)" : "var(--bg-card)",
                  borderRadius: "var(--radius-sm)",
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
                className="px-3 py-2"
              >
                <p
                  style={{
                    color: m.role === "user" ? "#000" : "var(--text-primary)",
                  }}
                  className="text-xs"
                >
                  {m.text}
                </p>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "var(--radius-sm)",
                  alignSelf: "flex-start",
                }}
                className="px-3 py-2"
              >
                <p style={{ color: "var(--text-muted)" }} className="text-xs">
                  Přemýšlím...
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{ borderTopColor: "var(--border)" }}
            className="border-t p-3 flex gap-2"
          >
            <input
              type="text"
              placeholder="Napiš dotaz..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                borderRadius: "var(--radius-sm)",
              }}
              className="flex-1 border px-3 py-2 focus:outline-none text-xs"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                backgroundColor: "var(--accent)",
                borderRadius: "var(--radius-sm)",
              }}
              className="px-3 py-2 text-xs text-gray-900 font-medium transition hover:opacity-80"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AiChat;
