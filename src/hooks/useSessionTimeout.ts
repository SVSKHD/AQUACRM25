import { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { signOut } from "@/store/slices/authSlice";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 60 * 1000; // 1 minute before timeout

export function useSessionTimeout() {
  const dispatch = useAppDispatch();
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const timeoutId = useRef<NodeJS.Timeout>();
  const warningTimeoutId = useRef<NodeJS.Timeout>();
  const countdownInterval = useRef<NodeJS.Timeout>();

  const resetTimers = () => {
    clearTimeout(timeoutId.current);
    clearTimeout(warningTimeoutId.current);
    clearInterval(countdownInterval.current);

    warningTimeoutId.current = setTimeout(() => {
      setShowTimeoutWarning(true);
      setTimeLeft(60);

      countdownInterval.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, SESSION_TIMEOUT - WARNING_TIME);

    timeoutId.current = setTimeout(() => {
      dispatch(signOut());
    }, SESSION_TIMEOUT);
  };

  useEffect(() => {
    const handleUserActivity = () => {
      if (showTimeoutWarning) {
        setShowTimeoutWarning(false);
      }
      resetTimers();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    resetTimers();

    return () => {
      clearTimeout(timeoutId.current);
      clearTimeout(warningTimeoutId.current);
      clearInterval(countdownInterval.current);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, [dispatch, showTimeoutWarning]);

  const handleStaySignedIn = () => {
    setShowTimeoutWarning(false);
    resetTimers();
  };

  const handleSignOut = () => {
    setShowTimeoutWarning(false);
    dispatch(signOut());
  };

  return {
    showTimeoutWarning,
    timeLeft,
    handleStaySignedIn,
    handleSignOut,
  };
}
