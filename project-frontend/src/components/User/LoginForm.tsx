import React from "react";
import { useForm } from "react-hook-form";
import { graphqlFetch } from "../../GraphQL/fetchRequest";
import { useAppSelector } from '../../hooks/redux';
import "../../../css/regist-login.css";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {

    const darkTheme = useAppSelector(state => state.themeReducer.isDarkTheme);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();

    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormData) => {
        const loginMutation = `
      mutation Login($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          success
          data { token }
          message
        }
      }
    `;

        try {
            const res = await graphqlFetch<{
                loginUser: { success: boolean; data?: { token: string }; message?: string };
            }>(
                loginMutation,
                { email: data.email, password: data.password },
                true
            );

            if (res.errors) {
                console.error("GraphQL errors:", res.errors);
                alert(res.errors[0].message || "Login failed");
                return;
            }

            const result = res.data?.loginUser;

            if (result?.success) {
                console.log("Login successful!");
                alert("Logged in successfully!");
                navigate("/");
            } else {
                alert(result?.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Network or server error:", err);
            alert("Error during login");
        }
    };

    return (
        <div className={`main-page ${darkTheme ? "dark-theme" : ""}`}>
            <div className="main-container login-container">
                <h1 className="login-title">Login</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="form-row">
                        <label className="form-label-custom">Email</label>
                        <input
                            type="email"
                            className={`form-input-custom ${errors.email ? "invalid-input" : ""}`}
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="error-text">{errors.email.message}</p>}
                    </div>

                    <div className="form-row">
                        <label className="form-label-custom">Password</label>
                        <input
                            type="password"
                            className={`form-input-custom ${errors.password ? "invalid-input" : ""}`}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            })}
                        />
                        {errors.password && <p className="error-text">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="confirm-btn submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );

};

export default LoginForm;
