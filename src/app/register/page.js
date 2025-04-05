"use client";
import { signIn } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    authProvider: "email",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");  
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    setPasswordValidation({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Form Data:", formData);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccessMessage("User registered successfully!");
        setShowPopup(true); 

        setTimeout(() => {
          router.push("/login");
        }, 2500);
      }else {
        const data = await res.json();
        if (data.error) {
          setErrorMessage(data.error); 
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage("");
      }, 2500); 
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-gray-900 lg:text-3xl text-2xl font-bold mb-8">
          Register
        </h3>

        {/* Success Popup */}
        {successMessage && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50"
            onClick={() => setSuccessMessage(false)}
          >
            <div
              className="bg-green-100 text-green-700 p-6 rounded-lg shadow-lg w-80 text-center transition-opacity duration-1000 opacity-0 animate-fadeIn"
              style={{ animationDuration: "1s", opacity: "1" }}
            >
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50"
            onClick={() => setErrorMessage("")}
          >
            <div
              className="bg-red-100 text-red-700 p-6 rounded-lg shadow-lg w-80 text-center transition-opacity duration-1000 opacity-0 animate-fadeIn"
              style={{ animationDuration: "1s", opacity: "1" }}
            >
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full rounded-md border p-2"
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 flex-1">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full rounded-md border p-2"
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full rounded-md border p-2"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`w-full rounded-md border p-2 ${
                  formData.password &&
                  !Object.values(passwordValidation).every(Boolean)
                    ? "border-red-500"
                    : ""
                }`}
                required
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formData.password && (
              <div className="text-sm space-y-1 mt-2">
                <p
                  className={
                    passwordValidation.hasMinLength
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ✓ At least 8 characters
                </p>
                <p
                  className={
                    passwordValidation.hasUpperCase
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ✓ At least one uppercase letter
                </p>
                <p
                  className={
                    passwordValidation.hasNumber
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ✓ At least one number
                </p>
                <p
                  className={
                    passwordValidation.hasSpecialChar
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ✓ At least one special character
                </p>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-2 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={
              isLoading || !Object.values(passwordValidation).every(Boolean)
            }
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <hr className="w-full border-gray-300" />
          <p className="text-sm text-gray-800 text-center">or</p>
          <hr className="w-full border-gray-300" />
        </div>

        <div className="space-x-6 flex justify-center">
          <button
            type="button"
            className="w-full shadow-md py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            onClick={() => signIn("google")}
          >
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}
