"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { register as registerUser } from "@/lib/api";

// Define the form validation schema
const schema = yup
  .object({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Must be a valid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(2, "Password must be at least 2 characters"),
    dateOfBirth: yup
      .date()
      .required("Date of Birth is required")
      .max(new Date(), "Date of Birth cannot be in the future"),
    age: yup
      .number()
      .required("Age is required")
      .positive("Age must be positive")
      .integer("Age must be a whole number")
      .min(18, "Must be at least 18 years old"),
    company: yup
      .string()
      .required("Company name is required")
      .min(2, "Company name must be at least 2 characters"),
    profileImage: yup
      .mixed<FileList>()
      .required("Profile photo is required")
      .test("fileType", "Only JPEG and PNG files are allowed", (value) => {
        if (!value) return false;
        return ["image/jpeg", "image/png"].includes(value[0]?.type);
      })
      .test("fileSize", "File must be less than 2MB", (value) => {
        if (!value) return false;
        return value[0]?.size <= 2000000;
      }),
  })
  .required();

type RegisterFormData = yup.InferType<typeof schema>;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  // Watch the file input for preview
  watch("profileImage");

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("dateOfBirth", new Date(data.dateOfBirth).toISOString());
      formData.append("age", data.age.toString());
      formData.append("company", data.company);
      formData.append("profileImage", imagePreview as string);

      await registerUser(formData);
      router.push("/");
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register("name")}
          className="mt-1 pt-2 px-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="mt-1 pt-2 px-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="text"
          {...register("password")}
          className="mt-1 pt-2 px-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Date of Birth Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          type="date"
          {...register("dateOfBirth")}
          className="mt-1 pt-2 px-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.dateOfBirth && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>

      {/* Age Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          {...register("age")}
          className="mt-1 pt-2 px-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.age && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>

      {/* Company Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          type="text"
          {...register("company")}
          className="mt-1 pt-2 px-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.company && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">
            {errors.company.message}
          </p>
        )}
      </div>

      {/* Profile Image Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Profile Photo
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          {...register("profileImage")}
          onChange={handleImageChange}
          className="mt-1 pt-2 px-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {errors.profileImage && (
          <p className="mt-1 pt-2 px-1 text-sm text-red-600">
            {errors.profileImage.message}
          </p>
        )}
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Register
      </button>
    </form>
  );
}
