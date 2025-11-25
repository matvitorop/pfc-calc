import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchStart as fetchCoefStart} from "../../store/coef/coefSlice";
import { fetchStart as fetchDietsStart } from "../../store/diets/dietSlice";
import { graphqlFetch } from "../../GraphQL/fetchRequest";
import { useAppSelector } from '../../hooks/redux';
import "../../../css/regist-login.css";
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
    const { data: coefs } = useSelector((state: RootState) => state.coefReducer);
    const { data: diets } = useSelector((state: RootState) => state.dietReducer);
    const darkTheme = useAppSelector(state => state.themeReducer.isDarkTheme);

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
        <div className={`main-page ${darkTheme ? "dark-theme" : ""}`}>
            <div className="main-container login-container">

                <h1 className="login-title">User Registration</h1>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="login-form">

                    <div className="form-row">
                        <label className="form-label-custom">Email</label>
                        <input
                            type="email"
                            className={`form-input-custom ${errors.email ? "invalid-input" : ""}`}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email format",
                                },
                            })}
                        />
                        {errors.email && <p className="error-text">{errors.email.message}</p>}
                    </div>

                    <div className="form-row">
                        <label className="form-label-custom">Username</label>
                        <input
                            type="text"
                            className={`form-input-custom ${errors.username ? "invalid-input" : ""}`}
                            {...register("username", { required: "Username is required" })}
                        />
                        {errors.username && <p className="error-text">{errors.username.message}</p>}
                    </div>

                    <div className="form-row">
                        <label className="form-label-custom">Password</label>
                        <input
                            type="password"
                            className={`form-input-custom ${errors.password ? "invalid-input" : ""}`}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                            })}
                        />
                        {errors.password && <p className="error-text">{errors.password.message}</p>}
                    </div>

                    <div className="form-row">
                        <label className="form-label-custom">Birthdate</label>
                        <input
                            type="date"
                            className={`form-input-custom ${errors.age ? "invalid-input" : ""}`}
                            {...register("age", { required: "Birthdate is required" })}
                        />
                        {errors.age && <p className="error-text">{errors.age.message}</p>}
                    </div>

                    <div className="form-row">
                        <label className="form-label-custom">Weight (kg)</label>
                        <input
                            type="number"
                            step="0.1"
                            className={`form-input-custom ${errors.weight ? "invalid-input" : ""}`}
                            {...register("weight", {
                                required: "Weight is required",
                                min: { value: 1, message: "Weight must be positive" },
                            })}
                        />
                        {errors.weight && <p className="error-text">{errors.weight.message}</p>}
                    </div>

                    <div className="form-row">
                        <label className="form-label-custom">Height (cm)</label>
                        <input
                            type="number"
                            step="0.1"
                            className={`form-input-custom ${errors.height ? "invalid-input" : ""}`}
                            {...register("height", {
                                required: "Height is required",
                                min: { value: 1, message: "Height must be positive" },
                            })}
                        />
                        {errors.height && <p className="error-text">{errors.height.message}</p>}
                    </div>

                    <div className="form-row">
                        <label className="form-label-custom">Activity Coefficient</label>
                        <select
                            className={`form-select-custom ${errors.activityCoefId ? "invalid-input" : ""}`}
                            {...register("activityCoefId", { required: "Please select activity" })}
                        >
                            <option value="">Select...</option>
                            {coefs.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.value})
                                </option>
                            ))}
                        </select>
                        {errors.activityCoefId && <p className="error-text">{errors.activityCoefId.message}</p>}
                    </div>

                    <div className="form-row">
                        <label className="form-label-custom">Diet Type</label>
                        <select
                            className={`form-select-custom ${errors.dietId ? "invalid-input" : ""}`}
                            {...register("dietId", { required: "Please select diet" })}
                        >
                            <option value="">Select...</option>
                            {diets.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        {errors.dietId && <p className="error-text">{errors.dietId.message}</p>}
                    </div>

                    <button type="submit" className="confirm-btn submit-btn">Register</button>
                </form>
            </div>
        </div>
    );

};

export default RegisterForm;