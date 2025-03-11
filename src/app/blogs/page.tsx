"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Blog {
  title: string;
  description: string;
  email: string;
  date: string;
  image?: string;
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
      setBlogs(storedBlogs);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.email) {
        router.push("/login");
      } else {
        setUserEmail(user.email);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleDelete = (index: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      const updatedBlogs = blogs.filter((_, i) => i !== index);
      setBlogs(updatedBlogs);
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">BlogSpot</h1>
        <div className="flex items-center gap-4 ">
          {userEmail && <span className="text-sm">{userEmail}</span>}
          <Link href="/" className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-500 transition">
            Create Blog
          </Link>
          {userEmail && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition">
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Blog List */}
      <div className="max-w-3xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">All Blog Posts</h1>

        {blogs.length === 0 ? (
          <p className="text-gray-500 text-center">No blogs available.</p>
        ) : (
          <ul className="space-y-6">
            {blogs.map((blog, index) => (
              <li key={index} className="border p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-600">{blog.description.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500">By {blog.email} - {blog.date}</p>

                {/* Gambar dipindahkan ke bawah teks */}
                <img
                  src={blog.image || "/default-thumbnail.jpg"}
                  alt="Blog Image"
                  className="w-full h-auto max-h-[300px] object-contain rounded-md mt-3"
                />

                <div className="mt-3 flex gap-4">
                  <Link href={`/blogs/${index}`} className="text-green-700 font-semibold hover:underline">
                    Read More
                  </Link>

                  {/* Tampilkan Edit dan Delete hanya jika userEmail sama dengan blog.email */}
                  {userEmail === blog.email && (
                    <>
                      <Link href={`/edit/${index}`} className="text-blue-600 font-semibold hover:underline">
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
