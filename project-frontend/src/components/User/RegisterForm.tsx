import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchStart as fetchCoefStart} from "../../store/coef/coefSlice";
import { fetchStart as fetchDietsStart } from "../../store/diets/dietSlice";
import { graphqlFetch } from "../../GraphQL/fecthRequest";

interface RegisterFormData {
    email: string;
    username: string;
    password: string;
    age: string;
    weight: number;
    height: number;
    activityCoefId: number;
    dietId: number;
}

const RegisterForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: coefs } = useSelector((state: RootState) => state.coef);
    const { data: diets } = useSelector((state: RootState) => state.diets);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();

    useEffect(() => {
        dispatch(fetchCoefStart());
        dispatch(fetchDietsStart());
    }, [dispatch]);

    const onSubmit = async (data: RegisterFormData) => {
        const registerMutation = `
            mutation RegisterUser($user: RegisterInput!) {
              registerUser(user: $user) {
                success
                data {
                  token
                }
                message
              }
            }
        `;

        const userPayload = {
            email: data.email,
            hashPass: data.password,
            username: data.username,
            age: new Date(data.age).toISOString(),
            weight: +data.weight,
            height: +data.height,
            activityCoefId: +data.activityCoefId,
            dietId: +data.dietId,
        };

        try {
            const res = await graphqlFetch<{
                registerUser: { success: boolean; data?: { token: string }; message?: string };
            }>(registerMutation, { user: userPayload }, true);

            const result = res.data?.registerUser;

            if (res.errors) {
                console.error("GraphQL errors:", res.errors);
                alert(res.errors[0].message || "Registration failed");
                return;
            }

            if (result?.success) {
                console.log("Registration successful!");
                alert("Registered successfully!");
            } else {
                alert(result?.message || "Registration failed");
            }
        } catch (err) {
            console.error("Network or server error:", err);
            alert("Error during registration");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow-lg border-0 p-4">
                        <h3 className="text-center mb-4">User Registration</h3>

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
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("username", { required: "Username is required" })}
                                />
                                {errors.username && (
                                    <div className="invalid-feedback d-block">{errors.username.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "At least 6 characters" },
                                    })}
                                />
                                {errors.password && (
                                    <div className="invalid-feedback d-block">{errors.password.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Birthdate</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                                    {...register("age", { required: "Birthdate is required" })}
                                />
                                {errors.age && (
                                    <div className="invalid-feedback d-block">{errors.age.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="form-control"
                                    {...register("weight", { required: "Weight is required" })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Height (cm)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="form-control"
                                    {...register("height", { required: "Height is required" })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Activity Coefficient</label>
                                <select
                                    className="form-select"
                                    {...register("activityCoefId", { required: "Please select activity" })}
                                >
                                    <option value="">Select...</option>
                                    {coefs.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} ({c.value})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Diet Type</label>
                                <select
                                    className="form-select"
                                    {...register("dietId", { required: "Please select diet" })}
                                >
                                    <option value="">Select...</option>
                                    {diets.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 mt-3">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;