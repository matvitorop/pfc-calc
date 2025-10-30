import React from "react";
import { useForm } from "react-hook-form";

interface LoginFormData {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        const loginMutation = `
      mutation Login($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          success
          data {
            token
          }
          message
        }
      }
    `;

        try {
            const res = await fetch("https://localhost:7049/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: loginMutation,
                    variables: {
                        email: data.email,
                        password: data.password,
                    },
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Server error:", res.status, text);
                alert("Server error");
                return;
            }

            const json = await res.json();

            if (json.errors) {
                console.error("GraphQL errors:", json.errors);
                alert(json.errors[0].message || "Login failed");
                return;
            }

            const result = json.data?.loginUser;

            if (result?.success) {
                console.log("Login successful!");
                console.log("Token:", result.data.token);
                // тут можна зберегти токен у cookie або redux
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
                                    className="form-control"
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
                                    className="form-control"
                                    {...register("password", { required: "Password is required" })}
                                />
                                {errors.password && (
                                    <div className="invalid-feedback d-block">{errors.password.message}</div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary w-100 mt-3">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;