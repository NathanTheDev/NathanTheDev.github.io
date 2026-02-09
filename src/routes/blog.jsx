import { createFileRoute, Link } from '@tanstack/react-router';
import { useBlogs } from '../hooks/useBlog';
import { BlogCard } from '../components/blogCard';
import { Navbar } from '../components/navbar';

export const Route = createFileRoute('/blog')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: blogs, isLoading, error } = useBlogs();

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    console.log(blogs);
    return (
        <div className="min-h-screen">
            <Navbar />

            <p className="mt-10 mx-10 md:mx-50 lg:mx-100 p-5 justify-end bg-black/40 backdrop-blur-md text-xl text-center font-bold">Currently beginning to slowly progress through LeetCode Quest as
                a bit of a side distraction and to recover some data structures,
                and am documenting that here!</p>

            <div className="relative z-10 px-60 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                    <BlogCard key={blog.id} title={blog.title} content={blog.content} id={blog.id}/>
                ))}
            </div>
        </div>
    );
}
