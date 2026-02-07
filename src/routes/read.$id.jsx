import { createFileRoute } from '@tanstack/react-router'
import { useBlog } from '../hooks/useBlog';
import { Navbar } from '../components/navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';

export const Route = createFileRoute('/read/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams();
    const { data: blog, isLoading, error } = useBlog(id);

    if (isLoading) return <div className="relative z-10 text-white p-8">Loading...</div>
    if (error) return <div className="relative z-10 text-white p-8">Error: {error.message}</div>
    if (!blog) return <div className="relative z-10 text-white p-8">Blog post not found</div>

    return (
        <div>
            <Navbar />

            <div className="relative z-10 px-4 md:px-20 lg:px-60 py-8">
                <article className="bg-black/60 backdrop-blur-sm rounded-lg shadow-lg p-8">
                    <h1 className="text-4xl font-bold mb-4 text-white">
                        {blog.title}
                    </h1>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeHighlight, rehypeKatex]}
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-4 text-white" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-3xl font-bold mb-3 text-white mt-8" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-2xl font-bold mb-2 text-white mt-6" {...props} />,
                            p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                            code: ({node, inline, ...props}) =>
                                inline
                                    ? <code className="bg-gray-800 px-2 py-1 rounded text-yellow-400" {...props} />
                                    : <code className="block bg-gray-900 p-4 rounded-lg overflow-x-auto" {...props} />,
                            a: ({node, ...props}) => <a className="text-yellow-400 hover:text-yellow-300 underline" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                        }}
                    >
                        {blog.content}
                    </ReactMarkdown>
                </article>
            </div>
        </div>
    )
}

