import { createContext, useCallback, useContext, useRef, useState } from "react";

interface ToastCtx {
  toast: (msg: string) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const toast = useCallback((text: string) => {
    setMsg(text);
    setShow(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShow(false), 2400);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className={"toast" + (show ? " show" : "")} role="status">
        {msg}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
