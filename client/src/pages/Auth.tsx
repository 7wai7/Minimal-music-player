import { useRef, useState } from "react";
import "../styles/Auth.css";
import { authFetch } from "../API/auth";
import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import useFieldErrors from "../hooks/useFieldErrors";
import { Input } from "../components/ui/Input";
import { useAuthDataStore } from "../stores/AuthDataStore";


function Auth() {
    const { setUser } = useUser();
    const clearForm = useAuthDataStore(s => s.clearForm);
    const navigate = useNavigate();
    const [isSignup, setSignup] = useState(true);

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
        setGlobalError(null);

        const authData = useAuthDataStore.getState().authForm;
        authFetch(authData, isSignup)
            .then(user => {
                discImgRef.current?.classList.toggle('hide');
                setTimeout(() => {
                    clearForm();
                    setUser(user);
                    navigate("/");
                }, 1500);
            })
            .catch(err => {
                if (err.errors) {
                    showErrors(err.errors);
                } else {
                    setGlobalError(err.message || "Unexpected error");
                }
            })
            .finally(() => setIsAnimating(false))
    }

    return (
        <form className="auth-form" onSubmit={submitHandler}>
            <section className="form-inputs">
                <div className="input-wrapper">
                    <Input
                        store={useAuthDataStore}
                        selector={s => s.authForm.login ?? ""}
                        setField={(store, value) => store.getState().setAuthForm("login", value)}
                        type="text"
                        name="login"
                        required
                        placeholder="Login"
                        className={authErrors.login ? 'error' : ''}
                    />
                    {authErrors.login && (
                        <div className="error-message">{authErrors.login.message}</div>
                    )}
                </div>

                {isSignup && (
                    <div className="input-wrapper">
                        <Input
                            store={useAuthDataStore}
                            selector={s => s.authForm.email ?? ""}
                            setField={(store, value) => store.getState().setAuthForm("email", value)}
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                            className={authErrors.email ? 'error' : ''}
                        />
                        {authErrors.email && (
                            <div className="error-message">{authErrors.email.message}</div>
                        )}
                    </div>
                )}

                <div className="input-wrapper">
                    <Input
                        store={useAuthDataStore}
                        selector={s => s.authForm.password ?? ""}
                        setField={(store, value) => store.getState().setAuthForm("password", value)}
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                        className={authErrors.password ? 'error' : ''}
                    />
                    {authErrors.password && (
                        <div className="error-message">{authErrors.password.message}</div>
                    )}
                </div>
            </section>
            <FormActions isSignup={isSignup} setSignup={setSignup} />
            {globalError && <div className="global-error">{globalError}</div>}

            <img src="/disc-album-cover.png" className="disc-img" ref={discImgRef} />
        </form>
    );
}

function FormActions({
    isSignup,
    setSignup
}: {
    isSignup: boolean,
    setSignup: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const authData = useAuthDataStore(s => s.authForm);

    return (
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
    )
}

export default Auth;