'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Users,
  X,
  MoreHorizontal,
  Smile,
  Paperclip,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Message {
  id: number
  userId: string
  userName: string
  content: string
  timestamp: string
  isOwn?: boolean
}

interface User {
  id: string
  name: string
  isTyping: boolean
  status: 'online' | 'away' | 'offline'
}

interface TeamChatProps {
  roomId: string
  userId?: string
  userName?: string
}

export default function TeamChat({ roomId, userId, userName }: TeamChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [isTyping, setIsTyping] = useState(false)
  const [showUserList, setShowUserList] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  // Format timestamp
  const formatTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [])

  // Send message
  const sendMessage = useCallback(() => {
    if (!messageInput.trim() || !socketRef.current) return

    const newMessage: Message = {
      id: Date.now(),
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous',
      content: messageInput.trim(),
      timestamp: new Date().toISOString(),
      isOwn: true,
    }

    socketRef.current.emit('message:send', {
      userId: newMessage.userId,
      roomId,
      message: newMessage.content,
    })

    setMessageInput('')
    setIsTyping(false)
    scrollToBottom()
  }, [messageInput, userId, userName, roomId, scrollToBottom])

  // Handle typing
  const handleTyping = useCallback((value: string) => {
    setMessageInput(value)

    if (!socketRef.current) return

    if (value.length > 0 && !isTyping) {
      setIsTyping(true)
      socketRef.current.emit('typing:start', {
        userId: userId || 'anonymous',
        roomId,
      })
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      if (socketRef.current) {
        socketRef.current.emit('typing:stop', {
          userId: userId || 'anonymous',
          roomId,
        })
      }
    }, 1000)
  }, [isTyping, userId, roomId])

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  // Initialize Socket.IO connection
  useEffect(() => {
    // Dynamic import socket.io-client to avoid SSR issues
    const initSocket = async () => {
      try {
        const { io: socketIOClient } = await import('socket.io-client')

        const socket = socketIOClient('/', {
          path: '/api/socket',
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        })

        socketRef.current = socket

        // Connection established
        socket.on('connect', () => {
          console.log('Connected to team chat service')
          setIsConnected(true)

          // Join room
          socket.emit('room:join', {
            userId: userId || 'anonymous',
            roomId,
            userName: userName || 'Anonymous',
          })
        })

        // Room joined successfully
        socket.on('room:update', (data: any) => {
          console.log('Room updated:', data)
          if (data.users) {
            setOnlineUsers(data.users)
          }
        })

        // Receive message
        socket.on('message:received', (message: Message) => {
          const isOwn = message.userId === (userId || 'anonymous')
          setMessages((prev) => [
            ...prev,
            { ...message, isOwn },
          ])
          scrollToBottom()
        })

        // User joined
        socket.on('user:joined', (data: any) => {
          toast({
            title: 'User Joined',
            description: `${data.name} has joined the chat`,
          })
          setOnlineUsers((prev) => [...prev, data])
        })

        // User left
        socket.on('user:left', (data: any) => {
          setOnlineUsers((prev) => prev.filter((u) => u.id !== data.id))
          setTypingUsers((prev) => {
            const newSet = new Set(prev)
            newSet.delete(data.id)
            return newSet
          })
        })

        // Typing indicator
        socket.on('user:typing', (data: any) => {
          if (data.userId === (userId || 'anonymous')) return

          setTypingUsers((prev) => {
            const newSet = new Set(prev)
            if (data.isTyping) {
              newSet.add(data.userId)
            } else {
              newSet.delete(data.userId)
            }
            return newSet
          })
        })

        // @mention notification
        socket.on('notification:mention', (data: any) => {
          toast({
            title: `${data.from} mentioned you`,
            description: data.content,
          })
        })

        // Connection error
        socket.on('connect_error', (error: any) => {
          console.error('Socket connection error:', error)
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to chat. Retrying...',
            variant: 'destructive',
          })
        })

        // Disconnected
        socket.on('disconnect', () => {
          console.log('Disconnected from team chat service')
          setIsConnected(false)
          toast({
            title: 'Disconnected',
            description: 'Lost connection to chat. Reconnecting...',
            variant: 'destructive',
          })
        })
      } catch (error) {
        console.error('Failed to initialize socket:', error)
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to chat service',
          variant: 'destructive',
        })
      }
    }

    initSocket()

    // Cleanup on unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (socketRef.current) {
        socketRef.current.emit('room:leave', {
          userId: userId || 'anonymous',
          roomId,
        })
        socketRef.current.disconnect()
      }
    }
  }, [roomId, userId, userName, scrollToBottom, toast])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Team Chat</CardTitle>
            <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
              {isConnected ? 'Connected' : 'Connecting...'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserList(!showUserList)}
            >
              <Users className="h-4 w-4 mr-2" />
              <Badge variant="secondary" className="text-xs">
                {onlineUsers.length}
              </Badge>
            </Button>
          </div>
        </div>
      </CardHeader>

      {showUserList && (
        <div className="border-b p-4 bg-muted/50">
          <h4 className="text-sm font-medium mb-2">Online Members</h4>
          <div className="flex flex-wrap gap-2">
            {onlineUsers.map((user) => (
              <Badge key={user.id} variant="outline" className="gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.name}
                {user.isTyping && (
                  <span className="text-xs text-muted-foreground">typing...</span>
                )}
              </Badge>
            ))}
            {onlineUsers.length === 0 && (
              <span className="text-sm text-muted-foreground">No users online</span>
            )}
          </div>
        </div>
      )}

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {message.userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 max-w-[70%] ${message.isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.isOwn ? 'You' : message.userName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {typingUsers.size > 0 && (
            <div className="text-sm text-muted-foreground mt-4">
              {Array.from(typingUsers).map((id) => {
                const user = onlineUsers.find((u) => u.id === id)
                return user?.name
              }).filter(Boolean).join(', ')}{' '}
              typing...
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" title="Add emoji">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Attach file">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Type a message... (Shift+Enter for new line)"
              value={messageInput}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!isConnected}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!messageInput.trim() || !isConnected}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
