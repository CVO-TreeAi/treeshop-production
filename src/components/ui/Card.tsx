'use client'

import React from 'react'

export interface CardProps {
  variant?: 'default' | 'glass' | 'elevated' | 'outline'
  className?: string
  children: React.ReactNode
  onClick?: () => void
  hover?: boolean
}

export function Card({ 
  variant = 'default', 
  className = '', 
  children, 
  onClick,
  hover = false,
  ...props 
}: CardProps) {
  const baseClasses = "transition-all duration-300"
  
  const variants = {
    default: "bg-gray-900 border border-gray-800 rounded-lg shadow-lg",
    glass: "glass-surface border border-white/20 rounded-lg backdrop-blur-lg bg-white/10",
    elevated: "bg-gray-900 border border-gray-800 rounded-lg shadow-2xl shadow-black/50",
    outline: "border-2 border-gray-700 rounded-lg bg-transparent"
  }
  
  const hoverEffects = hover ? "hover:scale-105 hover:shadow-xl hover:shadow-green-500/10 cursor-pointer" : ""
  const clickable = onClick ? "cursor-pointer" : ""
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverEffects} ${clickable} ${className}`
  
  return (
    <div 
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`p-6 pb-0 ${className}`}>
      {children}
    </div>
  )
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 pb-6 ${className}`}>
      {children}
    </div>
  )
}