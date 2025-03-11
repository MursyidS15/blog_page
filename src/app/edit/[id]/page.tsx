"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

interface Blog {
  title: string;
  description: string;
  email: string;
  date: string;
  image?: string;
}

const EditPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const storedBlogs: Blog[] = JSON.parse(localStorage.getItem("blogs") || "[]");
      setBlogs(storedBlogs);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.email) {
        router.push("/login");
        return;
      }

      const blog = storedBlogs[Number(id)];
      if (blog) {
        setTitle(blog.title);
        setDescription(blog.description);
        setImage(blog.image || "");

        if (blog.email !== user.email) {
          alert("You are not authorized to edit this blog!");
          router.push("/");
        }
      } else {
        router.push("/blogs");
      }
    }
  }, [id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    const updatedBlogs = [...blogs];
    updatedBlogs[Number(id)] = {
      ...updatedBlogs[Number(id)],
      title,
      description,
      image,
    };
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    router.push("/blogs");
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-center">Edit Blog</h1>
      <div className="mt-6">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-4 text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={5}
        />

        {image && (
          <div className="mt-4">
            <p className="text-sm font-medium">Current Image:</p>
            <div className="relative w-full h-[300px]">
              <Image
                src={image}
                alt="Blog Image"
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
          </div>
        )}

        <label className="block mt-4 text-sm font-medium">Update Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md" />

        <button
          onClick={handleUpdate}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Update Blog
        </button>
      </div>
    </div>
  );
};

export default EditPage;
