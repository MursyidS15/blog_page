"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BlogForm {
  title: string;
  description: string;
  email: string;
  image?: string;
}

const BlogSpot = () => {
  const { register, handleSubmit, setValue } = useForm<BlogForm>();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.email) {
        setUserEmail(user.email);
        setValue("email", user.email);
      }
    }
  }, [setValue]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserEmail(null);
    router.push("./auth/login");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: BlogForm) => {
    const newBlog = { ...data, date: new Date().toLocaleDateString() };
    const storedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    const updatedBlogs = [...storedBlogs, newBlog];

    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    router.push("/blogs");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">BlogSpot</h1>
        <div className="flex items-center space-x-4">
          {/* <Link href="/blogs" className="hover:underline">View Blogs</Link> */}
          {userEmail ? (
            <>
              <span className="text-sm bg-white text-green-700 px-3 py-1 rounded-md">{userEmail}</span>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="./auth/login" className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition">
                Login
              </Link>
              <Link href="./auth/register" className="bg-gray-500 px-3 py-1 rounded-md hover:bg-gray-600 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Form Create Blog */}
      <div className="max-w-3xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Create a Blog Spot</h1>

        {!userEmail ? (
          <p className="text-center text-red-500">Please login to create a blog.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Title</label>
              <input type="text" {...register("title", { required: true })} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Description</label>
              <textarea {...register("description", { required: true })} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500" rows={4} />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Your Email</label>
              <input type="email" value={userEmail || ""} disabled className="w-full p-2 border rounded-md bg-gray-100" />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-md" />}
            </div>
            <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition">
              Publish
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BlogSpot;
