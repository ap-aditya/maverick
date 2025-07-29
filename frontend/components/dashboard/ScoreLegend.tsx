"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info, Star, Target, AlertTriangle } from "lucide-react";

export function ScoreLegend() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 transition-all duration-200 group"
        >
          <Info className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-xl border-0" align="start">
        <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-lg">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Star className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Match Score Guide
                </h4>
                <p className="text-sm text-gray-600">
                  AI assessment of job-profile alignment
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full border border-green-200">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-green-800">
                    8-10 Points
                  </span>
                  <div className="px-2 py-0.5 bg-green-200 text-green-800 text-xs font-medium rounded">
                    Excellent
                  </div>
                </div>
                <p className="text-sm text-green-700">
                  Strong skill alignment, high compatibility
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-100">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full border border-yellow-200">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-yellow-800">
                    6-7 Points
                  </span>
                  <div className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">
                    Good
                  </div>
                </div>
                <p className="text-sm text-yellow-700">
                  Decent match, some skill gaps to consider
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-100 to-rose-100 rounded-full border border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-red-800">1-5 Points</span>
                  <div className="px-2 py-0.5 bg-red-200 text-red-800 text-xs font-medium rounded">
                    Stretch
                  </div>
                </div>
                <p className="text-sm text-red-700">
                  Significant skill gaps, growth opportunity
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 pt-0">
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span className="font-medium">💡 Tip:</span> Focus on 6+ scores
              for better success rates, but don&apos;t ignore lower scores if
              the role excites you!
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
