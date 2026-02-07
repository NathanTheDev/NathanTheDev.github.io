import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blog';

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blog'],
    queryFn: blogApi.getAll,
  })
}

export const useBlog = (id) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getById(id),
    enabled: !!id,
  })
}
