import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const IdleTimer = ({ timeout = 900000 }) => {
    const { logout } = useAuth();
    const timerRef = useRef();

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(logout, timeout);
    };

    useEffect (() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll'];

        events.forEach(event => {
            window.removeEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return null;

}

export default IdleTimer;