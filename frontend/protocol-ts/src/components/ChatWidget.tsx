'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChatBubbleIcon } from '@/components/icons/ChatBubbleIcon'
import { PaperAirplaneIcon } from '@/components/icons/PaperAirplaneIcon'
import { SendIcon } from '@/components/icons/SendIcon'

type ChatMessage = {
  content: string
  sender: 'user' | 'assistant'
  sources?: Array<{
    section: string
    relevance_score: number
    preview: string
  }>
  metadata?: {
    response_time?: number
    chunks_retrieved?: number
  }
  isError?: boolean
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [stats, setStats] = useState<{
    status: string
    message_count: number
    chunk_count: number
  }>({
    status: 'Loading...',
    message_count: 0,
    chunk_count: 0,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize and handle chat open/close
  useEffect(() => {
    if (isOpen) {
      loadSuggestions()
      loadStats()
      
      // Set showSuggestions based on message history
      setShowSuggestions(messages.length <= 1)
      
      // Focus input when chat opens
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 300)
    }
    
    // Add keyboard shortcut (Shift + / or ?) to toggle chat
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.key === '/' && e.shiftKey) || e.key === '?') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      
      // Close with ESC key if open
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [isOpen])

  useEffect(() => {
    // Ensure scrolling happens after DOM updates
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 200)
    
    return () => clearTimeout(timeoutId)
  }, [messages])

  const scrollToBottom = () => {
    // Try multiple methods to ensure scrolling works across different browsers
    try {
      // Method 1: Using scrollIntoView on the end marker
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end'
        })
      }

      // Method 2: Direct scroll on container
      const container = document.querySelector('.chat-messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      console.error("Error scrolling chat:", err);
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setIsLoading(true)

    // Hide suggestions after first interaction
    if (showSuggestions) {
      setShowSuggestions(false)
    }

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { content: userMessage, sender: 'user' },
    ])

    try {
      // Call the Flask server directly
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          include_history: true,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json()

      if (data.success) {
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setMessages((prev) => [
          ...prev,
          {
            content: data.answer || "I don't have an answer for that at the moment.",
            sender: 'assistant',
            sources: data.sources || [],
            metadata: {
              response_time: data.response_time || 0,
              chunks_retrieved: data.chunks_retrieved || 0,
            },
          },
        ])
        
        // Update stats after a successful message
        setStats((prev) => ({
          ...prev,
          message_count: prev.message_count + 2, // +2 because user message + assistant reply
          chunk_count: data.chunks_retrieved ? prev.chunk_count + data.chunks_retrieved : prev.chunk_count,
        }))
        
        // After getting a response, load new suggestions
        loadSuggestions()
      } else {
        setMessages((prev) => [
          ...prev,
          {
            content: `Error: ${data.error || 'Something went wrong. Please try again.'}`,
            sender: 'assistant',
            isError: true,
          },
        ])
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          content: `Network error: Could not connect to AyushBridge chatbot. Please check that the server is running on port 5001.`,
          sender: 'assistant',
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
      // Ensure focus is returned to input for continued conversation
      setTimeout(() => {
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) inputElement.focus();
      }, 100);
    }
  }

  const loadSuggestions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/suggestions')
      const data = await response.json()

      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions.slice(0, 4)) // Limit to 4 suggestions for the widget
      }
    } catch (error) {
      console.error('Error loading suggestions:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/stats')
      const data = await response.json()

      if (data.success) {
        setStats({
          status: data.stats.is_initialized ? 'Online' : 'Offline',
          message_count: messages.length,
          chunk_count: data.stats.total_chunks || 0,
        })
      }
    } catch (error) {
      setStats((prev) => ({ ...prev, status: 'Offline' }))
    }
  }

  const resetConversation = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/reset', { method: 'POST' })
      const data = await response.json()

      if (data.success) {
        setMessages([
          {
            content: 'Conversation has been reset successfully!',
            sender: 'assistant',
          },
        ])
        setStats((prev) => ({ ...prev, message_count: 1 }))
        loadSuggestions()
        setShowSuggestions(true) // Show suggestions again after reset
      }
    } catch (error) {
      console.error('Error resetting conversation:', error)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSubmit()
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-emerald-600 text-white shadow-xl transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 animate-bounce-gentle"
        aria-label="Chat with AyushBridge AI"
      >
        <ChatBubbleIcon className="mx-auto h-7 w-7" />
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 h-[550px] w-[380px] flex flex-col rounded-2xl bg-white shadow-2xl transition-all border border-gray-200 animate-fade-in">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-4 text-white shadow-md flex-shrink-0">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-1 mr-2">
                  <ChatBubbleIcon className="h-5 w-5 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold">AyushBridge AI</h3>
              </div>
              <button
                onClick={toggleChat}
                className="rounded-full bg-white/20 w-7 h-7 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label="Close chat"
              >
                <span className="text-lg leading-none">&times;</span>
              </button>
            </div>
            <p className="text-xs opacity-90 ml-8">
              Ask me anything about AyushBridge terminology services
            </p>
          </div>

          {/* Chat messages */}
          <div 
            ref={messagesContainerRef}
            className="chat-messages-container flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-gray-50 to-white p-4 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent"
            style={{ 
              flexGrow: 1, 
              flexShrink: 1, 
              flexBasis: "auto", 
              overscrollBehavior: "contain", 
              WebkitOverflowScrolling: "touch"
            }}
          >
            <div className="min-h-full">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center px-6">
                  <div className="bg-emerald-100 rounded-full p-3 mb-4 animate-pulse">
                    <ChatBubbleIcon className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h4 className="font-medium text-emerald-800 text-lg">
                    Welcome to AyushBridge AI!
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Ask me anything about FHIR R4 terminology services,
                    installation, API usage, or Ayurvedic terminologies.
                  </p>
                  <div className="mt-6 bg-emerald-50 rounded-lg p-3 border border-emerald-100 w-full">
                    <p className="text-xs text-emerald-800">
                      <strong>Pro tip:</strong> Press <kbd className="bg-white px-1.5 py-0.5 rounded border shadow-sm font-mono text-[10px]">?</kbd> anywhere to open/close this chat
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 pb-2 w-full">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex w-full ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'assistant' && (
                        <div className="mr-2 flex-shrink-0 mt-1">
                          <div className="bg-emerald-100 rounded-full p-1">
                            <ChatBubbleIcon className="h-4 w-4 text-emerald-700" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] w-auto rounded-2xl px-4 py-3 break-words overflow-hidden ${
                          msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                            : msg.isError
                            ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                            : 'bg-white text-gray-800 shadow-md border border-gray-100 rounded-tl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed break-words overflow-hidden hyphens-auto">
                          {/* Handle URLs and code blocks to ensure they wrap properly */}
                          {msg.content.split(/(`{3}[\s\S]*?`{3}|`[\s\S]*?`|https?:\/\/[^\s]+)/).map((part, i) => {
                            if (part?.startsWith('```') && part?.endsWith('```')) {
                              // Code blocks
                              return (
                                <div key={i} className="my-2 p-2 bg-black/10 rounded-md overflow-x-auto text-xs font-mono">
                                  {part.replace(/^```[\s\S]*?\n/, '').replace(/```$/, '')}
                                </div>
                              );
                            } else if (part?.startsWith('`') && part?.endsWith('`')) {
                              // Inline code
                              return (
                                <code key={i} className="px-1 py-0.5 bg-black/10 rounded-sm font-mono text-xs">
                                  {part.replace(/^`|`$/g, '')}
                                </code>
                              );
                            } else if (part?.startsWith('http')) {
                              // URLs
                              return (
                                <a 
                                  key={i} 
                                  href={part} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline break-all hover:text-blue-600"
                                >
                                  {part}
                                </a>
                              );
                            } else {
                              // Regular text
                              return <span key={i}>{part}</span>;
                            }
                          })}
                        </div>
                        
                        {/* Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 border-t border-gray-200 pt-2">
                            <p className="text-xs font-medium text-gray-500">Sources:</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {msg.sources.map((source, index) => (
                                <span
                                  key={index}
                                  className="inline-block rounded-full bg-emerald-50 border border-emerald-100 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-100 transition-colors cursor-help max-w-full overflow-hidden text-ellipsis"
                                  title={source.preview}
                                >
                                  <span className="truncate max-w-[150px] inline-block align-bottom">
                                    {source.section}
                                  </span>{' '}
                                  <span className="whitespace-nowrap">
                                    ({(source.relevance_score * 100).toFixed(0)}%)
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Metadata */}
                        {msg.metadata && (
                          <div className="mt-1 text-right">
                            <span className="text-[10px] opacity-70 font-mono">
                              {msg.metadata.response_time?.toFixed(2)}s | {msg.metadata.chunks_retrieved} chunks
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* This empty div is used as a marker for scrolling to the bottom */}
            <div 
              ref={messagesEndRef} 
              className="h-4 w-full clear-both" 
              id="chat-messages-end"
            />
          </div>

          {/* Suggestions - only shown when no messages or when showSuggestions is true */}
          {suggestions.length > 0 && (messages.length === 0 || showSuggestions) && (
            <div className="bg-white px-4 py-2 border-t border-gray-100 flex-shrink-0">
              <p className="text-xs font-medium text-gray-500 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-full border border-emerald-200 bg-gray-50 px-3 py-1 text-xs text-emerald-800 hover:bg-emerald-100 transition-all hover:shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat input */}
          <form
            onSubmit={handleSubmit}
            className="flex border-t border-gray-200 bg-white p-4 shadow-md relative flex-shrink-0"
          >
            {/* Loading progress bar at the top of the form */}
            {isLoading && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500 bg-size-200 animate-gradient-x"></div>
            )}
            
            <div className="relative flex-1">
              <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about AyushBridge..."
                disabled={isLoading}
                className="w-full rounded-l-xl border border-r-0 border-gray-300 pl-4 pr-10 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm shadow-inner bg-gray-50 focus:bg-white transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center space-x-1">
                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.3s' }}></div>
                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="relative flex items-center justify-center rounded-r-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-white transition-all hover:from-emerald-700 hover:to-emerald-600 disabled:from-emerald-300 disabled:to-emerald-200 disabled:cursor-not-allowed hover:shadow-lg group overflow-hidden"
              aria-label="Send message"
            >
              <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              <span className="absolute inset-0 flex items-center justify-center">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <SendIcon className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                )}
              </span>
              <span className="invisible">
                <SendIcon className="h-5 w-5" />
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="flex justify-between items-center border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={resetConversation}
                className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
              
              <span className="text-gray-400">|</span>
              
              <div className="flex items-center">
                <span className="font-mono text-[10px] text-gray-500">{messages.length} msgs</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${stats.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="font-medium">{stats.status}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
