'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Trash2, MessageSquare } from 'lucide-react'
import { authFetch } from '@/lib/api-response'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    email: string
    avatar?: string | null
  }
}

interface TaskCommentsProps {
  taskId: string
  projectId?: string
}

export default function TaskComments({ taskId, projectId }: TaskCommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const fetchComments = useCallback(async () => {
    if (!taskId) return
    
    try {
      setLoading(true)
      const response = await authFetch(`/api/tasks/comments?taskId=${taskId}`)
      const data = await response.json()
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [taskId])

  useEffect(() => {
    if (taskId) {
      fetchComments()
    }
  }, [taskId, fetchComments])

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return

    try {
      setSubmitting(true)
      const response = await authFetch('/api/tasks/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          userId: user.id,
          content: newComment.trim(),
        }),
      })

      const data = await response.json()
      if (data.comment) {
        setComments(prev => [data.comment, ...prev])
        setNewComment('')
        toast({ title: 'Success', description: 'Comment added' })
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast({ title: 'Error', description: 'Failed to add comment', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return

    try {
      const response = await authFetch(`/api/tasks/comments?commentId=${commentId}&userId=${user?.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId))
        toast({ title: 'Success', description: 'Comment deleted' })
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
      toast({ title: 'Error', description: 'Failed to delete comment', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Discussion</h3>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>

      {/* Add Comment Form */}
      <div className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={2}
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleAddComment()
            }
          }}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleAddComment}
            size="sm"
            disabled={submitting || !newComment.trim()}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Start the discussion!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {comment.author?.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{comment.author?.name || 'Unknown User'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {comment.author?.id === user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:text-destructive"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <p className="text-sm mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
