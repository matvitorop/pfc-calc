import React from "react";
import { useForm } from "react-hook-form";
import { graphqlFetch } from "../../GraphQL/fetchRequest";

interface LoginFormData {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();

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
                console.log("Token:", result.data?.token);
                alert("Logged in successfully!");
            } else {
                alert(result?.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Network or server error:", err);
            alert("Error during login");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow-lg border-0 p-4">
                        <h3 className="text-center mb-4">Login</h3>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    {...register("email", { required: "Email is required" })}
                                />
                                {errors.email && (
                                    <div className="invalid-feedback d-block">{errors.email.message}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        }
                                    })}
                                />
                                {errors.password && (
                                    <div className="invalid-feedback d-block">{errors.password.message}</div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100 mt-3"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
