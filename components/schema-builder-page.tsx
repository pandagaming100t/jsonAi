"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { SchemaBuilder } from "@/components/schema-builder/SchemaBuilder"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Code2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function SchemaBuilderPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Code2 className="h-6 w-6 text-purple-600" />
                <span className="text-lg font-semibold">Schema Builder</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <SchemaBuilder />
      </main>
    </div>
  )
}