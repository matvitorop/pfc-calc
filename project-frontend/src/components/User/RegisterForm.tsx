import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
    fetchStart as fetchCoefStart,
    fetchSuccess as fetchCoefSuccess,
    fetchFailure as fetchCoefError,
} from "../../store/coef/coefSlice";

//import { fetchActivityCoefficients } from "../../store/coef/coefAPI";

import {
    fetchStart as fetchDietsStart,
    fetchSuccess as fetchDietsSuccess,
    fetchFailure as fetchDietsError,
} from "../../store/diets/dietSlice";
import { fetchDiets } from "../../store/diets/dietAPI";

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
        const loadData = async () => {
            dispatch(fetchCoefStart());

            dispatch(fetchDietsStart());
            try {
                const result = await fetchDiets();
                dispatch(fetchDietsSuccess(result));
            } catch (err: any) {
                dispatch(fetchDietsError(err.message));
            }
        };
        loadData();
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
            weight: parseFloat(data.weight.toString()),
            height: parseFloat(data.height.toString()),
            activityCoefId: parseInt(data.activityCoefId.toString(), 10),
            dietId: parseInt(data.dietId.toString(), 10),
        };

        try {
            const res = await fetch("https://localhost:7049/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: registerMutation,
                    variables: { user: userPayload },
                }),
            });

            const json = await res.json();

            if (json.errors) {
                console.error("GraphQL errors:", json.errors);
                alert(json.errors[0].message || "Registration failed");
                return;
            }

            const result = json.data?.registerUser;

            if (result?.success) {
                console.log("Registration successful!");
                console.log("Token:", result.data.token);
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