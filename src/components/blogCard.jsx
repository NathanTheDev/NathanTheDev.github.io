import { Link } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export const BlogCard = (props) => {
    return (
        <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-800">
            <Link to="/read/$id/" params={{ id: props.id }} className="text-2xl font-bold mb-3 text-zinc-100 hover:text-zinc-400 transition-colors duration-100">
                {props.title}
            </Link>

            <div className="line-clamp-1 overflow-hidden text-zinc-400 line-clamp-1 mb-4">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                {props.content}
            </ReactMarkdown>
            </div>

            <Link to="/read/$id/" params={{ id: props.id }} className="text-orange-400 hover:text-orange-600 cursor-pointer font-semibold transition-colors duration-100">
                Read More →
            </Link>
        </div>
    );
};
