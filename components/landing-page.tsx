"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Code2, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import { useSession, signIn } from "next-auth/react"
import { UserNav } from "@/components/user-nav"
import { WaterfallEffect } from "@/components/WaterfallEffect"

const features = [
  {
    icon: Code2,
    title: "Visual Schema Builder",
    description: "Create complex JSON schemas with an intuitive drag-and-drop interface"
  },
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description: "Generate schemas instantly using natural language descriptions with Gemini AI"
  },
  {
    icon: Shield,
    title: "Type Safety",
    description: "Built with TypeScript for maximum reliability and developer experience"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Save, share, and collaborate on schemas with your team members"
  }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "TechCorp",
    content: "This tool has revolutionized how we handle API schemas. The AI generation is incredibly accurate.",
    rating: 5
  },
  {
    name: "Mike Johnson",
    role: "CTO",
    company: "StartupXYZ",
    content: "The visual interface makes schema creation accessible to our entire team, not just developers.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "DataFlow Inc",
    content: "We've reduced our schema creation time by 80%. The collaboration features are fantastic.",
    rating: 5
  }
]

export function LandingPage() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Schema Builder Pro
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
                Pricing
              </Link>
              {session ? (
                <div className="flex items-center space-x-4">
                  <Link href="/builder">
                    <Button variant="outline">Go to Builder</Button>
                  </Link>
                  <UserNav />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={() => signIn()}>
                    Sign In
                  </Button>
                  <Button onClick={() => signIn()}>
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t">
            <div className="px-4 py-4 space-y-4">
              <Link href="#features" className="block text-gray-600 hover:text-purple-600">
                Features
              </Link>
              <Link href="#testimonials" className="block text-gray-600 hover:text-purple-600">
                Testimonials
              </Link>
              <Link href="#pricing" className="block text-gray-600 hover:text-purple-600">
                Pricing
              </Link>
              {session ? (
                <div className="space-y-2">
                  <Link href="/builder">
                    <Button variant="outline" className="w-full">Go to Builder</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button variant="outline" onClick={() => signIn()} className="w-full">
                    Sign In
                  </Button>
                  <Button onClick={() => signIn()} className="w-full">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Build JSON Schemas
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Visually & Intelligently
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Create, validate, and manage JSON schemas with our powerful visual builder, 
                enhanced by AI assistance and real-time collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {session ? (
                  <Link href="/builder">
                    <Button size="lg" className="text-lg px-8 py-4">
                      Open Builder
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="text-lg px-8 py-4" onClick={() => signIn()}>
                    Start Building Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Development
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create, manage, and collaborate on JSON schemas efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full hover:shadow-lg transition-shadow ${index === 0 ? 'relative overflow-hidden' : ''}`}>
                  {index === 0 && <WaterfallEffect />}
                  <CardHeader className="relative z-10">
                    <feature.icon className="h-12 w-12 text-purple-600 mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See what our users are saying about Schema Builder Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base italic">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold">$0</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Up to 5 schemas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Basic AI assistance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Export to JSON</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => signIn()}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-purple-200 dark:border-purple-800">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold">$19</div>
                <CardDescription>For professional developers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Unlimited schemas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Advanced AI features</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Team collaboration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Priority support</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => signIn()}>
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold">Custom</div>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Everything in Pro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>SSO integration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Custom deployment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>24/7 support</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Better Schemas?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of developers who are already using Schema Builder Pro to streamline their workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => signIn()}>
              Start Building Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-purple-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Code2 className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold">Schema Builder Pro</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The most powerful and intuitive JSON schema builder for modern development teams.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <Link href="#features" className="block hover:text-white transition-colors">Features</Link>
                <Link href="#pricing" className="block hover:text-white transition-colors">Pricing</Link>
                <Link href="/builder" className="block hover:text-white transition-colors">Builder</Link>
                <Link href="#" className="block hover:text-white transition-colors">API</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <Link href="#" className="block hover:text-white transition-colors">Documentation</Link>
                <Link href="#" className="block hover:text-white transition-colors">Help Center</Link>
                <Link href="#" className="block hover:text-white transition-colors">Contact</Link>
                <Link href="#" className="block hover:text-white transition-colors">Status</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Schema Builder Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}