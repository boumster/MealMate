import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../utilities/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../../styles/ChatBubble.css';

const ChatBubble: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (!lastMessage.isUser || isLoading) {
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100); // Small delay to ensure animation starts
            }
        }
    }, [messages, isOpen, isLoading]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        try {
            const userMessage = { text: inputText, isUser: true };
            setMessages(prev => [...prev, userMessage]);
            setInputText('');
            setIsLoading(true);

            const response = await sendChatMessage(inputText);

            if (response?.status === 200) {
                setMessages(prev => [...prev, {
                    text: response.response || 'No response received',
                    isUser: false
                }]);
            } else {
                throw new Error(`Server returned status: ${response?.status || 'unknown'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                text: 'Sorry, I encountered an error. Please try again.',
                isUser: false
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className={`chat-popup ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <h3>NutriBot - Your Personal Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="close-button">✕</button>
                </div>

                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.isUser ? 'user-message' : 'assistant-message'}`}
                        >
                            {msg.isUser ? (
                                msg.text
                            ) : (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="loading-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-container">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        className="chat-input"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !inputText.trim()}
                        className={`send-button ${isLoading || !inputText.trim() ? 'disabled' : ''}`}
                    >
                        ➤
                    </button>
                </div>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="chat-button"
            >
                💬
            </button>
        </div>
    );
};

export default ChatBubble;