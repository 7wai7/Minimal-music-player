import { useRef, useState } from "react";
import "../styles/Auth.css";
import type AuthData from "../types/authData";
import { authFetch } from "../API/auth";
import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import useFieldErrors from "../hooks/useFieldErrors";


function Auth() {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [isSignup, setSignup] = useState(true);
    const [authData, setAuthData] = useState<AuthData>({
        login: undefined,
        email: undefined,
        password: undefined
    });

    const {
        errors: authErrors,
        showErrors
    } = useFieldErrors();
    const [globalError, setGlobalError] = useState<string | null>(null);

    const [isAnimating, setIsAnimating] = useState(false);
    const discImgRef = useRef<HTMLImageElement>(null);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAnimating) return;
        setIsAnimating(true);
        showErrors([]);

        authFetch(authData, isSignup)
            .then(user => {
                discImgRef.current?.classList.toggle('hide');
                setTimeout(() => {
                    setIsAnimating(false);
                    setUser(user);
                    navigate("/");
                }, 1500);
            })
            .catch(err => {
                setIsAnimating(false);
                if (err.errors) {
                    showErrors(err.errors);
                } else {
                    setGlobalError(err.message || "Unexpected error");
                }
            });
    }

    return (
        <form className="auth-form" onSubmit={submitHandler}>
            <section className="form-inputs">
                <div className="input-wrapper">
                    <input
                        type="text"
                        name="login"
                        required
                        placeholder="Login"
                        className={authErrors.login ? 'error' : ''}
                        value={authData.login ?? ""}
                        onChange={(e) => setAuthData({ ...authData, login: e.target.value })}
                    />
                    {authErrors.login && (
                        <div className="error-message">{authErrors.login.message}</div>
                    )}
                </div>

                {isSignup && (
                    <div className="input-wrapper">
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                            className={authErrors.email ? 'error' : ''}
                            value={authData.email ?? ""}
                            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                        />
                        {authErrors.email && (
                            <div className="error-message">{authErrors.email.message}</div>
                        )}
                    </div>
                )}

                <div className="input-wrapper">
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                        className={authErrors.password ? 'error' : ''}
                        value={authData.password ?? ""}
                        onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                    />
                    {authErrors.password && (
                        <div className="error-message">{authErrors.password.message}</div>
                    )}
                </div>
            </section>
            <div className="form-actions">
                <button type="button" onClick={() => setSignup(!isSignup)} className="toggle-auth-mode-btn">
                    {isSignup ? 'Already have an account?' : 'Create account.'}
                </button>
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={
                        isSignup
                            ? !(authData.login && authData.email && authData.password) // signup
                            : !(authData.login && authData.password) // login
                    }
                >{isSignup ? 'Signup' : 'Login'}</button>
            </div>
            {globalError && <div className="global-error">{globalError}</div>}

            <img src="/disc-album-cover.png" className="disc-img" ref={discImgRef} />
        </form>
    );
}

export default Auth;