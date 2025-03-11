"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Import next/image

interface Blog {
  title: string;
  description: string;
  email: string;
  date: string;
  image?: string;
}

const BlogDetail = () => {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && params?.id) {
      const storedBlogs: Blog[] = JSON.parse(localStorage.getItem("blogs") || "[]");
      const blogIndex = parseInt(params.id as string, 10);

      if (!isNaN(blogIndex) && storedBlogs[blogIndex]) {
        setBlog(storedBlogs[blogIndex]);
      }
    }
  }, [params]);

  if (!blog) {
    return <p className="text-center text-red-500 mt-10">Blog not found.</p>;
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">BlogSpot</h1>
        <Link href="/blogs" className="hover:underline">Back to Blogs</Link>
      </nav>

      {/* Blog Content */}
      <div className="max-w-3xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-green-700">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-4">By {blog.email} - {blog.date}</p>
        <p className="text-gray-700 leading-relaxed mb-4">{blog.description}</p>

        {/* Gambar di bawah teks menggunakan Next.js Image */}
        <div className="relative w-full h-[400px]">
          <Image
            src={blog.image || "/default-thumbnail.jpg"}
            alt="Blog Image"
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
