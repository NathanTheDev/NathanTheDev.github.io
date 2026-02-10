import { Link } from '@tanstack/react-router';

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 px-4 md:px-20 lg:px-60 flex justify-end gap-10 bg-black/40 backdrop-blur-md verflow-hidden shadow-xl">
            <Link to="/" className="text-l font-bold  px-8 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer">Home</Link>
            <Link to="/" className="text-l font-bold px-8 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer">About</Link>
            <Link to="/blog" className="text-l font-bold px-8 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer">Blog</Link>

        </nav>

    )
}
