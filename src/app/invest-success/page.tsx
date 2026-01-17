'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Home, Wallet } from "lucide-react"
import Link from "next/link"

export default function InvestSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-6 text-green-500">✓</div>
            <h1 className="text-3xl font-bold mb-4">Interest Expressed!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your investment interest
            </p>
            <div className="flex gap-4">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/marketplace">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Marketplace
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/dashboard/investor">
                  <Wallet className="mr-2 h-4 w-4" />
                  View Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
