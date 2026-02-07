import { createFileRoute, Link } from '@tanstack/react-router';
import { useBlogs } from '../hooks/useBlog';

export const Route = createFileRoute('/blog')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: blogs, isLoading, error } = useBlogs();

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    console.log(blogs);
    return (
        <nav className="px-60 flex justify-end gap-10 bg-black/40 backdrop-blur-md rounded-xl overflow-hidden shadow-xl">
            <Link to="/" className="text-l font-bold  px-8 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer">Home</Link>
            <Link to="/about" className="text-l font-bold px-8 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer">About</Link>
            <Link to="/" className="text-l font-bold px-8 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer">Blog</Link>

        </nav>


    );
}
